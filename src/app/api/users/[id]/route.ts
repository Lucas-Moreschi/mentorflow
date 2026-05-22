import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      studentProfile: {
        select: {
          bio: true,
          goals: true,
          currentRole: true,
          desiredRole: true,
          skills: true,
          areasOfInterest: true,
          linkedinUrl: true,
          githubUrl: true,
        },
      },
      mentorProfile: {
        select: {
          bio: true,
          expertise: true,
          skills: true,
          areasOfExpertise: true,
          yearsExperience: true,
          currentRole: true,
          company: true,
          maxStudents: true,
          linkedinUrl: true,
          githubUrl: true,
          averageRating: true,
          totalReviews: true,
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}
