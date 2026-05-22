import { create } from "zustand";
import type { MessageData } from "@/types/mentorship";

interface TypingUser {
  userId: string;
  name: string;
}

interface ChatState {
  messages: MessageData[];
  typingUsers: TypingUser[];
  isConnected: boolean;
  currentRoomId: string | null;
  addMessage: (message: MessageData) => void;
  setMessages: (messages: MessageData[]) => void;
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: string) => void;
  setConnected: (connected: boolean) => void;
  setCurrentRoom: (roomId: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  typingUsers: [],
  isConnected: false,
  currentRoomId: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.some((u) => u.userId === user.userId)
        ? state.typingUsers
        : [...state.typingUsers, user],
    })),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u.userId !== userId),
    })),

  setConnected: (isConnected) => set({ isConnected }),

  setCurrentRoom: (currentRoomId) => set({ currentRoomId }),

  reset: () =>
    set({ messages: [], typingUsers: [], currentRoomId: null }),
}));
