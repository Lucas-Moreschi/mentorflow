"use client";

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useNotificationStore } from "@/stores/notificationStore";
import type { MessageData } from "@/types/mentorship";

export function useChat(mentorshipId: string, initialMessages: MessageData[]) {
  const { data: session } = useSession();
  const { messages, setMessages, setCurrentRoom, reset } = useChatStore();
  const { markMentorshipRead } = useNotificationStore();

  useEffect(() => {
    setMessages(initialMessages);
    setCurrentRoom(mentorshipId);
    markMentorshipRead(mentorshipId);

    if (session?.user?.id) {
      const socket = getSocket(session.user.id);
      socket.emit("join-room", { mentorshipId });
    }

    return () => {
      if (session?.user?.id) {
        const socket = getSocket(session.user.id);
        socket.emit("leave-room", { mentorshipId });
      }
      reset();
    };
  }, [mentorshipId, session?.user?.id]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !session?.user?.id) return;
      const socket = getSocket(session.user.id);
      socket.emit("send-message", { mentorshipId, content });
    },
    [mentorshipId, session?.user?.id]
  );

  return { messages, sendMessage };
}
