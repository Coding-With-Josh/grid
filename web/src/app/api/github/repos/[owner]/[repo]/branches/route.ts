import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, sha } = await request.json();

    const response = await fetch(
      `https://api.github.com/repos/${params.owner}/${params.repo}/git/refs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          ref: `refs/heads/${name}`,
          sha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create branch' },
        { status: response.status }
      );
    }

    const branch = await response.json();
    return NextResponse.json(branch);
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    const response = await fetch(
      `https://api.github.com/repos/${params.owner}/${params.repo}/git/refs/heads/${name}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to delete branch' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, protection } = await request.json();

    const response = await fetch(
      `https://api.github.com/repos/${params.owner}/${params.repo}/branches/${name}/protection`,
      {
        method: protection ? 'PUT' : 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        ...(protection && {
          body: JSON.stringify({
            required_status_checks: null,
            enforce_admins: true,
            required_pull_request_reviews: {
              dismissal_restrictions: {},
              dismiss_stale_reviews: true,
              require_code_owner_reviews: true,
            },
            restrictions: null,
          }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to update branch protection' },
        { status: response.status }
      );
    }

    if (protection) {
      const protectionSettings = await response.json();
      return NextResponse.json(protectionSettings);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error updating branch protection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
