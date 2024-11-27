"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Bug, FileSearch, GitBranch, Bot, Wand2, Loader2, Copy, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function DevAIToolsPage() {
  // Code Generator state
  const [codeDescription, setCodeDescription] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  // Debug Assistant state
  const [debugLanguage, setDebugLanguage] = useState("");
  const [debugInput, setDebugInput] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState(null);

  // Code Reviewer state
  const [codeToReview, setCodeToReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewType, setReviewType] = useState("");
  const [reviewResult, setReviewResult] = useState(null);

  // Git Assistant state
  const [gitInput, setGitInput] = useState("");
  const [isGeneratingGit, setIsGeneratingGit] = useState(false);
  const [gitActionType, setGitActionType] = useState("");
  const [gitResult, setGitResult] = useState(null);

  const generateCode = async () => {
    if (!codeDescription || !programmingLanguage) {
      toast.error("Please provide a description and select a programming language");
      return;
    }

    setIsGeneratingCode(true);
    try {
      const response = await fetch("/api/ai/code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: codeDescription,
          language: programmingLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate code");

      const data = await response.json();
      setGeneratedCode(data.code);
      toast.success("Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate code. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setHasCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const analyzeAndDebug = async () => {
    if (!debugLanguage || !debugInput) {
      toast.error("Please select a programming language and provide code and error message");
      return;
    }

    setIsDebugging(true);
    try {
      const response = await fetch("/api/ai/debug/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: debugLanguage,
          code: debugInput,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze and debug");

      const data = await response.json();
      setDebugResult(data);
      toast.success("Debug analysis and solutions generated successfully!");
    } catch (error) {
      toast.error("Failed to analyze and debug. Please try again.");
      console.error(error);
    } finally {
      setIsDebugging(false);
    }
  };

  const reviewCode = async (type: 'general' | 'security') => {
    if (!codeToReview) {
      toast.error("Please provide code to review");
      return;
    }

    setIsReviewing(true);
    setReviewType(type);
    try {
      const response = await fetch("/api/ai/code/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToReview,
          type,
        }),
      });

      if (!response.ok) throw new Error("Failed to review code");

      const data = await response.json();
      setReviewResult(data);
      toast.success(`Code ${type} review completed successfully!`);
    } catch (error) {
      toast.error(`Failed to complete ${type} review. Please try again.`);
      console.error(error);
    } finally {
      setIsReviewing(false);
      setReviewType("");
    }
  };

  const handleGitAction = async (type: 'commit' | 'analyze') => {
    if (!gitInput) {
      toast.error("Please provide git changes or description");
      return;
    }

    setIsGeneratingGit(true);
    setGitActionType(type);
    try {
      const response = await fetch("/api/ai/git/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: gitInput,
          type,
        }),
      });

      if (!response.ok) throw new Error("Failed to process git request");

      const data = await response.json();
      setGitResult(data);
      toast.success(`Git ${type} completed successfully!`);
    } catch (error) {
      toast.error(`Failed to process git ${type}. Please try again.`);
      console.error(error);
    } finally {
      setIsGeneratingGit(false);
      setGitActionType("");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Wand2 className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Development AI Tools</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Code Generator
            </CardTitle>
            <CardDescription>
              Generate code from natural language descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={programmingLanguage} onValueChange={setProgrammingLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select programming language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
              <Textarea 
                placeholder="Describe what you want the code to do..."
                className="min-h-[100px]"
                value={codeDescription}
                onChange={(e) => setCodeDescription(e.target.value)}
                disabled={isGeneratingCode}
              />
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={generateCode}
                    disabled={isGeneratingCode}
                  >
                    {isGeneratingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Code"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={copyToClipboard}
                    disabled={!generatedCode}
                  >
                    {hasCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg border bg-muted p-4 min-h-[200px] font-mono text-sm overflow-auto">
                  {generatedCode ? (
                    <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                  ) : (
                    <p className="text-muted-foreground">
                      Generated code will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Debug Assistant
            </CardTitle>
            <CardDescription>
              AI-powered debugging and error analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={debugLanguage} onValueChange={setDebugLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select programming language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
              <Textarea 
                placeholder="Paste your code and error message here..."
                className="min-h-[100px] font-mono"
                value={debugInput}
                onChange={(e) => setDebugInput(e.target.value)}
                disabled={isDebugging}
              />
              <div className="grid gap-4">
                <Button
                  onClick={analyzeAndDebug}
                  disabled={isDebugging}
                >
                  {isDebugging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze & Debug"
                  )}
                </Button>
                <div className="rounded-lg border bg-muted p-4 min-h-[200px]">
                  {debugResult ? (
                    <div className="space-y-4">
                      {debugResult.issue && (
                        <div>
                          <h3 className="font-medium mb-2">Issue Identified:</h3>
                          <p className="text-sm text-muted-foreground">{debugResult.issue}</p>
                        </div>
                      )}
                      {debugResult.solution && (
                        <div>
                          <h3 className="font-medium mb-2">Suggested Solution:</h3>
                          <p className="text-sm text-muted-foreground">{debugResult.solution}</p>
                        </div>
                      )}
                      {debugResult.fixedCode && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Fixed Code:</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                navigator.clipboard.writeText(debugResult.fixedCode);
                                toast.success("Fixed code copied to clipboard!");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm font-mono bg-secondary/50 p-2 rounded-md overflow-auto">
                            {debugResult.fixedCode}
                          </pre>
                        </div>
                      )}
                      {debugResult.prevention && (
                        <div>
                          <h3 className="font-medium mb-2">Prevention Tips:</h3>
                          <p className="text-sm text-muted-foreground">{debugResult.prevention}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Debug analysis and solutions will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Code Reviewer
            </CardTitle>
            <CardDescription>
              Get AI-powered code reviews and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <Textarea 
                  placeholder="Paste your code here for review..."
                  className="min-h-[150px] font-mono"
                  value={codeToReview}
                  onChange={(e) => setCodeToReview(e.target.value)}
                  disabled={isReviewing}
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => reviewCode('general')}
                    disabled={isReviewing}
                  >
                    {isReviewing && reviewType === 'general' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reviewing...
                      </>
                    ) : (
                      "Review Code"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => reviewCode('security')}
                    disabled={isReviewing}
                  >
                    {isReviewing && reviewType === 'security' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Security Check"
                    )}
                  </Button>
                </div>
                <div className="rounded-lg border bg-muted p-4 min-h-[200px] space-y-4">
                  {reviewResult ? (
                    <div className="space-y-6">
                      {reviewResult.summary && (
                        <div>
                          <h3 className="font-medium mb-2">Review Summary:</h3>
                          <p className="text-sm text-muted-foreground">{reviewResult.summary}</p>
                        </div>
                      )}
                      {reviewResult.issues && reviewResult.issues.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Issues Found:</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {reviewResult.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Suggestions:</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {reviewResult.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {reviewResult.improvedCode && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Improved Code:</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                navigator.clipboard.writeText(reviewResult.improvedCode);
                                toast.success("Improved code copied to clipboard!");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm font-mono bg-secondary/50 p-2 rounded-md overflow-auto">
                            {reviewResult.improvedCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Code review and suggestions will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Git Assistant
            </CardTitle>
            <CardDescription>
              AI help for git operations and commit messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Describe your changes or paste git diff..."
                className="min-h-[100px]"
                value={gitInput}
                onChange={(e) => setGitInput(e.target.value)}
                disabled={isGeneratingGit}
              />
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleGitAction('commit')}
                    disabled={isGeneratingGit}
                  >
                    {isGeneratingGit && gitActionType === 'commit' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Commit Message"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleGitAction('analyze')}
                    disabled={isGeneratingGit}
                  >
                    {isGeneratingGit && gitActionType === 'analyze' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Changes"
                    )}
                  </Button>
                </div>
                <div className="rounded-lg border bg-muted p-4 min-h-[100px]">
                  {gitResult ? (
                    <div className="space-y-4">
                      {gitResult.commitMessage && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Commit Message:</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                navigator.clipboard.writeText(gitResult.commitMessage);
                                toast.success("Commit message copied to clipboard!");
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm font-mono bg-secondary/50 p-2 rounded-md">
                            {gitResult.commitMessage}
                          </pre>
                        </div>
                      )}
                      {gitResult.analysis && (
                        <div>
                          <h3 className="font-medium mb-2">Change Analysis:</h3>
                          <div className="space-y-2">
                            {gitResult.analysis.map((item, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {gitResult.suggestions && (
                        <div>
                          <h3 className="font-medium mb-2">Suggestions:</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {gitResult.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Git suggestions will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
