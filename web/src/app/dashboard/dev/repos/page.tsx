'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Copy,
  Download,
  Check,
  Lock,
  Globe,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  visibility: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface CreateRepoForm {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  initializeWithReadme: boolean;
  gitignoreTemplate: string;
  license: string;
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

const gitignoreTemplates = [
  { value: "Node", label: "Node" },
  { value: "Python", label: "Python" },
  { value: "Rust", label: "Rust" },
  { value: "Java", label: "Java" },
  { value: "Go", label: "Go" },
];

const licenses = [
  { value: "mit", label: "MIT License" },
  { value: "apache-2.0", label: "Apache License 2.0" },
  { value: "gpl-3.0", label: "GNU GPLv3" },
  { value: "bsd-3-clause", label: "BSD 3-Clause" },
  { value: "unlicense", label: "The Unlicense" },
];

export default function ReposPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data: session, status } = useSession();

  const fetchRepositories = async () => {
    if (!session?.accessToken) return;

    try {
      setIsLoading(true);
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data: Repository[] = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchRepositories();
    }
  }, [session?.accessToken]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-medium">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">
          Please sign in with GitHub to view your repositories.
        </p>
        <Button onClick={() => signIn("github")}>
          Sign in with GitHub
        </Button>
      </div>
    );
  }

  const handleConnectGithub = async () => {
    try {
      await signIn('github');
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      toast.error('Failed to connect GitHub');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCloneClick = (repo: Repository) => {
    setSelectedRepo(repo);
    setShowCloneDialog(true);
  };

  const handleCreateRepository = async () => {
    if (!session?.accessToken) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/github/create-repository', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        throw new Error('Failed to create repository');
      }

      const newRepo = await response.json();
      setRepositories([newRepo, ...repositories]);
      setShowCreateDialog(false);
      toast.success('Repository created successfully!');
      
      // Reset form
      setCreateForm({
        name: "",
        description: "",
        visibility: "public",
        initializeWithReadme: true,
        gitignoreTemplate: "Node",
        license: "mit",
      });
    } catch (error) {
      console.error('Error creating repository:', error);
      toast.error('Failed to create repository');
    } finally {
      setIsCreating(false);
    }
  };

  const [createForm, setCreateForm] = useState<CreateRepoForm>({
    name: "",
    description: "",
    visibility: "public",
    initializeWithReadme: true,
    gitignoreTemplate: "Node",
    license: "mit",
  });

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">Manage your Git repositories</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchRepositories}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <GitFork className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button
            className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-8 w-20 bg-muted rounded" />
                </div>
                <div className="h-4 w-96 bg-muted rounded" />
                <div className="flex items-center gap-6">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : repositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <GitFork className="w-12 h-12 text-muted-foreground" />
          <h2 className="text-lg font-medium">No repositories found</h2>
          <p className="text-sm text-muted-foreground">
            Create a new repository or refresh to sync with GitHub.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRepositories.map((repo) => (
            <Link
              key={repo.id}
              href={repo.owner ? `/dashboard/dev/repos/${repo.owner.login}/${repo.name}` : '#'}
              className="block"
            >
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={repo.owner?.avatar_url}
                        alt={repo.owner?.login}
                        className="w-6 h-6 rounded-full"
                      />
                      <h3 className="text-lg font-medium hover:text-primary">
                        {repo.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCloneClick(repo);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Clone
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{repo.description || 'No description provided'}</CardDescription>
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
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Clone Dialog */}
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Repository</DialogTitle>
            <DialogDescription>
              Choose a method to clone {selectedRepo?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">HTTPS</h3>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={selectedRepo?.clone_url}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(selectedRepo?.clone_url)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">CLI</h3>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`git clone ${selectedRepo?.clone_url}`}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`git clone ${selectedRepo?.clone_url}`)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">GitHub CLI</h3>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`gh repo clone ${selectedRepo?.full_name}`}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`gh repo clone ${selectedRepo?.full_name}`)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Repository Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a new repository</DialogTitle>
            <DialogDescription>
              A repository contains all your project's files, revision history, and collaborator discussions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Repository name</Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="awesome-project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="A short description of your project"
              />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={createForm.visibility === 'public' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setCreateForm({ ...createForm, visibility: 'public' })}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </Button>
                <Button
                  type="button"
                  variant={createForm.visibility === 'private' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setCreateForm({ ...createForm, visibility: 'private' })}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Private
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="readme"
                  checked={createForm.initializeWithReadme}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, initializeWithReadme: checked })}
                />
                <Label htmlFor="readme">Initialize with a README</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gitignore">.gitignore template</Label>
              <Select
                value={createForm.gitignoreTemplate}
                onValueChange={(value) => setCreateForm({ ...createForm, gitignoreTemplate: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gitignoreTemplates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Select
                value={createForm.license}
                onValueChange={(value) => setCreateForm({ ...createForm, license: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {licenses.map((license) => (
                    <SelectItem key={license.value} value={license.value}>
                      {license.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRepository}
              disabled={!createForm.name || isCreating}
              className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create repository
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
  );
}
