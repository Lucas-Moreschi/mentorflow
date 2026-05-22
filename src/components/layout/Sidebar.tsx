"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  History,
  Star,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";

const studentNav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/mentors", label: "Encontrar Mentores", icon: Users },
  { href: "/app/mentorships", label: "Minhas Mentorias", icon: BookOpen },
  { href: "/app/history", label: "Histórico", icon: History },
];

const mentorNav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/requests", label: "Solicitações", icon: Star },
  { href: "/app/mentorships", label: "Minhas Mentorias", icon: BookOpen },
  { href: "/app/history", label: "Histórico", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { unreadMessageCount, markMessagesRead } = useNotificationStore();

  const isStudent = session?.user?.role === "STUDENT";
  const navItems = isStudent ? studentNav : mentorNav;
  const isConversasActive = pathname.startsWith("/app/chat");

  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar w-60 shrink-0">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sidebar-foreground">MentorFlow</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/app/dashboard" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href="/app/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/app/profile"
              ? "bg-sidebar-primary/10 text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Perfil
        </Link>

        <Link
          href="/app/mentorships"
          onClick={markMessagesRead}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isConversasActive
              ? "bg-sidebar-primary/10 text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          Conversas
          {unreadMessageCount > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
