import { create } from "zustand";

interface Notification {
  id: string;
  type: "message" | "request" | "accepted" | "rejected";
  mentorshipId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  unreadMessageCount: number;
  unreadByMentorship: Record<string, number>;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  markMessagesRead: () => void;
  markMentorshipRead: (mentorshipId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  unreadMessageCount: 0,
  unreadByMentorship: {},

  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).slice(2),
        read: false,
        createdAt: new Date(),
      };
      const isMessage = notification.type === "message";
      const prev = state.unreadByMentorship[notification.mentorshipId] ?? 0;
      return {
        notifications: [newNotification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
        unreadMessageCount: isMessage ? state.unreadMessageCount + 1 : state.unreadMessageCount,
        unreadByMentorship: isMessage
          ? { ...state.unreadByMentorship, [notification.mentorshipId]: prev + 1 }
          : state.unreadByMentorship,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
      unreadMessageCount: 0,
      unreadByMentorship: {},
    })),

  markMessagesRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.type === "message" ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - state.unreadMessageCount),
      unreadMessageCount: 0,
      unreadByMentorship: {},
    })),

  markMentorshipRead: (mentorshipId) =>
    set((state) => {
      const count = state.unreadByMentorship[mentorshipId] ?? 0;
      if (count === 0) return state;
      const updated = { ...state.unreadByMentorship };
      delete updated[mentorshipId];
      return {
        notifications: state.notifications.map((n) =>
          n.mentorshipId === mentorshipId && n.type === "message" ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - count),
        unreadMessageCount: Math.max(0, state.unreadMessageCount - count),
        unreadByMentorship: updated,
      };
    }),
}));
