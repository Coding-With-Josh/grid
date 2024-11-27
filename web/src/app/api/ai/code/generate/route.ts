import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai-providers';
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

const languagePrompts = {
  python: "Write clean, well-documented Python code with type hints and docstrings.",
  javascript: "Write clean, modern JavaScript code using ES6+ features.",
  typescript: "Write clean TypeScript code with proper type definitions and interfaces.",
  java: "Write clean, object-oriented Java code following best practices.",
  cpp: "Write clean, modern C++ code following best practices.",
  csharp: "Write clean C# code following .NET conventions and best practices.",
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { description, language, projectId } = await req.json();

    const prompt = `${languagePrompts[language as keyof typeof languagePrompts] || ""}
Generate code for: ${description}
Only output the code, no explanations.`;

    const { content: code, provider } = await generateWithFallback({
      prompt,
      maxTokens: 2000,
      temperature: 0.3,
    });

    // Clean up code blocks if present
    const cleanedCode = code
      ?.replace(/\`\`\`[\w-]*\n/g, "")
      .replace(/\`\`\`$/g, "")
      .trim() || "";

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        type: "CODE_GENERATION",
        prompt,
        response: cleanedCode,
        tokens: Math.ceil(cleanedCode.length / 4), // Rough estimate
        provider,
        userId: user.id,
      },
    });

    // If projectId is provided, store the generation
    if (projectId) {
      await prisma.aIGeneration.create({
        data: {
          type: "code",
          input: description,
          output: cleanedCode,
          projectId,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          type: "SYSTEM",
          title: "Code Generated",
          message: `Generated ${language} code for project: ${description.substring(0, 50)}...`,
          userId: user.id,
          link: `/dashboard/projects/${projectId}`,
        },
      });
    } else {
      // Create notification without project link
      await prisma.notification.create({
        data: {
          type: "SYSTEM",
          title: "Code Generated",
          message: `Generated ${language} code: ${description.substring(0, 50)}...`,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      code: cleanedCode,
      provider,
    });
  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
