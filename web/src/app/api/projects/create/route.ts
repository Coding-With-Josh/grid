import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
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
  tags: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    // Map user role to category
    const roleToCategory = {
      'DEVELOPER': 'DEVELOPER',
      'DESIGNER': 'DESIGNER',
      'CREATOR': 'CREATOR',
      'WRITER': 'WRITER',
    } as const;

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        category: roleToCategory[user.role as keyof typeof roleToCategory] || "OTHER",
        creator: {
          connect: { id: user.id },
        },
      },
      include: {
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Create notification for project creation
    await prisma.notification.create({
      data: {
        type: "PROJECT_UPDATE",
        title: "Project Created",
        message: `You created a new project: ${validatedData.title}`,
        userId: user.id,
        link: `/dashboard/dev/projects/${project.id}`,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
