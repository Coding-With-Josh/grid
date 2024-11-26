'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, GitBranch, Star, Plus, Users2 } from "lucide-react";
import Link from "next/link";
import { CreateProjectDialog } from "@/components/modals/create-project-dialog";
import CreateProjectModal from "./_create-project-modal";

const projects = [
  {
    id: 1,
    title: "Grid Core",
    slug: "grid-core",
    description: "Core functionality and utilities",
    type: "DApp",
    likes: 128,
    members: 5,
    createdAt: "2 days ago",
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Grid UI",
    slug: "grid-ui",
    description: "Component library and design system",
    type: "DApp",
    likes: 89,
    members: 3,
    createdAt: "2 days ago",
    updatedAt: "1 day ago",

  },
  {
    id: 3,
    title: "Grid CLI",
    slug: "grid-cli",
    description: "Command line tools and utilities",
    type: "CLI",
    likes: 45,
    members: 2,
    createdAt: "2 days ago",
    updatedAt: "3 minutes ago",
  },
  {
    id: 3,
    title: "Test",
    slug: "test",
    likes: 87,
    description: "Testing the app",
    type: "Smart Contract",
    members: 2,
    createdAt: "2 days ago",
    updatedAt: "Just now",
  },
];


const typeColors = {
  DApp: "bg-blue-500",
  "Smart Contract": "bg-yellow-500",
  web: "bg-orange-500",
  cli: "bg-green-500",
};

export default function DevProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Development Projects</h1>
          <p className="text-muted-foreground">Manage your code projects and repositories</p>
        </div>
        <CreateProjectModal/>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link href={`/dashboard/dev/projects/${project.slug}`}><Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
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
                      className={`w-3 h-3 rounded-full mr-2 ${typeColors[project.type]
                        }`}
                    />
                    <span className="text-sm">{project.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    {project.likes}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users2 className="h-4 w-4 mr-1" />
                    {project.members}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Updated last</span>
                  <span>{project.updatedAt}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created at</span>
                  <span>{project.createdAt}</span>
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
