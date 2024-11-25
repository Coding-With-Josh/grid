'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Grid2x2,
  List,
  Search,
  Upload,
  Filter,
  MoreVertical,
  Video,
  Image as ImageIcon,
  FileText,
  Download,
  Trash,
  Share2,
} from "lucide-react";

const mediaItems = [
  {
    id: 1,
    title: "Grid Platform Overview",
    type: "Video",
    size: "45.2 MB",
    modified: "2024-01-28",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Feature Screenshots",
    type: "Image",
    size: "2.8 MB",
    modified: "2024-01-27",
    thumbnail: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Technical Documentation",
    type: "Document",
    size: "1.5 MB",
    modified: "2024-01-26",
    thumbnail: "/placeholder.svg",
  },
];

const typeIcons = {
  Video: Video,
  Image: ImageIcon,
  Document: FileText,
};

export default function ContentLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your media assets</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search media..." className="pl-9" />
        </div>
        <div className="flex gap-2 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
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
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {mediaItems.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video rounded-t-lg bg-secondary/20 relative group">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" className="text-white border-white hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-white border-white hover:text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium truncate">{item.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.size}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.modified).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {mediaItems.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-secondary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.size}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.modified).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {["video", "image", "document"].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {mediaItems
                  .filter((item) => item.type.toLowerCase() === type)
                  .map((item) => {
                    const Icon = typeIcons[item.type];
                    return (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        {/* Same card content as above */}
                      </Card>
                    );
                  })}
              </div>
            ) : (
              <div className="space-y-2">
                {mediaItems
                  .filter((item) => item.type.toLowerCase() === type)
                  .map((item) => {
                    const Icon = typeIcons[item.type];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-lg"
                      >
                        {/* Same list item content as above */}
                      </div>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
