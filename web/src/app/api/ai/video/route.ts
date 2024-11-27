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

    const { topic, style, duration, projectId } = await req.json();

    const prompt = `Write a ${duration}-minute video script about: ${topic}
Style: ${style}
Format the output as follows:

TITLE:
[Video title]

DESCRIPTION:
[SEO-optimized video description]

SCRIPT:
[Timestamp] - [Scene Description] - [Narration/Dialogue]
`;

    const { content: script, provider } = await generateWithFallback({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    });

    // Track AI usage
    await prisma.aIUsage.create({
      data: {
        type: "VIDEO_SCRIPT",
        prompt,
        response: script || "",
        tokens: Math.ceil((script?.length || 0) / 4), // Rough estimate
        provider,
        userId: user.id,
      },
    });

    // If projectId is provided, store the generation
    if (projectId) {
      await prisma.aIGeneration.create({
        data: {
          type: "video",
          input: `${duration}-minute ${style} video about: ${topic}`,
          output: script || "",
          projectId,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          type: "SYSTEM",
          title: "Video Script Generated",
          message: `Generated ${duration}-minute ${style} video script: ${topic.substring(0, 50)}...`,
          userId: user.id,
          link: `/dashboard/projects/${projectId}`,
        },
      });
    } else {
      // Create notification without project link
      await prisma.notification.create({
        data: {
          type: "SYSTEM",
          title: "Video Script Generated",
          message: `Generated ${duration}-minute ${style} video script: ${topic.substring(0, 50)}...`,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      script,
      provider,
    });
  } catch (error) {
    console.error('Video script generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video script' },
      { status: 500 }
    );
  }
}
