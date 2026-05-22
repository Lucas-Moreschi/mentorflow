"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/stores/notificationStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

const typeLabel: Record<string, string> = {
  message: "Nova mensagem",
  request: "Solicitação de mentoria",
  accepted: "Mentoria aceita!",
  rejected: "Solicitação recusada",
};

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotificationStore();

  return (
    <DropdownMenu onOpenChange={(open) => { if (open) markAllRead(); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={`/app/chat/${n.mentorshipId}`}
                className={cn(
                  "flex flex-col gap-0.5 px-3 py-2.5 text-sm hover:bg-accent transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <span className="font-medium">{typeLabel[n.type] ?? n.type}</span>
                <span className="text-muted-foreground text-xs line-clamp-1">
                  {n.message}
                </span>
              </Link>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
