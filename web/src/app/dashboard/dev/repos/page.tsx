'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  Search,
  Plus,
  GitFork,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  visibility: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  pushed_at: string;
  html_url: string;
}

const languageColors = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Rust: "bg-orange-500",
  Python: "bg-green-500",
  MDX: "bg-purple-500",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  Ruby: "bg-pink-500",
  PHP: "bg-indigo-500",
  CSS: "bg-teal-500",
  HTML: "bg-orange-400",
};

export default function ReposPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { data: session } = useSession();

  const fetchRepositories = async () => {
    if (!session) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/github/repositories', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRepositories();
    }
  }, [session]);

  const handleConnectGithub = async () => {
    try {
      await signIn('github');
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      toast.error('Failed to connect GitHub');
    }
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <GitBranch className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Connect your GitHub account</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Connect your GitHub account to view and manage your repositories directly from Grid.
        </p>
        <Button onClick={handleConnectGithub} className="gap-2">
          <GitBranch className="w-4 h-4" />
          Connect GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">Manage your Git repositories</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchRepositories} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitFork className="h-4 w-4" />}
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
            onClick={() => window.open('https://github.com/new', '_blank')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Find a repository..."
          className="pl-9 border-border/40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredRepositories.map((repo) => (
          <Card key={repo.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {repo.name}
                    </a>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {repo.visibility}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{repo.description || 'No description provided'}</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`${repo.html_url}/stargazers`, '_blank')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  {repo.language && (
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          languageColors[repo.language] || 'bg-gray-500'
                        }`}
                      />
                      <span className="text-sm">{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    {repo.stargazers_count.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GitFork className="h-4 w-4 mr-1" />
                    {repo.forks_count.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {repo.open_issues_count.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <GitCommit className="h-4 w-4 mr-2" />
                  Last pushed {formatDistanceToNow(new Date(repo.pushed_at))} ago
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRepositories.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Search className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No repositories found</h3>
            <p className="text-muted-foreground text-center">
              We couldn't find any repositories matching '{searchQuery}'
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
