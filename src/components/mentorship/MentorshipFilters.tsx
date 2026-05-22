"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "todas",     label: "Todas" },
  { value: "ativas",    label: "Ativas" },
  { value: "pendentes", label: "Pendentes" },
  { value: "concluidas",label: "Concluídas" },
  { value: "encerradas",label: "Encerradas" },
] as const;

type FilterValue = (typeof TABS)[number]["value"];

interface Props {
  current: FilterValue;
  counts: Record<FilterValue, number>;
}

export function MentorshipFilters({ current, counts }: Props) {
  return (
    <div className="flex gap-1 flex-wrap">
      {TABS.map((tab) => {
        const isActive = current === tab.value;
        const count = counts[tab.value];
        return (
          <Link
            key={tab.value}
            href={tab.value === "todas" ? "/app/mentorships" : `/app/mentorships?filter=${tab.value}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-xs leading-none",
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-foreground"
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
