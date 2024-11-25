'use client';

import { Button } from "@/components/ui/button";
import { Github, RefreshCw } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { RepositoryList } from "@/components/repository/repository-list";
import { toast } from "sonner";

export default function RepositoryPage() {
  const { data: session } = useSession();

  const handleConnectGithub = async () => {
    try {
      await signIn('github');
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      toast.error('Failed to connect GitHub. Please try again.');
    }
  };

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Repositories</h2>
          <p className="text-muted-foreground">
            View and manage your GitHub repositories
          </p>
        </div>
        <div className="flex items-center gap-4">
          {!session && (
            <Button onClick={handleConnectGithub} className="gap-2">
              <Github className="w-4 h-4" />
              Connect GitHub
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {!session ? (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <Github className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Connect your GitHub account</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Connect your GitHub account to view and manage your repositories directly from Grid.
          </p>
          <Button onClick={handleConnectGithub} className="gap-2">
            <Github className="w-4 h-4" />
            Connect GitHub
          </Button>
        </div>
      ) : (
        <RepositoryList />
      )}
    </div>
  );
}
