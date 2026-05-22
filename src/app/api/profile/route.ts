import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema, mentorProfileSchema } from "@/schemas/profile.schema";
import { generateAndSaveEmbedding } from "@/lib/embedding";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      mentorProfile: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { hashedPassword: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const role = session.user.role;

    if (role === "STUDENT") {
      const parsed = studentProfileSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
      }

      const profile = await prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: parsed.data,
        create: { userId: session.user.id, ...parsed.data },
      });

      // Generate embedding in background (don't await to keep response fast)
      generateAndSaveEmbedding(session.user.id, "STUDENT").catch(console.error);

      return NextResponse.json(profile);
    } else {
      const parsed = mentorProfileSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
      }

      const profile = await prisma.mentorProfile.upsert({
        where: { userId: session.user.id },
        update: parsed.data,
        create: { userId: session.user.id, ...parsed.data },
      });

      generateAndSaveEmbedding(session.user.id, "MENTOR").catch(console.error);

      return NextResponse.json(profile);
    }
  } catch (err) {
    console.error("profile PUT error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
