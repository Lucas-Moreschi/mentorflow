"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createMentorshipSchema, type CreateMentorshipInput } from "@/schemas/mentorship.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestModalProps {
  mentorId: string;
  mentorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RequestModal({
  mentorId,
  mentorName,
  open,
  onOpenChange,
  onSuccess,
}: RequestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMentorshipInput>({
    resolver: zodResolver(createMentorshipSchema),
    defaultValues: { mentorId },
  });

  async function onSubmit(data: CreateMentorshipInput) {
    try {
      const res = await fetch("/api/mentorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error || "Erro ao solicitar mentoria");
        return;
      }

      toast.success("Solicitação enviada! Aguarde o mentor aceitar.");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Erro de conexão");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar mentoria</DialogTitle>
          <DialogDescription>
            Envie uma mensagem para <strong>{mentorName}</strong> explicando o
            que você quer aprender
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("mentorId")} value={mentorId} />

          <div className="space-y-2">
            <Label>Tópico da mentoria</Label>
            <Input
              placeholder="Ex: Transição para backend, system design..."
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mensagem para o mentor</Label>
            <Textarea
              rows={4}
              placeholder="Apresente-se e explique seus objetivos com esta mentoria..."
              {...register("message")}
              className="resize-none"
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enviar solicitação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
