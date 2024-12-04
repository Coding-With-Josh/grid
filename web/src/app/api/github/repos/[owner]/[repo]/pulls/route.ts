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

    const { title, body, head, base } = await request.json();

    const response = await fetch(`https://api.github.com/repos/${params.owner}/${params.repo}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create pull request' },
        { status: response.status }
      );
    }

    const pr = await response.json();
    return NextResponse.json(pr);
  } catch (error) {
    console.error('Error creating pull request:', error);
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

    const { number, action } = await request.json();

    let endpoint = `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${number}`;
    if (action === 'merge') {
      endpoint = `${endpoint}/merge`;
    }

    const response = await fetch(endpoint, {
      method: action === 'merge' ? 'PUT' : 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(
        action === 'merge'
          ? { merge_method: 'merge' }
          : { state: 'closed' }
      ),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || `Failed to ${action} pull request` },
        { status: response.status }
      );
    }

    if (action === 'merge') {
      return new NextResponse(null, { status: 204 });
    }

    const pr = await response.json();
    return NextResponse.json(pr);
  } catch (error) {
    console.error('Error updating pull request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
