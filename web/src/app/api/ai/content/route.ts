import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai-providers';
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

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

    const { contentType, description } = await req.json();

    let prompt = "";
    let maxTokens = 1000;

    switch (contentType) {
      case "blog":
        prompt = `Write a blog post about: ${description}`;
        maxTokens = 2000;
        break;
      case "social":
        prompt = `Write social media content about: ${description}`;
        maxTokens = 500;
        break;
      case "email":
        prompt = `Write a professional email about: ${description}`;
        maxTokens = 1000;
        break;
      default:
        prompt = `Write content about: ${description}`;
    }

    const { content, provider } = await generateWithFallback({
      prompt,
      maxTokens,
      temperature: 0.7,
    });

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        type: "CONTENT_GENERATION",
        prompt,
        response: content || "",
        tokens: Math.ceil((content?.length || 0) / 4), // Rough estimate
        provider,
        userId: user.id,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: "SYSTEM",
        title: "Content Generated",
        message: `Generated ${contentType} content about: ${description.substring(0, 50)}...`,
        userId: user.id,
      },
    });

    return NextResponse.json({
      content,
      provider,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
