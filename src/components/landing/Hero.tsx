import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
          <Sparkles className="w-4 h-4" />
          Matching inteligente com IA
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Encontre o mentor{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            ideal para você
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          O MentorFlow usa inteligência artificial para conectar estudantes com
          mentores experientes que realmente se encaixam com seus objetivos
          profissionais.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 text-base"
          >
            <Link href="/register">
              Começar agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base bg-transparent"
          >
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          {[
            { value: "500+", label: "Mentores ativos" },
            { value: "2k+", label: "Estudantes" },
            { value: "98%", label: "Satisfação" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
