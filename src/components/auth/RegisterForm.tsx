"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setServerError(body.error || "Erro ao criar conta");
        return;
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/app/profile/edit");
      router.refresh();
    } catch {
      setServerError("Erro de conexão");
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm text-white shadow-2xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-white">MentorFlow</span>
        </div>
        <CardTitle className="text-2xl font-bold">Criar sua conta</CardTitle>
        <CardDescription className="text-slate-400">
          Junte-se à maior rede de mentoria inteligente
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "STUDENT")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                selectedRole === "STUDENT"
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              )}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Estudante</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "MENTOR")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                selectedRole === "MENTOR"
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              )}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-sm font-medium">Mentor</span>
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-red-400">{errors.role.message}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Nome completo
            </Label>
            <Input
              id="name"
              placeholder="Seu nome"
              {...register("name")}
              className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
              className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Criar conta
          </Button>

          <p className="text-sm text-slate-400 text-center">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
