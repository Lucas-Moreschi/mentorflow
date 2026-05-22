"use client";

import { Sparkles } from "lucide-react";
import { cn, matchScoreBg } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchBadgeProps {
  score: number;
  explanation?: string;
  className?: string;
}

export function MatchBadge({ score, explanation, className }: MatchBadgeProps) {
  const tooltipText = explanation || "Compatibilidade calculada com base no seu perfil, habilidades e interesses.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold cursor-default",
            matchScoreBg(score),
            className
          )}
        >
          <Sparkles className="w-3 h-3" />
          {score}% match
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-72 leading-relaxed">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
