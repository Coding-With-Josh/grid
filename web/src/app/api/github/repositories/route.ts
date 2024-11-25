import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const accessToken = session.accessToken;
    if (!accessToken) {
      return new NextResponse('GitHub token not found', { status: 401 });
    }

    const response = await fetch('https://api.github.com/user/repos?sort=pushed&per_page=100', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API error:', error);
      return new NextResponse(
        `GitHub API error: ${response.status} ${response.statusText}`,
        { status: response.status }
      );
    }

    const repositories = await response.json();
    
    // Transform the data to match our interface
    const transformedRepos = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      visibility: repo.visibility,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      language: repo.language,
      pushed_at: repo.pushed_at,
      html_url: repo.html_url,
    }));

    return NextResponse.json(transformedRepos);
  } catch (error) {
    console.error('GitHub repositories fetch error:', error);
    return new NextResponse(
      'An error occurred while fetching repositories',
      { status: 500 }
    );
  }
}
