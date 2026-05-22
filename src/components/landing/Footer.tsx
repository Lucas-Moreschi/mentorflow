import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">MentorFlow</span>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} MentorFlow. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
