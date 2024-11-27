'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, GitBranch, Star, Users2 } from "lucide-react";
import Link from "next/link";
import CreateProjectModal from "./_create-project-modal";
import { useEffect, useState } from "react";
import { Project, User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectWithDetails extends Project {
  creator: {
    name: string | null;
    image: string | null;
  };
  collaborators: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
  _count: {
    tasks: number;
    files: number;
  };
}

const typeColors: Record<string, string> = {
  DAPP: "bg-blue-500",
  SMART_CONTRACT: "bg-yellow-500",
  WEB: "bg-orange-500",
  CLI: "bg-green-500",
  AI: "bg-purple-500",
  MOBILE: "bg-pink-500",
  OTHER: "bg-gray-500",
};

export default function DevProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Development Projects</h1>
            <p className="text-muted-foreground">Manage your code projects and repositories</p>
          </div>
          <CreateProjectModal onSuccess={fetchProjects} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="cursor-pointer">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Development Projects</h1>
          <p className="text-muted-foreground">Manage your code projects and repositories</p>
        </div>
        <CreateProjectModal onSuccess={fetchProjects} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link href={`/dashboard/dev/projects/${project.id}`} key={project.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-muted-foreground" />
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          typeColors[project.category]
                        }`}
                      />
                      <span className="text-sm">{project.category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GitBranch className="h-4 w-4 mr-1" />
                      {project._count.files}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users2 className="h-4 w-4 mr-1" />
                      {project.collaborators.length + 1}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
