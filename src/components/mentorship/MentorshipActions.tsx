"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores/notificationStore";
import { CompleteMentorshipButton, CancelRequestButton } from "./CompleteMentorshipButton";

interface MentorshipActionsProps {
  mentorshipId: string;
  status: string;
  isStudent: boolean;
}

export function MentorshipActions({ mentorshipId, status, isStudent }: MentorshipActionsProps) {
  const router = useRouter();
  const { unreadByMentorship, markMentorshipRead } = useNotificationStore();
  const unread = unreadByMentorship[mentorshipId] ?? 0;

  function handleChatClick() {
    markMentorshipRead(mentorshipId);
    router.push(`/app/chat/${mentorshipId}`);
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button size="sm" variant="outline" onClick={handleChatClick}>
            <MessageSquare className="w-4 h-4 mr-1" />
            Chat
          </Button>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[10px] font-bold text-destructive-foreground leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </div>
        <CompleteMentorshipButton mentorshipId={mentorshipId} />
      </div>
    );
  }

  if (status === "PENDING" && isStudent) {
    return <CancelRequestButton mentorshipId={mentorshipId} />;
  }

  if (status === "COMPLETED") {
    return (
      <Button size="sm" variant="outline" onClick={handleChatClick}>
        <MessageSquare className="w-4 h-4 mr-1" />
        Ver conversa
      </Button>
    );
  }

  return null;
}
