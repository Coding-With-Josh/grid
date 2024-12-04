import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        role: data.role,
        github: data.github,
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        bio: data.bio,
        skills: data.skills,
        hasCompletedOnboarding: true,
      },
    });

    return NextResponse.json({
      user: {
        ...user,
        hasCompletedOnboarding: true,
      },
    });
  } catch (error) {
    console.error('[ONBOARDING_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
