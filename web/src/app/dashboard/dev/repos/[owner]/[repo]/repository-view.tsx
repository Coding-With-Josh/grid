"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertCircle,
  GitBranch,
  GitFork,
  GitPullRequest,
  Star,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
// import CodeTab from "./code-tab";
// import BranchesTab from "./branches-tab";
// import PullRequestsTab from "./pulls-tab";
// import SettingsTab from "./settings-tab";

interface RepositoryViewProps {
  repoData: any;
  branchesData: any[];
  pullsData: any[];
  owner: string;
  repo: string;
}

export default function RepositoryView({
  repoData,
  branchesData,
  pullsData,
  owner,
  repo,
}: RepositoryViewProps) {
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

      toast.success('Repository visibility updated successfully');
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating repository visibility:', error);
      toast.error('Failed to update repository visibility');
    } finally {
      setIsUpdatingVisibility(false);
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

      toast.success(`Pull request ${action}d successfully`);
      // Refresh the page to show updated data
      window.location.reload();
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
          <p className="text-muted-foreground">
            {repoData.description || "No description provided"}
          </p>
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
          {/* <CodeTab repoData={repoData} /> */}
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          {/* <BranchesTab
            owner={owner}
            repo={repo}
            branches={branchesData}
            defaultBranch={repoData.default_branch}
          /> */}
        </TabsContent>

        <TabsContent value="pulls" className="space-y-4">
          {/* <PullRequestsTab
            owner={owner}
            repo={repo}
            pulls={pullsData}
            onPullRequestAction={handlePullRequestAction}
            isUpdatingPR={isUpdatingPR}
          /> */}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* <SettingsTab
            owner={owner}
            repo={repo}
            repoData={repoData}
            onDeleteRepository={handleDeleteRepository}
            onVisibilit yChange={handleVisibilityChange}
            isDeleting={isDeleting}
            isUpdatingVisibility={isUpdatingVisibility}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
