"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Clock, BookOpen, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";

interface RequestData {
  id: string;
  topic: string | null;
  message: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    avatarUrl: string | null;
    studentProfile: {
      goals: string;
      skills: string[];
      areasOfInterest: string[];
      currentRole: string | null;
      desiredRole: string | null;
    } | null;
  };
}

interface RequestsClientProps {
  requests: RequestData[];
}

export function RequestsClient({ requests }: RequestsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function handleAccept(id: string) {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/mentorships/${id}/accept`, { method: "POST" });
      if (res.ok) {
        toast.success("Mentoria aceita!");
        router.refresh();
      } else {
        toast.error("Erro ao aceitar");
      }
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: string) {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/mentorships/${id}/reject`, { method: "POST" });
      if (res.ok) {
        toast.success("Solicitação recusada");
        router.refresh();
      } else {
        toast.error("Erro ao recusar");
      }
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  if (requests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Solicitações pendentes</h1>
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhuma solicitação pendente</p>
          <p className="text-sm mt-1">
            Quando estudantes solicitarem sua mentoria, elas aparecerão aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Solicitações pendentes</h1>
        <p className="text-muted-foreground mt-1">
          {requests.length} solicitação{requests.length !== 1 ? "ões" : ""} aguardando sua resposta
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(req.student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold">{req.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(req.createdAt)}
                    </p>
                  </div>
                  {req.student.studentProfile?.currentRole && (
                    <p className="text-sm text-muted-foreground">
                      {req.student.studentProfile.currentRole}
                      {req.student.studentProfile.desiredRole &&
                        ` → ${req.student.studentProfile.desiredRole}`}
                    </p>
                  )}
                </div>
              </div>

              {req.topic && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium">{req.topic}</p>
                </div>
              )}

              {req.message && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm leading-relaxed">{req.message}</p>
                </div>
              )}

              {req.student.studentProfile && (
                <div className="space-y-2">
                  {req.student.studentProfile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {req.student.studentProfile.skills.slice(0, 5).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-1 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => handleAccept(req.id)}
                  disabled={loading[req.id]}
                  className="gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Aceitar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(req.id)}
                  disabled={loading[req.id]}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                  Recusar
                </Button>
                <Button asChild size="sm" variant="ghost" className="gap-1.5 ml-auto">
                  <Link href={`/app/profile/${req.student.id}`}>
                    <User className="w-4 h-4" />
                    Ver perfil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
