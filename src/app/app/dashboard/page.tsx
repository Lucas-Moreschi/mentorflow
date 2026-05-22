import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge";
import { rankMentors } from "@/lib/matching";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Star,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const isStudent = session.user.role === "STUDENT";

  if (isStudent) {
    const [mentorships, topMatches] = await Promise.all([
      prisma.mentorship.findMany({
        where: { studentId: session.user.id },
        include: {
          mentor: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      rankMentors(session.user.id).then((m) => m.slice(0, 3)).catch(() => []),
    ]);

    const active = mentorships.filter((m) => m.status === "ACTIVE").length;
    const pending = mentorships.filter((m) => m.status === "PENDING").length;
    const completed = mentorships.filter((m) => m.status === "COMPLETED").length;

    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {session.user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe suas mentorias e descubra novos mentores
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard title="Mentorias ativas" value={active} icon={BookOpen} />
          <StatsCard title="Aguardando resposta" value={pending} icon={Clock} />
          <StatsCard title="Concluídas" value={completed} icon={CheckCircle} />
        </div>

        {topMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mentores recomendados</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/mentors">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topMatches.map((match) => (
                <MentorCard
                  key={match.mentor.id}
                  mentor={match.mentor}
                  matchScore={match.matchScore}
                  explanation={match.explanation}
                />
              ))}
            </div>
          </section>
        )}

        {mentorships.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Minhas mentorias</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/app/mentorships">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2">
              {mentorships.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(m.mentor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{m.mentor.name}</p>
                          {m.topic && (
                            <p className="text-xs text-muted-foreground truncate">{m.topic}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <MentorshipStatusBadge status={m.status as any} />
                        {m.status === "ACTIVE" && (
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/app/chat/${m.id}`}>
                              <MessageSquare className="w-3.5 h-3.5 mr-1" />
                              Chat
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Mentor dashboard
  const mentorships = await prisma.mentorship.findMany({
    where: { mentorId: session.user.id },
    include: {
      student: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
    select: { averageRating: true, totalReviews: true },
  });

  const active = mentorships.filter((m) => m.status === "ACTIVE");
  const pending = mentorships.filter((m) => m.status === "PENDING");
  const completed = mentorships.filter((m) => m.status === "COMPLETED").length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {session.user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus estudantes e solicitações
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Estudantes ativos" value={active.length} icon={Users} />
        <StatsCard title="Solicitações" value={pending.length} icon={Clock} />
        <StatsCard title="Concluídas" value={completed} icon={CheckCircle} />
        <StatsCard
          title="Avaliação"
          value={mentorProfile?.averageRating.toFixed(1) ?? "—"}
          icon={Star}
          description={`${mentorProfile?.totalReviews ?? 0} avaliações`}
        />
      </div>

      {pending.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Solicitações pendentes
              <Badge variant="warning" className="ml-2">{pending.length}</Badge>
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/requests">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 3).map((m) => (
              <Card key={m.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(m.student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{m.student.name}</p>
                        {m.topic && (
                          <p className="text-xs text-muted-foreground">{m.topic}</p>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link href="/app/requests">Responder</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Estudantes ativos</h2>
          <div className="space-y-2">
            {active.map((m) => (
              <Card key={m.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(m.student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.student.name}</p>
                        {m.topic && (
                          <p className="text-xs text-muted-foreground truncate">{m.topic}</p>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/app/chat/${m.id}`}>
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Chat
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
