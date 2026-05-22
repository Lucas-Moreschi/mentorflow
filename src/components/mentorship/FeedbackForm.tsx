"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { feedbackSchema, type FeedbackInput } from "@/schemas/mentorship.schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  mentorshipId: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ mentorshipId, onSuccess }: FeedbackFormProps) {
  const router = useRouter();
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  async function onSubmit(data: FeedbackInput) {
    try {
      const res = await fetch(`/api/mentorships/${mentorshipId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error || "Erro ao enviar avaliação");
        return;
      }

      toast.success("Avaliação enviada! Obrigado pelo feedback.");
      onSuccess?.();
      router.refresh();
    } catch {
      toast.error("Erro de conexão");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Avaliação</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5 rounded hover:scale-110 transition-transform"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  star <= (hoveredStar || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Comentário (opcional)</Label>
        <Textarea
          rows={3}
          placeholder="Conte como foi sua experiência com este mentor..."
          {...register("comment")}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Enviar avaliação
      </Button>
    </form>
  );
}
