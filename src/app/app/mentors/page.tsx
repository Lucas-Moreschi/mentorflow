import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankMentors } from "@/lib/matching";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function MentorsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  if (session.user.role !== "STUDENT") {
    redirect("/app/dashboard");
  }

  const [matches, allMentors] = await Promise.all([
    rankMentors(session.user.id).catch((e) => { console.error("rankMentors:", e); return []; }),
    prisma.user.findMany({
      where: { role: "MENTOR" },
      include: {
        mentorProfile: true,
      },
      take: 20,
    }),
  ]);

  const hasMatches = matches.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Encontrar mentores</h1>
        <p className="text-muted-foreground mt-1">
          Mentores sugeridos pela IA com base no seu perfil
        </p>
      </div>

      {hasMatches ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Matches para você</h2>
            <Badge variant="secondary">{matches.length} resultados</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <MentorCard
                key={match.mentor.id}
                mentor={match.mentor}
                matchScore={match.matchScore}
                explanation={match.explanation}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Todos os mentores</h2>
            <p className="text-sm text-muted-foreground">
              Complete seu perfil para ver matches personalizados
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={{
                  ...mentor,
                  role: "MENTOR",
                  mentorProfile: mentor.mentorProfile,
                }}
              />
            ))}
          </div>
          {allMentors.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum mentor disponível ainda</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
