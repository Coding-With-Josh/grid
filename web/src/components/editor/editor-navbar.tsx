import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Save, 
  Upload,
  ArrowLeft,
  Undo,
  Redo,
  Undo2,
  Redo2,
  Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditorNavbarProps {
  projectId: string;
  isPreviewMode: boolean;
  onPreviewToggle: () => void;
  onPublish: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function EditorNavbar({
  onPreviewToggle,
  isPreviewMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onPublish,
}: EditorNavbarProps) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Editor</span>
          </div>
        </div>

        {/* Center section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="hover:bg-accent"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="hover:bg-accent"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Button
            variant={isPreviewMode ? "secondary" : "ghost"}
            size="sm"
            onClick={onPreviewToggle}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="default" size="sm" onClick={onPublish} className="gap-2">
            <Send className="h-4 w-4" />
            Publish
          </Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
