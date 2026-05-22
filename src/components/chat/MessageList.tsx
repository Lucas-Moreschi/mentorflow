"use client";

import { useEffect, useRef } from "react";
import type { MessageData } from "@/types/mentorship";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { getInitials, formatDate } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Participant {
  id: string;
  name: string;
}

interface MessageListProps {
  messages: MessageData[];
  currentUserId: string;
  participants: Record<string, Participant>;
}

export function MessageList({ messages, currentUserId, participants }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Nenhuma mensagem ainda. Diga olá! 👋
      </div>
    );
  }

  let lastDate: Date | null = null;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message, i) => {
        const messageDate = new Date(message.createdAt);
        const showDateSeparator = !lastDate || !isSameDay(lastDate, messageDate);
        lastDate = messageDate;

        const isOwn = message.senderId === currentUserId;
        const sender = participants[message.senderId];

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground px-2">
                  {format(messageDate, "d 'de' MMMM", { locale: ptBR })}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
            <MessageBubble
              message={message}
              isOwn={isOwn}
              senderInitials={sender ? getInitials(sender.name) : "?"}
            />
          </div>
        );
      })}
      <TypingIndicator />
      <div ref={bottomRef} />
    </div>
  );
}
