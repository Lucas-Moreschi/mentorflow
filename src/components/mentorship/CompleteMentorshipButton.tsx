"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, X } from "lucide-react";

export function CompleteMentorshipButton({ mentorshipId }: { mentorshipId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentorships/${mentorshipId}/complete`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error || "Erro ao encerrar mentoria");
        return;
      }
      toast.success("Mentoria encerrada! O estudante pode avaliar a experiência.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-muted-foreground hover:text-foreground">
          <CheckCircle className="w-4 h-4 mr-1" />
          Encerrar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar mentoria?</DialogTitle>
          <DialogDescription>
            A mentoria será marcada como concluída. O histórico de mensagens ficará disponível e o estudante poderá avaliar a experiência.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
          <Button onClick={handleComplete} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Encerrar mentoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CancelRequestButton({ mentorshipId }: { mentorshipId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentorships/${mentorshipId}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error || "Erro ao cancelar solicitação");
        return;
      }
      toast.success("Solicitação cancelada.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
          <X className="w-4 h-4 mr-1" />
          Cancelar pedido
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar solicitação?</DialogTitle>
          <DialogDescription>
            Sua solicitação de mentoria será cancelada. Você poderá enviar uma nova solicitação para este mentor no futuro.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Manter
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Cancelar solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
