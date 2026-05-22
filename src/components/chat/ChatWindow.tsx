"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chatStore";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { MessageData } from "@/types/mentorship";

interface Participant {
  id: string;
  name: string;
  role: string;
}

interface ChatWindowProps {
  mentorshipId: string;
  initialMessages: MessageData[];
  participants: Participant[];
}

export function ChatWindow({ mentorshipId, initialMessages, participants }: ChatWindowProps) {
  const { data: session } = useSession();
  const { messages, sendMessage } = useChat(mentorshipId, initialMessages);

  const participantMap = Object.fromEntries(
    participants.map((p) => [p.id, p])
  );

  if (!session) return null;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border overflow-hidden bg-card">
      <MessageList
        messages={messages}
        currentUserId={session.user.id}
        participants={participantMap}
      />
      <ChatInput
        mentorshipId={mentorshipId}
        onSend={sendMessage}
      />
    </div>
  );
}
