"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTyping } from "@/hooks/useTyping";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  mentorshipId: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ mentorshipId, onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { startTyping, stopTyping } = useTyping(mentorshipId);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    stopTyping();
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(newValue: string) {
    setValue(newValue);
    if (newValue.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  }

  return (
    <div className="flex items-end gap-2 p-4 border-t border-border">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
        className={cn(
          "min-h-[44px] max-h-32 resize-none flex-1 text-sm",
          "focus-visible:ring-1"
        )}
        disabled={disabled}
        rows={1}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="h-11 w-11 shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
