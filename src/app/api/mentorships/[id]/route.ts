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

  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id,
      OR: [
        { studentId: session.user.id },
        { mentorId: session.user.id },
      ],
    },
    include: {
      student: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
      feedback: true,
      messages: {
        orderBy: { createdAt: "asc" },
        take: 50,
      },
    },
  });

  if (!mentorship) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(mentorship);
}
