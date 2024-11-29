import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
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

    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
        files: true,
        _count: {
          select: {
            tasks: true,
            files: true,
            collaborators: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    const hasAccess = 
      project.creatorId === user.id || 
      project.collaborators.some(collaborator => collaborator.id === user.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have access to this project" },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
