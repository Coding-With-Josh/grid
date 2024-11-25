'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Grid, List } from "lucide-react";

const assets = [
  {
    id: 1,
    name: "Logo.svg",
    type: "SVG",
    size: "45 KB",
    modified: "2 days ago",
    url: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Hero Image.png",
    type: "PNG",
    size: "1.2 MB",
    modified: "1 week ago",
    url: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Icons Pack",
    type: "SVG",
    size: "156 KB",
    modified: "3 days ago",
    url: "/placeholder.svg",
  },
  // Add more assets as needed
];

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage your design assets and resources</p>
        </div>
        <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
          <Upload className="h-4 w-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      <div className="flex flex-col items-start justify-center space-y-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-9 border-border/40"
          />
        </div>
        <Tabs defaultValue="grid" className="w-auto space-y-3.5">
          <TabsList className="grid w-24 grid-cols-2">
            <TabsTrigger value="grid">   
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square rounded-t-lg bg-secondary/20 flex items-center justify-center">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-1/2 h-1/2 object-contain"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{asset.name}</CardTitle>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{asset.type}</span>
                        <span>{asset.size}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded bg-secondary/20 flex items-center justify-center">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.modified}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{asset.type}</span>
                        <span>{asset.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
