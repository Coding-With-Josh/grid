'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Image as ImageIcon, FileText, Plus, Filter } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Getting Started with Grid",
    description: "Introduction tutorial series",
    type: "Video",
    status: "In Progress",
    progress: 75,
    dueDate: "2024-02-15",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Grid Design System",
    description: "Visual design guidelines",
    type: "Document",
    status: "Review",
    progress: 90,
    dueDate: "2024-02-10",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Feature Highlights",
    description: "Product feature showcase",
    type: "Image",
    status: "Planning",
    progress: 30,
    dueDate: "2024-02-20",
    thumbnail: "/placeholder.svg",
  },
];

const typeIcons = {
  Video: Video,
  Image: ImageIcon,
  Document: FileText,
};

export default function ContentProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Projects</h1>
          <p className="text-muted-foreground">Manage your content creation projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const Icon = typeIcons[project.type];
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video rounded-t-lg bg-secondary/20 relative group">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="outline" className="text-white border-white hover:text-white">
                          View Project
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={
                            project.status === "In Progress"
                              ? "border-[#14F195] text-[#14F195]"
                              : project.status === "Review"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-muted-foreground"
                          }
                        >
                          {project.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Due {new Date(project.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-[#14F195] transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {["video", "image", "document"].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.type.toLowerCase() === type)
                .map((project) => {
                  const Icon = typeIcons[project.type];
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      {/* Same card content as above */}
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
