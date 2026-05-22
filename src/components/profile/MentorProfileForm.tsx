"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { mentorProfileSchema, type MentorProfileInput } from "@/schemas/profile.schema";
import type { MentorProfileData } from "@/types/mentorship";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "./TagInput";

interface MentorProfileFormProps {
  profile: MentorProfileData | null;
  onSaved?: () => void;
}

export function MentorProfileForm({ profile, onSaved }: MentorProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MentorProfileInput>({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues: {
      bio: profile?.bio ?? "",
      expertise: profile?.expertise ?? "",
      skills: profile?.skills ?? [],
      areasOfExpertise: profile?.areasOfExpertise ?? [],
      yearsExperience: profile?.yearsExperience ?? 0,
      currentRole: profile?.currentRole ?? "",
      company: profile?.company ?? "",
      maxStudents: profile?.maxStudents ?? 3,
      linkedinUrl: profile?.linkedinUrl ?? "",
      githubUrl: profile?.githubUrl ?? "",
    },
  });

  const skills = watch("skills");
  const areasOfExpertise = watch("areasOfExpertise");

  async function onSubmit(data: MentorProfileInput) {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error || "Erro ao salvar perfil");
        return;
      }

      toast.success("Perfil salvo! Atualizando embedding de IA...");
      onSaved?.();
    } catch {
      toast.error("Erro de conexão");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cargo atual</Label>
          <Input placeholder="Ex: Staff Engineer" {...register("currentRole")} />
        </div>
        <div className="space-y-2">
          <Label>Empresa</Label>
          <Input placeholder="Ex: Google, Nubank..." {...register("company")} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Anos de experiência</Label>
          <Input
            type="number"
            min={0}
            max={50}
            {...register("yearsExperience", { valueAsNumber: true })}
          />
          {errors.yearsExperience && (
            <p className="text-xs text-destructive">{errors.yearsExperience.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Máximo de estudantes simultâneos</Label>
          <Input
            type="number"
            min={1}
            max={10}
            {...register("maxStudents", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sua experiência e o que você pode ensinar *</Label>
        <Textarea
          rows={4}
          placeholder="Descreva sua experiência profissional e como você pode ajudar outros..."
          {...register("expertise")}
          className="resize-none"
        />
        {errors.expertise && (
          <p className="text-xs text-destructive">{errors.expertise.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Sobre você</Label>
        <Textarea
          rows={3}
          placeholder="Conte um pouco sobre sua trajetória..."
          {...register("bio")}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Habilidades técnicas que você ensina</Label>
        <TagInput
          value={skills}
          onChange={(tags) => setValue("skills", tags)}
          placeholder="Ex: React, Node.js, AWS..."
        />
      </div>

      <div className="space-y-2">
        <Label>Áreas de atuação</Label>
        <TagInput
          value={areasOfExpertise}
          onChange={(tags) => setValue("areasOfExpertise", tags)}
          placeholder="Ex: Career Coaching, System Design..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>LinkedIn</Label>
          <Input placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
        </div>
        <div className="space-y-2">
          <Label>GitHub</Label>
          <Input placeholder="https://github.com/..." {...register("githubUrl")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Salvar perfil
      </Button>
    </form>
  );
}
