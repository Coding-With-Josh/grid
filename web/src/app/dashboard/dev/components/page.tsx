'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Copy, ExternalLink } from "lucide-react";

const components = [
  {
    id: 1,
    name: "Button",
    description: "Interactive button component with variants",
    category: "Form",
    usage: 245,
    status: "Stable",
  },
  {
    id: 2,
    name: "Card",
    description: "Versatile card container component",
    category: "Layout",
    usage: 189,
    status: "Stable",
  },
  {
    id: 3,
    name: "Dialog",
    description: "Modal dialog with customizable content",
    category: "Overlay",
    usage: 156,
    status: "Beta",
  },
  {
    id: 4,
    name: "Select",
    description: "Dropdown select component with search",
    category: "Form",
    usage: 134,
    status: "Beta",
  },
  {
    id: 5,
    name: "Table",
    description: "Data table with sorting and filtering",
    category: "Data Display",
    usage: 98,
    status: "Alpha",
  },
];

const categories = ["All", "Form", "Layout", "Overlay", "Data Display", "Navigation"];

export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Components</h1>
          <p className="text-muted-foreground">Browse and manage reusable components</p>
        </div>
        <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
          <Plus className="h-4 w-4 mr-2" />
          New Component
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-9 border-border/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="border-border/40"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <Card key={component.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{component.name}</CardTitle>
                  <CardDescription>{component.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-secondary/20">
                    {component.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      component.status === "Stable"
                        ? "border-[#14F195] text-[#14F195]"
                        : component.status === "Beta"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-red-500 text-red-500"
                    }
                  >
                    {component.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage count</span>
                  <span>{component.usage}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
