'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  FileCode,
  GitBranch,
  History,
  MessageSquare,
  Package,
  Play,
  Plus,
  Settings,
  TestTube2,
  Users2,
  Workflow,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailsProps {
  params: { slug: string };
}

export default function ProjectDetailsPage({ params }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const quickActions = [
    {
      title: "Run Tests",
      icon: TestTube2,
      description: "Run the test suite",
      onClick: () => console.log("Run tests"),
      color: "text-yellow-500",
    },
    {
      title: "Deploy",
      icon: Play,
      description: "Deploy to production",
      onClick: () => console.log("Deploy"),
      color: "text-green-500",
    },
    {
      title: "Dependencies",
      icon: Package,
      description: "Manage dependencies",
      onClick: () => console.log("Dependencies"),
      color: "text-blue-500",
    },
    {
      title: "Git Actions",
      icon: GitBranch,
      description: "View git actions",
      onClick: () => console.log("Git actions"),
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Name</h1>
          <p className="text-muted-foreground">Project description goes here</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card 
            key={action.title} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={action.onClick}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-secondary ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
            <Code2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="files" onClick={() => setActiveTab("files")}>
            <FileCode className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="activity" onClick={() => setActiveTab("activity")}>
            <History className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="tasks" onClick={() => setActiveTab("tasks")}>
            <Workflow className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" onClick={() => setActiveTab("team")}>
            <Users2 className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="discussions" onClick={() => setActiveTab("discussions")}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Key metrics and information about your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge>Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">April 12, 2023</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Repository</p>
                      <p className="text-sm">github.com/username/repo</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Framework</p>
                      <p className="text-sm">Next.js</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-secondary">
                          <History className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Updated dependencies</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="files">Files content</TabsContent>
        <TabsContent value="activity">Activity content</TabsContent>
        <TabsContent value="tasks">Tasks content</TabsContent>
        <TabsContent value="team">Team content</TabsContent>
        <TabsContent value="discussions">Discussions content</TabsContent>
      </Tabs>
    </div>
  );
}