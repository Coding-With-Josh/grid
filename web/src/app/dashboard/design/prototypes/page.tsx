'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Plus, ExternalLink, Users } from "lucide-react";

const prototypes = [
  {
    id: 1,
    title: "Mobile App Flow",
    description: "User onboarding and authentication flow",
    status: "Active",
    collaborators: 3,
    lastUpdated: "2 hours ago",
    previewUrl: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Dashboard Interactions",
    description: "Interactive components and animations",
    status: "Draft",
    collaborators: 2,
    lastUpdated: "1 day ago",
    previewUrl: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Settings Panel",
    description: "User preferences and configuration UI",
    status: "In Review",
    collaborators: 4,
    lastUpdated: "3 days ago",
    previewUrl: "/placeholder.svg",
  },
];

export default function PrototypesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prototypes</h1>
          <p className="text-muted-foreground">Create and manage interactive prototypes</p>
        </div>
        <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
          <Plus className="h-4 w-4 mr-2" />
          New Prototype
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prototypes.map((prototype) => (
          <Card key={prototype.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-video rounded-t-lg bg-secondary/20 relative group">
                <img
                  src={prototype.previewUrl}
                  alt={prototype.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" className="text-white border-white hover:text-white">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{prototype.title}</CardTitle>
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>{prototype.description}</CardDescription>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      prototype.status === "Active"
                        ? "border-[#14F195] text-[#14F195]"
                        : "border-muted-foreground"
                    }
                  >
                    {prototype.status}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {prototype.collaborators}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Updated {prototype.lastUpdated}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
