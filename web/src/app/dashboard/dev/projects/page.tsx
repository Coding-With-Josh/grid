'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, GitBranch, Star, Plus, Users2 } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Grid Core",
    description: "Core functionality and utilities",
    language: "TypeScript",
    stars: 128,
    forks: 23,
    contributors: 5,
    lastCommit: "2 hours ago",
  },
  {
    id: 2,
    title: "Grid UI",
    description: "Component library and design system",
    language: "TypeScript",
    stars: 89,
    forks: 12,
    contributors: 3,
    lastCommit: "1 day ago",
  },
  {
    id: 3,
    title: "Grid CLI",
    description: "Command line tools and utilities",
    language: "Rust",
    stars: 45,
    forks: 8,
    contributors: 2,
    lastCommit: "3 days ago",
  },
];

const languageColors = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Rust: "bg-orange-500",
  Python: "bg-green-500",
};

export default function DevProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Development Projects</h1>
          <p className="text-muted-foreground">Manage your code projects and repositories</p>
        </div>
        <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
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
                        languageColors[project.language]
                      }`}
                    />
                    <span className="text-sm">{project.language}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    {project.stars}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GitBranch className="h-4 w-4 mr-1" />
                    {project.forks}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users2 className="h-4 w-4 mr-1" />
                    {project.contributors}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last commit</span>
                  <span>{project.lastCommit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
