import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RequestsClient } from "./RequestsClient";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "MENTOR") redirect("/app/dashboard");

  const requests = await prisma.mentorship.findMany({
    where: { mentorId: session.user.id, status: "PENDING" },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          studentProfile: {
            select: {
              goals: true,
              skills: true,
              areasOfInterest: true,
              currentRole: true,
              desiredRole: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <RequestsClient requests={requests as any} />;
}
