import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Palette, PenTool, Bot, Wand2 } from "lucide-react";

export default function DesignAIToolsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Wand2 className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Design AI Tools</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Image Generator
            </CardTitle>
            <CardDescription>
              Generate images from text descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Describe the image you want to generate..."
                className="min-h-[100px]"
              />
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Button className="flex-1">Generate Image</Button>
                  <Button variant="outline" className="flex-1">Variations</Button>
                </div>
                <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Generated image will appear here...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              UI Generator
            </CardTitle>
            <CardDescription>
              Generate UI components and layouts from descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Describe the UI component or layout you want..."
                className="min-h-[100px]"
              />
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Button className="flex-1">Generate UI</Button>
                  <Button variant="outline" className="flex-1">Export Code</Button>
                </div>
                <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    UI preview will appear here...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Style Assistant
            </CardTitle>
            <CardDescription>
              Get AI-powered design suggestions and style improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <Input 
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
                <div className="flex gap-2">
                  <Button className="flex-1">Analyze Design</Button>
                  <Button variant="outline" className="flex-1">Get Suggestions</Button>
                </div>
                <div className="rounded-lg border bg-muted p-4 min-h-[200px]">
                  <p className="text-sm text-muted-foreground">
                    Design analysis and suggestions will appear here...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Design Copilot
            </CardTitle>
            <CardDescription>
              Chat with an AI assistant specialized in design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[200px] rounded-lg border bg-muted p-4 overflow-y-auto">
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Start a conversation about your design needs...
                </p>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about design, colors, typography..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
