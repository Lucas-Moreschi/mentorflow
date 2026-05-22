"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useChatStore } from "@/stores/chatStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { toast } from "sonner";
import type { Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<AppSocket | null>(null);
  const { setConnected, addMessage, addTypingUser, removeTypingUser } = useChatStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = getSocket(session.user.id);
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("message-received", (message) => {
      addMessage(message);
    });

    socket.on("user-typing", ({ userId, name }) => {
      if (userId !== session.user.id) {
        addTypingUser({ userId, name });
      }
    });

    socket.on("user-stopped-typing", ({ userId }) => {
      removeTypingUser(userId);
    });

    socket.on("notification", (notification) => {
      addNotification(notification);
      if (notification.type !== "message") {
        const messages: Record<string, string> = {
          request: "Você recebeu uma solicitação de mentoria",
          accepted: "Sua mentoria foi aceita!",
          rejected: "Sua solicitação foi recusada",
        };
        toast.info(messages[notification.type] || notification.message);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message-received");
      socket.off("user-typing");
      socket.off("user-stopped-typing");
      socket.off("notification");
    };
  }, [session?.user?.id, setConnected, addMessage, addTypingUser, removeTypingUser, addNotification]);

  return socketRef.current;
}
