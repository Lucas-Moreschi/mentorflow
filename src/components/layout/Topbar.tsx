import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 shrink-0">
      {title ? (
        <h1 className="text-lg font-semibold">{title}</h1>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
