import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// GET /api/projects/[slug]/editor
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: { 
        editorState: true,
        collaborators: {
          select: { id: true }
        }
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if user has access to project
    const hasAccess = project.creatorId === session.user.id || 
      project.collaborators.some(c => c.id === session.user.id);

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json({ editorState: project.editorState });
  } catch (error) {
    console.error("[EDITOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/projects/[slug]/editor
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { elements } = json;

    if (!elements) {
      return new NextResponse("Missing elements", { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: { 
        collaborators: {
          select: { id: true }
        }
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if user has access to project
    const hasAccess = project.creatorId === session.user.id || 
      project.collaborators.some(c => c.id === session.user.id);

    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update or create editor state
    const editorState = await prisma.editorState.upsert({
      where: {
        projectId: project.id,
      },
      update: {
        elements,
        version: { increment: 1 },
      },
      create: {
        projectId: project.id,
        elements,
        version: 1,
      },
    });

    return NextResponse.json({ editorState });
  } catch (error) {
    console.error("[EDITOR_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
