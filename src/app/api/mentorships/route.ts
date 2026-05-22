import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMentorshipSchema } from "@/schemas/mentorship.schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Apenas estudantes podem solicitar mentoria" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = createMentorshipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { mentorId, topic, message } = parsed.data;

    // Check mentor exists
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId, role: "MENTOR" },
    });
    if (!mentor) return NextResponse.json({ error: "Mentor não encontrado" }, { status: 404 });

    // Check no existing active/pending mentorship
    const existing = await prisma.mentorship.findFirst({
      where: {
        studentId: session.user.id,
        mentorId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Você já tem uma mentoria ativa ou pendente com este mentor" },
        { status: 409 }
      );
    }

    const mentorship = await prisma.mentorship.create({
      data: {
        studentId: session.user.id,
        mentorId,
        topic,
        message,
        status: "PENDING",
      },
      include: {
        student: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        mentor: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(mentorship, { status: 201 });
  } catch (err) {
    console.error("mentorship POST error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where =
    session.user.role === "STUDENT"
      ? { studentId: session.user.id }
      : { mentorId: session.user.id };

  const mentorships = await prisma.mentorship.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
      feedback: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(mentorships);
}
