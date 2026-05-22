import {
  Zap,
  Shield,
  Target,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Match por IA",
    description:
      "Embeddings semânticos garantem conexões realmente compatíveis, não apenas por palavras-chave.",
  },
  {
    icon: Target,
    title: "Foco no seu objetivo",
    description:
      "O sistema aprende seus objetivos e sugere mentores que já trilharam o mesmo caminho.",
  },
  {
    icon: Clock,
    title: "Chat em tempo real",
    description:
      "Converse diretamente com seu mentor assim que a mentoria for aceita, sem intermediários.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe seu progresso",
    description:
      "Dashboard completo com histórico de mentorias e evolução da sua jornada profissional.",
  },
  {
    icon: Star,
    title: "Mentores verificados",
    description:
      "Todos os mentores têm perfil detalhado e avaliações de outros estudantes.",
  },
  {
    icon: Shield,
    title: "Ambiente seguro",
    description:
      "Plataforma dedicada à mentoria profissional, sem distrações de redes sociais genéricas.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 px-4 bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Por que o MentorFlow?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Tecnologia moderna a serviço da sua evolução profissional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-white/5 bg-white/5 p-6 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                <benefit.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
