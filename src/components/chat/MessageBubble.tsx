import { cn, formatTime } from "@/lib/utils";
import type { MessageData } from "@/types/mentorship";

interface MessageBubbleProps {
  message: MessageData;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderInitials?: string;
}

export function MessageBubble({
  message,
  isOwn,
  senderInitials,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 items-end max-w-[75%]",
        isOwn ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold shrink-0 mb-0.5">
          {senderInitials}
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-2 max-w-full",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={cn(
            "text-[10px] mt-1 text-right",
            isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
