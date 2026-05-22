import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge";
import { FeedbackForm } from "@/components/mentorship/FeedbackForm";
import { getInitials, formatDate } from "@/lib/utils";
import { Star, History, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const isStudent = session.user.role === "STUDENT";

  const mentorships = await prisma.mentorship.findMany({
    where: {
      ...(isStudent ? { studentId: session.user.id } : { mentorId: session.user.id }),
      status: { in: ["COMPLETED", "REJECTED", "CANCELLED"] },
    },
    include: {
      student: { select: { id: true, name: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, avatarUrl: true } },
      feedback: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-muted-foreground mt-1">
          Suas mentorias concluídas e encerradas
        </p>
      </div>

      {mentorships.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhuma mentoria no histórico</p>
          <p className="text-sm mt-1">
            As mentorias concluídas aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mentorships.map((m) => {
            const other = isStudent ? m.mentor : m.student;
            const canFeedback =
              isStudent && m.status === "COMPLETED" && !m.feedback;

            return (
              <Card key={m.id}>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getInitials(other.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{other.name}</p>
                        {m.topic && (
                          <p className="text-xs text-muted-foreground">{m.topic}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {m.completedAt
                            ? `Concluída em ${formatDate(m.completedAt)}`
                            : formatDate(m.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <MentorshipStatusBadge status={m.status as any} />
                  </div>

                  {m.feedback && (
                    <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < m.feedback!.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      {m.feedback.comment && (
                        <p className="text-sm text-muted-foreground">
                          {m.feedback.comment}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {m.status === "COMPLETED" && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/app/chat/${m.id}`}>
                          <MessageSquare className="w-4 h-4 mr-1.5" />
                          Ver conversa
                        </Link>
                      </Button>
                    )}
                  </div>

                  {canFeedback && (
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium mb-3">
                        Avalie sua experiência com {other.name}
                      </p>
                      <FeedbackForm mentorshipId={m.id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
