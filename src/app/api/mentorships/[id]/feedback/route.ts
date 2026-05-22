import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/schemas/mentorship.schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Apenas estudantes podem avaliar mentorias" }, { status: 403 });
  }

  const { id } = await params;

  const mentorship = await prisma.mentorship.findFirst({
    where: { id, studentId: session.user.id, status: "COMPLETED" },
  });

  if (!mentorship) {
    return NextResponse.json({ error: "Mentoria não encontrada" }, { status: 404 });
  }

  const existing = await prisma.feedback.findUnique({ where: { mentorshipId: id } });
  if (existing) {
    return NextResponse.json({ error: "Você já avaliou esta mentoria" }, { status: 409 });
  }

  const body = await req.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const [feedback] = await prisma.$transaction(async (tx) => {
    const fb = await tx.feedback.create({
      data: {
        mentorshipId: id,
        reviewerId: session.user.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    // Recalculate mentor average rating
    const allFeedback = await tx.feedback.findMany({
      where: {
        mentorship: { mentorId: mentorship.mentorId },
      },
      select: { rating: true },
    });

    const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

    await tx.mentorProfile.update({
      where: { userId: mentorship.mentorId },
      data: {
        averageRating: avg,
        totalReviews: allFeedback.length,
      },
    });

    return [fb];
  });

  return NextResponse.json(feedback, { status: 201 });
}
