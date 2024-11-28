import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(2),
  birthday: z.string().transform((str) => new Date(str)),
  location: z.string().min(2),
  role: z.enum(["DEVELOPER", "DESIGNER", "CREATOR", "WRITER"]),
  bio: z.string().min(10),
  skills: z.array(z.string()).min(1),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  experience: z.number().min(0).max(50),
  education: z.string().min(2),
  languages: z.array(z.string()).min(1),
  availability: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE"]),
});

export async function POST(request: Request) {
  try {
    console.log("Starting profile completion...");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("No session found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data:", data);
    
    const validatedData = profileSchema.parse(data);
    console.log("Validated data:", validatedData);

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...validatedData,
        hasCompletedOnboarding: true,
      },
    });
    console.log("User updated:", updatedUser);

    // Ensure the session is updated
    const response = NextResponse.json({ 
      success: true,
      user: updatedUser 
    });

    return response;
  } catch (error) {
    console.error('Profile completion error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete profile' },
      { status: 500 }
    );
  }
}
