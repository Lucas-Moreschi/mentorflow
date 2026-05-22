import { useChatStore } from "@/stores/chatStore";

export function TypingIndicator() {
  const typingUsers = useChatStore((s) => s.typingUsers);

  if (typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u.name.split(" ")[0]).join(", ");

  return (
    <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground animate-fade-in">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <span>{names} está digitando...</span>
    </div>
  );
}
