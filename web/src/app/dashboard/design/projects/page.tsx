'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Plus, Filter } from "lucide-react";

const designProjects = [
  {
    id: 1,
    title: "Grid Design System",
    description: "Core design system components and guidelines",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    title: "Mobile App UI",
    description: "User interface design for the mobile application",
    status: "Review",
    progress: 90,
  },
  {
    id: 3,
    title: "Landing Page Redesign",
    description: "New landing page design with improved UX",
    status: "Planning",
    progress: 20,
  },
];

export default function DesignProjectsPage() {
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
          <Button size="sm" className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {designProjects.map((project) => (
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{project.status}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-[#14F195] transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
