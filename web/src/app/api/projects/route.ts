import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
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

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: user.id },
          { collaborators: { some: { id: user.id } } },
        ],
      },
      include: {
        creator: {
          select: {
            name: true,
            image: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            files: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

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

    const { title, description, category, visibility, tags } = await req.json();

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category: category || "OTHER",
        visibility: visibility || "PUBLIC",
        tags: tags || [],
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
        message: `You created a new project: ${title}`,
        userId: user.id,
        link: `/dashboard/dev/projects/${project.id}`,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
