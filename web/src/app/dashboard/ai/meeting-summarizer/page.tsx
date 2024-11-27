import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MeetingSummarizerPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Meeting Summarizer</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Meeting Recording</CardTitle>
            <CardDescription>
              Upload an audio or video file of your meeting to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="meeting-file">Meeting Recording</Label>
              <Input 
                id="meeting-file" 
                type="file" 
                accept="audio/*,video/*"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>
              Add any additional context about the meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input 
                  id="meeting-title" 
                  placeholder="Weekly Team Sync"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting-context">Meeting Context (Optional)</Label>
                <Textarea 
                  id="meeting-context"
                  placeholder="Add any specific points or topics you want to focus on in the summary..."
                  className="h-32"
                />
              </div>
              <Button className="w-full">
                Generate Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary Output</CardTitle>
            <CardDescription>
              Your meeting summary will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted p-4 h-64">
              <p className="text-sm text-muted-foreground">
                Upload a meeting recording to generate a summary...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
