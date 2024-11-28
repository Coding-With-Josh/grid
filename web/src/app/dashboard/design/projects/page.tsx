'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Filter, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProjectModal from "./_create-project-modal";

interface DesignProject {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    name: string | null;
    image: string | null;
  };
  _count: {
    tasks: number;
    assets: number;
  };
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-yellow-500",
  IN_PROGRESS: "bg-blue-500",
  REVIEW: "bg-purple-500",
  COMPLETED: "bg-green-500",
};

export default function DesignProjectsPage() {
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/design/projects');
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
            <h1 className="text-3xl font-bold tracking-tight">Design Projects</h1>
            <p className="text-muted-foreground">Manage and track your design projects</p>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-[70px]" />
            <Skeleton className="h-9 w-[120px]" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-1">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
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
          <h1 className="text-3xl font-bold tracking-tight">Design Projects</h1>
          <p className="text-muted-foreground">Manage and track your design projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <CreateProjectModal onSuccess={fetchProjects} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <Palette className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {project.type.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        statusColors[project.status]
                      }`}
                    />
                    <span className="text-sm">{project.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks</span>
                  <span className="font-medium">{project._count.tasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assets</span>
                  <span className="font-medium">{project._count.assets}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
