"use client";

import { useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";

export function useTyping(mentorshipId: string) {
  const { data: session } = useSession();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!session?.user?.id) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      const socket = getSocket(session.user.id);
      socket.emit("typing-start", { mentorshipId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      const socket = getSocket(session.user.id!);
      socket.emit("typing-stop", { mentorshipId });
    }, 2000);
  }, [mentorshipId, session?.user?.id]);

  const stopTyping = useCallback(() => {
    if (!session?.user?.id || !isTypingRef.current) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    const socket = getSocket(session.user.id);
    socket.emit("typing-stop", { mentorshipId });
  }, [mentorshipId, session?.user?.id]);

  return { startTyping, stopTyping };
}
