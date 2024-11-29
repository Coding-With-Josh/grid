'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowLeft,
  FileText,
  CheckCircle2,
  Link as LinkIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";

interface ProjectDetailsProps {
  params: { slug: string };
}

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  category: string;
  projectType: string;
  visibility: string;
  repository?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    image: string;
  };
  collaborators: {
    id: string;
    name: string;
    image: string;
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    order: number;
  }[];
  files: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

function ProjectDetailsPage({ params }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${params.slug}`);
        const data = await response.json();
        setProject(data.project);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard/dev/projects">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <Badge variant="secondary" className="ml-2">{project.projectType}</Badge>
        
        <div className="self-end">
          <Button 
            onClick={() => router.push(`/dashboard/dev/projects/${project.slug}/editor`)}
            className="bg-[#14F195] hover:bg-[#14F195]/90 text-black"
          >
            <Code2 className="h-4 w-4 mr-2" />
            Open Editor
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="overview">
            <Workflow className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileCode className="mr-2 h-4 w-4" /> Files
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users2 className="mr-2 h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <Badge variant="outline">{project.visibility}</Badge>
              </div>
              {project.repository && (
                <div>
                  <p className="text-sm text-muted-foreground">Repository</p>
                  <Link href={project.repository} target="_blank">
                    <Button variant="link" className="p-0">
                      <GitBranch className="mr-2 h-4 w-4" /> View Repository
                    </Button>
                  </Link>
                </div>
              )}
              {project.liveUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Live URL</p>
                  <Link href={project.liveUrl} target="_blank">
                    <Button variant="link" className="p-0">
                      <LinkIcon className="mr-2 h-4 w-4" /> View Live Site
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>Manage and track project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks created yet</p>
              ) : (
                <div className="space-y-2">
                  {project.tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between border-b pb-2">
                      <span>{task.title}</span>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Manage project documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              {project.files.length === 0 ? (
                <p className="text-muted-foreground">No files uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {project.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between border-b pb-2">
                      <span>{file.name}</span>
                      <Badge variant="outline">{file.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" /> Upload File
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>Collaborators and team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={project.creator.image} alt={project.creator.name} />
                  <AvatarFallback>{project.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.creator.name}</p>
                  <p className="text-xs text-muted-foreground">Project Creator</p>
                </div>
              </div>
              {project.collaborators.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Collaborators</h4>
                  <div className="space-y-2">
                    {project.collaborators.map(collaborator => (
                      <div key={collaborator.id} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={collaborator.image} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collaborator.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" /> Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage project configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Project Category</p>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Created</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Last Updated</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <Button variant="destructive" className="w-full">
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectDetailsPage;