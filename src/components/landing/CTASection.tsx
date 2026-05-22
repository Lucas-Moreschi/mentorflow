import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para acelerar sua carreira?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Junte-se a milhares de estudantes que já encontraram o mentor ideal
            com o MentorFlow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 text-base"
            >
              <Link href="/register">
                Criar conta grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base bg-transparent"
            >
              <Link href="/register?role=MENTOR">Quero ser mentor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
