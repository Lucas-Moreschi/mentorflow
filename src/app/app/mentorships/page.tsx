import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge";
import { MentorshipActions } from "@/components/mentorship/MentorshipActions";
import { formatDate, getInitials } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { MentorshipFilters } from "@/components/mentorship/MentorshipFilters";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["todas", "ativas", "pendentes", "concluidas", "encerradas"] as const;
type FilterValue = (typeof STATUS_FILTERS)[number];

function filterToStatuses(filter: FilterValue) {
  switch (filter) {
    case "ativas":     return ["ACTIVE"];
    case "pendentes":  return ["PENDING"];
    case "concluidas": return ["COMPLETED"];
    case "encerradas": return ["REJECTED", "CANCELLED"];
    default:           return null; // todas
  }
}

export default async function MentorshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const isStudent = session.user.role === "STUDENT";
  const { filter: rawFilter } = await searchParams;
  const filter: FilterValue = STATUS_FILTERS.includes(rawFilter as FilterValue)
    ? (rawFilter as FilterValue)
    : "todas";

  const statusFilter = filterToStatuses(filter);

  const mentorships = await prisma.mentorship.findMany({
    where: {
      ...(isStudent ? { studentId: session.user.id } : { mentorId: session.user.id }),
      ...(statusFilter ? { status: { in: statusFilter as any } } : {}),
    },
    include: {
      student: { select: { id: true, name: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // counts for badge on each tab (always over all statuses)
  const counts = await prisma.mentorship.groupBy({
    by: ["status"],
    where: isStudent ? { studentId: session.user.id } : { mentorId: session.user.id },
    _count: true,
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const total = counts.reduce((s, c) => s + c._count, 0);

  function MentorshipCard({ m }: { m: (typeof mentorships)[0] }) {
    const other = isStudent ? m.mentor : m.student;
    return (
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(other.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{other.name}</p>
                {m.topic && (
                  <p className="text-xs text-muted-foreground truncate">{m.topic}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <MentorshipStatusBadge status={m.status as any} />
              <MentorshipActions
                mentorshipId={m.id}
                status={m.status}
                isStudent={isStudent}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Minhas mentorias</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as suas mentorias
        </p>
      </div>

      <MentorshipFilters
        current={filter}
        counts={{
          todas: total,
          ativas: countMap["ACTIVE"] ?? 0,
          pendentes: countMap["PENDING"] ?? 0,
          concluidas: countMap["COMPLETED"] ?? 0,
          encerradas: (countMap["REJECTED"] ?? 0) + (countMap["CANCELLED"] ?? 0),
        }}
      />

      {mentorships.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhuma mentoria encontrada</p>
          {isStudent && filter === "todas" && (
            <p className="text-sm mt-1">
              <Link href="/app/mentors" className="text-primary hover:underline">
                Encontre um mentor
              </Link>{" "}
              para começar
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {mentorships.map((m) => (
            <MentorshipCard key={m.id} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
