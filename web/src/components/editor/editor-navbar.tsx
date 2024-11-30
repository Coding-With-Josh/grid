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
  Redo
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
  projectId,
  isPreviewMode,
  onPreviewToggle,
  onPublish,
  onSave,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}: EditorNavbarProps) {
  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 right-0 w-full border-b border-border/40 bg-background/45 backdrop-blur supports-[backdrop-filter]:bg-background/35 z-50">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Grid Logo"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-[#9945FF] font-bold text-lg">
                Grid
              </span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={!canUndo}
                onClick={onUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!canRedo}
                onClick={onRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviewToggle}
              title={isPreviewMode ? "Exit Preview" : "Preview"}
            >
              {isPreviewMode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              title="Save"
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              onClick={onPublish}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Publish
            </Button>
            <ModeToggle />
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}
