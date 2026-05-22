import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MentorshipStatusBadge } from "@/components/mentorship/MentorshipStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, AlertCircle, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ mentorshipId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { mentorshipId } = await params;

  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id: mentorshipId,
      OR: [
        { studentId: session.user.id },
        { mentorId: session.user.id },
      ],
    },
    include: {
      student: { select: { id: true, name: true, role: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, role: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
      },
    },
  });

  if (!mentorship) redirect("/app/mentorships");

  const other =
    session.user.id === mentorship.studentId
      ? mentorship.mentor
      : mentorship.student;

  const isActive = mentorship.status === "ACTIVE";

  const serializedMessages = mentorship.messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  const participants = [
    { id: mentorship.student.id, name: mentorship.student.name, role: mentorship.student.role },
    { id: mentorship.mentor.id, name: mentorship.mentor.name, role: mentorship.mentor.role },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={isActive ? "/app/mentorships" : "/app/history"}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(other.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{other.name}</p>
          {mentorship.topic && (
            <p className="text-xs text-muted-foreground">{mentorship.topic}</p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href={`/app/profile/${other.id}`}>
              <User className="w-4 h-4 mr-1" />
              Ver perfil
            </Link>
          </Button>
          <MentorshipStatusBadge status={mentorship.status as any} />
        </div>
      </div>

      {!isActive && (
        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {mentorship.status === "PENDING"
            ? "Aguardando o mentor aceitar a mentoria para iniciar o chat"
            : "Esta mentoria foi encerrada. O chat está em modo somente leitura."}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ChatWindow
          mentorshipId={mentorshipId}
          initialMessages={serializedMessages as any}
          participants={participants}
        />
      </div>
    </div>
  );
}
