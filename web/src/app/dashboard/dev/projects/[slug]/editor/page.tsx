'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ArrowLeft,
  FileText,
  CheckCircle2,
  Link as LinkIcon,
  Search,
  Diamond,
  Box,
  LayoutGrid,
  Database,
  Cloud,
  Settings2,
  Languages,
  Laptop,
  Gamepad2,
  PaintBucket,
  TerminalSquare,
  Share2
} from "lucide-react";
import Link from "next/link";

interface EditorPageProps {
  params: { slug: string };
}

export default function EditorPage({ params }: EditorPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const commonElements = [
    { icon: FileText, label: 'Text', id: 'text' },
    { icon: LayoutGrid, label: 'Column', id: 'column' },
    { icon: LayoutGrid, label: 'Row', id: 'row' },
    { icon: Box, label: 'Container', id: 'container' },
    { icon: FileCode, label: 'Image', id: 'image' },
    { icon: Box, label: 'Button', id: 'button' },
  ];

  const layoutElements = [
    { icon: Box, label: 'Container', id: 'container' },
    { icon: LayoutGrid, label: 'Row', id: 'row' },
    { icon: LayoutGrid, label: 'Column', id: 'column' },
    { icon: Diamond, label: 'Stack', id: 'stack' },
    { icon: FileCode, label: 'Card', id: 'card' },
    { icon: LayoutGrid, label: 'ListView', id: 'listview' },
    { icon: LayoutGrid, label: 'GridView', id: 'gridview' },
    { icon: Box, label: 'Spacer', id: 'spacer' },
    { icon: Box, label: 'Divider', id: 'divider' },
    { icon: Box, label: 'VerticalDivider', id: 'verticaldivider' },
    { icon: Box, label: 'TabBar', id: 'tabbar' },
    { icon: Box, label: 'PageView', id: 'pageview' },
    { icon: Box, label: 'Carousel', id: 'carousel' },
    { icon: Box, label: 'Expandable', id: 'expandable' },
    { icon: Box, label: 'Wrap', id: 'wrap' },
  ];

  return (
    <div className="h-screen flex">
      {/* Left Sidebar */}
      <div className="w-[300px] border-r bg-background">
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for widget... (Ctrl + F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Commonly Used Elements</h3>
              <div className="grid grid-cols-3 gap-2">
                {commonElements.map((element) => (
                  <Card 
                    key={element.id}
                    className="p-3 hover:bg-accent cursor-pointer flex flex-col items-center justify-center space-y-1"
                  >
                    <element.icon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-center">{element.label}</span>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Layout Elements</h3>
              <div className="grid grid-cols-3 gap-2">
                {layoutElements.map((element) => (
                  <Card 
                    key={element.id}
                    className="p-3 hover:bg-accent cursor-pointer flex flex-col items-center justify-center space-y-1"
                  >
                    <element.icon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-center">{element.label}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/dev/projects/${params.slug}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-sm font-medium">HomePage</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Laptop className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-accent/10 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg p-8 text-center">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Drag Widgets Into Column</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] border-l bg-background">
        <div className="p-4">
          <h3 className="text-sm font-medium mb-4">Page Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Route Settings</label>
              <Input 
                value="HomePage" 
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <Input 
                placeholder="Describe your page here..."
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}