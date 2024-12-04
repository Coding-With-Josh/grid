import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      name,
      description,
      visibility,
      initializeWithReadme,
      gitignoreTemplate,
      license,
    } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name,
        description,
        private: visibility === 'private',
        auto_init: initializeWithReadme,
        gitignore_template: gitignoreTemplate,
        license_template: license,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create repository' },
        { status: response.status }
      );
    }

    const repo = await response.json();
    return NextResponse.json(repo);
  } catch (error) {
    console.error('Error creating repository:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
