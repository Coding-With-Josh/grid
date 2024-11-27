"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Mic, Pencil, Video, Bot, Wand2, Loader2, Sparkles, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContentAIToolsPage() {
  const [contentType, setContentType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [videoDescription, setVideoDescription] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [addingVoiceover, setAddingVoiceover] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState("");
  const [generatedVoiceover, setGeneratedVoiceover] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");

  const [voiceType, setVoiceType] = useState("");
  const [audioText, setAudioText] = useState("");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState("");
  const [enhancedText, setEnhancedText] = useState("");

  const [enhanceType, setEnhanceType] = useState("");
  const [targetTone, setTargetTone] = useState("");
  const [contentToEnhance, setContentToEnhance] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState("");

  const generateContent = async () => {
    if (!contentType || !description) {
      toast.error("Please select a content type and provide a description");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, description }),
      });

      if (!response.ok) throw new Error("Failed to generate content");

      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideo = async (addVoiceover: any) => {
    if (!videoDescription) {
      toast.error("Please provide a description for the video");
      return;
    }

    setIsGeneratingVideo(true);
    setAddingVoiceover(addVoiceover);
    try {
      const response = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: videoDescription, addVoiceover }),
      });

      if (!response.ok) throw new Error("Failed to generate video");

      const data = await response.json();
      setGeneratedVideo(data.video);
      setGeneratedVoiceover(data.voiceover);
      setGeneratedScript(data.script);
      toast.success("Video generated successfully!");
    } catch (error) {
      toast.error("Failed to generate video. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateAudio = async () => {
    if (!voiceType || !audioText) {
      toast.error("Please select a voice type and provide text for the audio");
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const response = await fetch("/api/ai/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceType, text: audioText }),
      });

      if (!response.ok) throw new Error("Failed to generate audio");

      const data = await response.json();
      setGeneratedAudio(data.audio);
      setEnhancedText(data.enhancedText);
      toast.success("Audio generated successfully!");
    } catch (error) {
      toast.error("Failed to generate audio. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const enhanceContent = async () => {
    if (!enhanceType || !contentToEnhance) {
      toast.error("Please select an enhancement type and provide content to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enhanceType, content: contentToEnhance, targetTone }),
      });

      if (!response.ok) throw new Error("Failed to enhance content");

      const data = await response.json();
      setEnhancedContent(data.enhancedContent);
      toast.success("Content enhanced successfully!");
    } catch (error) {
      toast.error("Failed to enhance content. Please try again.");
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Wand2 className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Content Creation AI Tools</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Content Writer
            </CardTitle>
            <CardDescription>
              Generate various types of written content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectGroup>
                    <SelectLabel className="text-sm">Social Media</SelectLabel>
                    <SelectItem value="x">X Post</SelectItem>
                    <SelectItem value="instagram">Instagram Post</SelectItem>
                  </SelectGroup>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="script">Video Script</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Describe what you want to write about..."
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={generateContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
              <div className="rounded-lg border bg-muted p-4 min-h-[200px] overflow-auto">
                {generatedContent ? (
                  <div className="whitespace-pre-wrap text-sm">
                    {generatedContent}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Generated content will appear here...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Generator
            </CardTitle>
            <CardDescription>
              Create videos from text descriptions or scripts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe the video you want to create..."
                className="min-h-[100px]"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                disabled={isGeneratingVideo}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => generateVideo(false)}
                  disabled={isGeneratingVideo}
                >
                  {isGeneratingVideo && !addingVoiceover ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Video"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => generateVideo(true)}
                  disabled={isGeneratingVideo}
                >
                  {isGeneratingVideo && addingVoiceover ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Voice...
                    </>
                  ) : (
                    "Add Voiceover"
                  )}
                </Button>
              </div>
              <div className="aspect-video rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                {generatedVideo ? (
                  <div className="w-full h-full">
                    <video 
                      src={generatedVideo} 
                      controls 
                      className="w-full h-full object-contain"
                    >
                      {generatedVoiceover && (
                        <audio autoPlay>
                          <source 
                            src={`data:audio/mp3;base64,${generatedVoiceover}`} 
                            type="audio/mp3" 
                          />
                        </audio>
                      )}
                    </video>
                    {generatedScript && (
                      <div className="mt-4 p-4 rounded-lg bg-secondary">
                        <p className="text-sm font-medium mb-2">Generated Script:</p>
                        <p className="text-sm text-muted-foreground">{generatedScript}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Video preview will appear here...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Audio Generator
            </CardTitle>
            <CardDescription>
              Generate voiceovers and audio content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={voiceType} onValueChange={setVoiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male1">Male Voice 1</SelectItem>
                  <SelectItem value="male2">Male Voice 2</SelectItem>
                  <SelectItem value="female1">Female Voice 1</SelectItem>
                  <SelectItem value="female2">Female Voice 2</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Enter the text you want to convert to speech..."
                className="min-h-[100px]"
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                disabled={isGeneratingAudio}
              />
              <Button 
                className="w-full"
                onClick={generateAudio}
                disabled={isGeneratingAudio}
              >
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  "Generate Audio"
                )}
              </Button>
              <div className="rounded-lg border bg-muted p-4">
                {generatedAudio ? (
                  <div className="space-y-4">
                    <audio controls className="w-full">
                      <source 
                        src={`data:audio/mp3;base64,${generatedAudio}`} 
                        type="audio/mp3" 
                      />
                    </audio>
                    {enhancedText && (
                      <div className="rounded-lg bg-secondary p-4">
                        <p className="text-sm font-medium mb-2">Enhanced Script:</p>
                        <p className="text-sm text-muted-foreground">{enhancedText}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    Audio player will appear here...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Content Enhancer
            </CardTitle>
            <CardDescription>
              Enhance and improve your content with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={enhanceType} onValueChange={setEnhanceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enhancement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grammar">Grammar & Style</SelectItem>
                  <SelectItem value="tone">Tone Adjustment</SelectItem>
                  <SelectItem value="expand">Content Expansion</SelectItem>
                  <SelectItem value="summarize">Summarization</SelectItem>
                </SelectContent>
              </Select>
              {enhanceType === 'tone' && (
                <Select value={targetTone} onValueChange={setTargetTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Textarea
                placeholder="Enter the content you want to enhance..."
                className="min-h-[150px]"
                value={contentToEnhance}
                onChange={(e) => setContentToEnhance(e.target.value)}
                disabled={isEnhancing}
              />
              <Button 
                className="w-full"
                onClick={enhanceContent}
                disabled={isEnhancing}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing Content...
                  </>
                ) : (
                  "Enhance Content"
                )}
              </Button>
              {enhancedContent && (
                <div className="rounded-lg border bg-muted p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Enhanced Content:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        navigator.clipboard.writeText(enhancedContent);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {enhancedContent}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
