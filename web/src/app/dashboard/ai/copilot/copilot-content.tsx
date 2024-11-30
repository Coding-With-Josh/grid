"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Code2, FileText, MessageSquare } from "lucide-react";

export default function CopilotContent() {
  const searchParams = useSearchParams();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Bot className="h-8 w-8" />
        <h1 className="text-4xl font-bold">AI Copilot</h1>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="chat">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </div>
          </TabsTrigger>
          <TabsTrigger value="code">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code
            </div>
          </TabsTrigger>
          <TabsTrigger value="docs">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Docs
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
              <CardDescription>
                Have a natural conversation with our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Bot className="h-8 w-8" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">AI Assistant</p>
                    <p className="text-sm text-muted-foreground">
                      Hello! How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Textarea
                  placeholder="Type your message here..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Assistant</CardTitle>
              <CardDescription>
                Get help with coding questions and problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your code or describe your problem..."
                className="min-h-[200px] mb-4"
              />
              <Button>Ask AI</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Helper</CardTitle>
              <CardDescription>
                Get help understanding documentation and technical concepts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter a technical term or paste documentation..."
                className="mb-4"
              />
              <Button>Explain</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
