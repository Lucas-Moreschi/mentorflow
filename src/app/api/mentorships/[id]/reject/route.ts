import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rejectMentorshipSchema } from "@/schemas/mentorship.schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "MENTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const mentorship = await prisma.mentorship.findFirst({
    where: { id, mentorId: session.user.id, status: "PENDING" },
  });

  if (!mentorship) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = rejectMentorshipSchema.safeParse(body);
  const reason = parsed.success ? parsed.data.reason : undefined;

  const updated = await prisma.mentorship.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
  });

  return NextResponse.json(updated);
}
