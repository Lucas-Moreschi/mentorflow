"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { studentProfileSchema, type StudentProfileInput } from "@/schemas/profile.schema";
import type { StudentProfileData } from "@/types/mentorship";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "./TagInput";

interface StudentProfileFormProps {
  profile: StudentProfileData | null;
  onSaved?: () => void;
}

export function StudentProfileForm({ profile, onSaved }: StudentProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileInput>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      bio: profile?.bio ?? "",
      goals: profile?.goals ?? "",
      currentRole: profile?.currentRole ?? "",
      desiredRole: profile?.desiredRole ?? "",
      skills: profile?.skills ?? [],
      areasOfInterest: profile?.areasOfInterest ?? [],
      linkedinUrl: profile?.linkedinUrl ?? "",
      githubUrl: profile?.githubUrl ?? "",
    },
  });

  const skills = watch("skills");
  const areasOfInterest = watch("areasOfInterest");

  async function onSubmit(data: StudentProfileInput) {
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

      toast.success("Perfil salvo! Atualizando match de IA...");
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
          <Input
            placeholder="Ex: Desenvolvedor Júnior"
            {...register("currentRole")}
          />
        </div>
        <div className="space-y-2">
          <Label>Cargo desejado</Label>
          <Input
            placeholder="Ex: Engenheiro Sênior"
            {...register("desiredRole")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Objetivos profissionais *</Label>
        <Textarea
          rows={4}
          placeholder="Descreva o que você quer aprender e onde quer chegar..."
          {...register("goals")}
          className="resize-none"
        />
        {errors.goals && (
          <p className="text-xs text-destructive">{errors.goals.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Sobre você</Label>
        <Textarea
          rows={3}
          placeholder="Conte um pouco sobre você..."
          {...register("bio")}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Habilidades atuais</Label>
        <TagInput
          value={skills}
          onChange={(tags) => setValue("skills", tags)}
          placeholder="Ex: JavaScript, Python, Docker..."
        />
      </div>

      <div className="space-y-2">
        <Label>Áreas de interesse</Label>
        <TagInput
          value={areasOfInterest}
          onChange={(tags) => setValue("areasOfInterest", tags)}
          placeholder="Ex: Machine Learning, DevOps, UX..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>LinkedIn</Label>
          <Input placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
          {errors.linkedinUrl && (
            <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>GitHub</Label>
          <Input placeholder="https://github.com/..." {...register("githubUrl")} />
          {errors.githubUrl && (
            <p className="text-xs text-destructive">{errors.githubUrl.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Salvar perfil
      </Button>
    </form>
  );
}
