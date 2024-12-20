"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

export const projectSchema = z.object({
  title: z.string().min(1, { message: "Please enter a project title." }),
  description: z.string().min(1, { message: "Please enter a project description." }),
  projectType: z.enum([
    // Developer Types
    "WEB", "DAPP", "SMART_CONTRACT", "MOBILE", "CLI", "AI", "API",
    // Designer Types
    "UI_DESIGN", "UX_DESIGN", "GRAPHIC_DESIGN", "BRANDING", "PROTOTYPE", "ILLUSTRATION", "UI_COMPONENTS",
    // Creator Types
    "VIDEO", "BLOG", "PODCAST", "COURSE", "EBOOK", "NEWSLETTER",
    // Writer Types
    "TECHNICAL_WRITING", "CREATIVE_WRITING", "DOCUMENTATION", "COPYWRITING",
    // Other
    "OTHER"
  ]),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]),
  tags: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  onSuccess?: () => void;
}

const getProjectTypesByRole = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'DEVELOPER':
      return [
        { value: "WEB", label: "Web Application" },
        { value: "DAPP", label: "Decentralized App" },
        { value: "SMART_CONTRACT", label: "Smart Contract" },
        { value: "MOBILE", label: "Mobile App" },
        { value: "CLI", label: "Command Line Tool" },
        { value: "AI", label: "AI/ML Project" },
        { value: "API", label: "API/Backend" },
      ];
    case 'DESIGNER':
      return [
        { value: "UI_DESIGN", label: "UI Design" },
        { value: "UX_DESIGN", label: "UX Design" },
        { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
        { value: "BRANDING", label: "Branding" },
        { value: "PROTOTYPE", label: "Prototype" },
        { value: "ILLUSTRATION", label: "Illustration" },
        { value: "UI_COMPONENTS", label: "UI Components" },
      ];
    case 'CREATOR':
      return [
        { value: "VIDEO", label: "Video" },
        { value: "BLOG", label: "Blog" },
        { value: "PODCAST", label: "Podcast" },
        { value: "COURSE", label: "Course" },
        { value: "EBOOK", label: "eBook" },
        { value: "NEWSLETTER", label: "Newsletter" },
      ];
    case 'WRITER':
      return [
        { value: "TECHNICAL_WRITING", label: "Technical Writing" },
        { value: "CREATIVE_WRITING", label: "Creative Writing" },
        { value: "DOCUMENTATION", label: "Documentation" },
        { value: "COPYWRITING", label: "Copywriting" },
      ];
    default:
      return [{ value: "OTHER", label: "Other" }];
  }
};

export default function CreateProjectModal({ onSuccess }: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'CREATOR';
  const projectTypes = getProjectTypesByRole(userRole);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      projectType: projectTypes[0].value,
      visibility: "PUBLIC",
      tags: "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create project");
      }

      const data = await response.json();
      
      setIsOpen(false);
      form.reset();
      
      toast({
        title: "Project created successfully",
        description: "Your new project has been created.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#14F195] hover:bg-[#14F195]/90 text-black">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="UNLISTED">Unlisted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="blockchain, defi, web3 (comma separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}