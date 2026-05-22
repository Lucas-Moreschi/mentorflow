import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rankMentors } from "@/lib/matching";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const matches = await rankMentors(session.user.id);
    return NextResponse.json(matches, {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err) {
    console.error("suggestions error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
