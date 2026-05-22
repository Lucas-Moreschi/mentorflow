import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id,
      status: "ACTIVE",
      OR: [{ studentId: session.user.id }, { mentorId: session.user.id }],
    },
  });

  if (!mentorship) {
    return NextResponse.json({ error: "Mentoria não encontrada" }, { status: 404 });
  }

  const updated = await prisma.mentorship.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return NextResponse.json(updated);
}
