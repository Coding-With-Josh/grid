import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Code2, FileText, MessageSquare } from "lucide-react";

export default function CopilotPage() {
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

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
              <CardDescription>
                Have a natural conversation with your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[400px] rounded-lg border bg-muted p-4 overflow-y-auto">
                  {/* Chat messages will go here */}
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Start a conversation with your AI assistant...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Assistant</CardTitle>
              <CardDescription>
                Get help with coding tasks, debugging, and code optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Paste your code here or describe what you want to do..."
                  className="min-h-[200px] font-mono"
                />
                <div className="flex gap-2">
                  <Button className="flex-1">Generate Code</Button>
                  <Button className="flex-1">Explain Code</Button>
                  <Button className="flex-1">Debug</Button>
                </div>
                <div className="rounded-lg border bg-muted p-4 min-h-[200px]">
                  <p className="text-sm text-muted-foreground">
                    AI response will appear here...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Generator</CardTitle>
              <CardDescription>
                Generate documentation for your code and projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Input 
                      placeholder="Project or File Name"
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Paste your code or describe your project..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Generate Documentation</Button>
                    <Button className="flex-1">Generate README</Button>
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-muted p-4 min-h-[200px]">
                      <p className="text-sm text-muted-foreground">
                        Documentation will appear here...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
