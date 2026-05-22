import type { MessageData } from "./mentorship";

export interface ServerToClientEvents {
  "message-received": (message: MessageData) => void;
  "user-typing": (data: { userId: string; name: string }) => void;
  "user-stopped-typing": (data: { userId: string }) => void;
  "room-joined": (data: { mentorshipId: string }) => void;
  notification: (data: {
    type: "message" | "request" | "accepted" | "rejected";
    mentorshipId: string;
    message: string;
  }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  "join-room": (data: { mentorshipId: string }) => void;
  "leave-room": (data: { mentorshipId: string }) => void;
  "send-message": (data: { mentorshipId: string; content: string }) => void;
  "typing-start": (data: { mentorshipId: string }) => void;
  "typing-stop": (data: { mentorshipId: string }) => void;
}
