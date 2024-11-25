'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, GitFork, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  isPrivate: boolean;
  updatedAt: string;
}

export function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/github/repositories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to fetch repositories. Please try again later.');
      toast.error('Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-[100px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-xl font-semibold">Error Loading Repositories</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error}
        </p>
        <Button onClick={fetchRepositories} variant="outline" className="gap-2">
          <Loader2 className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <GitFork className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Repositories Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find any repositories in your GitHub account.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.open('https://github.com/new', '_blank')}
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Create Repository
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {repositories.map((repo) => (
        <Card key={repo.id} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{repo.name}</span>
              {repo.isPrivate && (
                <Badge variant="secondary">Private</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Updated {formatDistanceToNow(new Date(repo.updatedAt))} ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {repo.description || 'No description provided'}
            </p>
            <div className="flex items-center mt-4 space-x-4">
              {repo.language && (
                <Badge variant="outline">{repo.language}</Badge>
              )}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">{repo.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="h-4 w-4" />
                <span className="text-sm">{repo.forks.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(repo.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Repository
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`${repo.url}/settings`, '_blank')}
            >
              Settings
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
