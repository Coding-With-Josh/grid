"use client";

import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { headers } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  GitPullRequest,
  Settings,
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Clock,
  GitCommit,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  homepage: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  default_branch: string;
}

interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  base: {
    ref: string;
  };
  head: {
    ref: string;
  };
}

const getGitHubData = async (accessToken: string | undefined, path: string) => {
  if (!accessToken) return null;
  
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
};

export default async function RepoPage({
  params: { owner, repo },
}: {
  params: { owner: string; repo: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    redirect("/api/auth/signin");
  }

  try {
    const [repoData, branchesData, pullsData] = await Promise.all([
      getGitHubData(session.accessToken, `/repos/${owner}/${repo}`),
      getGitHubData(session.accessToken, `/repos/${owner}/${repo}/branches`),
      getGitHubData(session.accessToken, `/repos/${owner}/${repo}/pulls`),
    ]);

    if (!repoData || !branchesData || !pullsData) {
      throw new Error("Failed to fetch repository data");
    }

    return (
      <RepositoryView
        repoData={repoData}
        branchesData={branchesData}
        pullsData={pullsData}
        owner={owner}
        repo={repo}
        session={session}
      />
    );
  } catch (error) {
    console.error("Error in RepoPage:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-lg font-medium">Error Loading Repository</h2>
        <p className="text-sm text-muted-foreground">
          There was an error loading the repository data. Please try again later.
        </p>
      </div>
    );
  }
}

const RepositoryView = ({
  repoData,
  branchesData,
  pullsData,
  owner,
  repo,
  session
}: {
  repoData: Repository;
  branchesData: Branch[];
  pullsData: PullRequest[];
  owner: string;
  repo: string;
  session: any
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isUpdatingPR, setIsUpdatingPR] = useState(false);

  const handleDeleteRepository = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/github/repos/${owner}/${repo}/settings`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete repository');
      }

      toast.success('Repository deleted successfully');
      // Redirect to repositories page
      window.location.href = '/dashboard/dev/repos';
    } catch (error) {
      console.error('Error deleting repository:', error);
      toast.error('Failed to delete repository');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleVisibilityChange = async () => {
    try {
      setIsUpdatingVisibility(true);
      const response = await fetch(`/api/github/repos/${owner}/${repo}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private: !repoData.private,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update repository visibility');
      }

      const updatedRepo = await response.json();
      toast.success('Repository visibility updated successfully');
    } catch (error) {
      console.error('Error updating repository visibility:', error);
      toast.error('Failed to update repository visibility');
    } finally {
      setIsUpdatingVisibility(false);
      setIsVisibilityDialogOpen(false);
    }
  };

  const handlePullRequestAction = async (number: number, action: 'merge' | 'close') => {
    try {
      setIsUpdatingPR(true);
      const response = await fetch(`/api/github/repos/${owner}/${repo}/pulls`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} pull request`);
      }

      // Refresh pull requests
      const updatedPRs = await getGitHubData(session.accessToken, `/repos/${owner}/${repo}/pulls`);
      toast.success(`Pull request ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing pull request:`, error);
      toast.error(`Failed to ${action} pull request`);
    } finally {
      setIsUpdatingPR(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{repoData.name}</h1>
            <Badge variant={repoData.private ? "outline" : "default"}>
              {repoData.private ? "Private" : "Public"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{repoData.description || "No description provided"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Star className="h-4 w-4" />
            Star
            <Badge variant="secondary" className="ml-1">
              {repoData.stargazers_count}
            </Badge>
          </Button>
          <Button variant="outline" className="gap-2">
            <GitFork className="h-4 w-4" />
            Fork
            <Badge variant="secondary" className="ml-1">
              {repoData.forks_count}
            </Badge>
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Watch
            <Badge variant="secondary" className="ml-1">
              {repoData.watchers_count}
            </Badge>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="branches">
            Branches ({branchesData.length})
          </TabsTrigger>
          <TabsTrigger value="pulls">
            Pull Requests ({pullsData.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="font-medium">Default branch:</span>
                  <Badge variant="outline">{repoData.default_branch}</Badge>
                </div>
              </div>
              {/* Add file browser and code content here */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          {branchesData.map((branch) => (
            <Card key={branch.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="font-medium">{branch.name}</span>
                  {branch.protected && (
                    <Badge variant="secondary">Protected</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <GitCommit className="h-4 w-4 mr-2" />
                    {branch.commit.sha.substring(0, 7)}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pulls" className="space-y-4">
          {pullsData.map((pr) => (
            <Card key={pr.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4" />
                    <span className="font-medium">#{pr.number} {pr.title}</span>
                    <Badge
                      variant={
                        pr.state === "open"
                          ? "default"
                          : pr.merged_at
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {pr.merged_at ? "Merged" : pr.state}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pr.user.login} wants to merge {pr.head.ref} into {pr.base.ref}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pr.state === "open" && !isUpdatingPR && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePullRequestAction(pr.number, 'close')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Close
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
                        onClick={() => handlePullRequestAction(pr.number, 'merge')}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Merge
                      </Button>
                    </>
                  )}
                  {isUpdatingPR && (
                    <Button disabled>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </Button>
                  )}
                  {pr.state !== "open" && (
                    <span className="text-sm text-muted-foreground">
                      {pr.merged_at
                        ? `Merged ${format(new Date(pr.merged_at), "MMM d, yyyy")}`
                        : `Closed ${format(new Date(pr.closed_at!), "MMM d, yyyy")}`}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  These actions are destructive and cannot be undone.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Change repository visibility</h4>
                    <p className="text-sm text-muted-foreground">
                      {repoData.private
                        ? "Make this repository public"
                        : "Make this repository private"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive"
                    onClick={() => setIsVisibilityDialogOpen(true)}
                    disabled={isUpdatingVisibility}
                  >
                    {isUpdatingVisibility ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Change visibility"
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Delete this repository</h4>
                    <p className="text-sm text-muted-foreground">
                      Once deleted, it cannot be recovered.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete repository"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Repository Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Repository</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this repository? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRepository}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Repository"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Visibility Dialog */}
      <Dialog open={isVisibilityDialogOpen} onOpenChange={setIsVisibilityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Repository Visibility</DialogTitle>
            <DialogDescription>
              {repoData.private
                ? "Making this repository public will allow anyone to see it."
                : "Making this repository private will restrict access to you and your collaborators."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVisibilityDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVisibilityChange}
              disabled={isUpdatingVisibility}
              className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
            >
              {isUpdatingVisibility ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                `Make ${repoData.private ? "Public" : "Private"}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
