import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        role: "MENTOR" as const,
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          {
            mentorProfile: {
              OR: [
                { expertise: { contains: search, mode: "insensitive" as const } },
                { skills: { has: search } },
                { areasOfExpertise: { has: search } },
              ],
            },
          },
        ],
      }
    : { role: "MENTOR" as const };

  const [mentors, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
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
            averageRating: true,
            totalReviews: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        mentorProfile: { averageRating: "desc" },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    mentors,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
