import { UserPlus, Brain, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie seu perfil",
    description:
      "Conte seus objetivos, habilidades e onde quer chegar na carreira. Quanto mais detalhes, melhor o match.",
  },
  {
    icon: Brain,
    step: "02",
    title: "IA encontra seu match",
    description:
      "Nossa IA analisa seu perfil semanticamente e calcula a compatibilidade com centenas de mentores.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Comece sua mentoria",
    description:
      "Solicite mentoria, converse em tempo real e acelere sua carreira com quem já passou por onde você quer chegar.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Como funciona
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Três passos simples para transformar sua carreira com o mentor certo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent -translate-y-px z-0" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {step.step.slice(1)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
