"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chat-store";

export function ChatInput() {
  const [input, setInput] = useState("");
  const isLoading = useChatStore((s) => s.isLoading);
  const sendMessage = useChatStore((s) => s.sendMessage);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-800 bg-zinc-950/80 p-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your legal question in plain language…"
          rows={1}
          disabled={isLoading}
          className="max-h-32 min-h-[52px] flex-1"
        />
        <Button
          type="submit"
          size="lg"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-zinc-600">
        Press Enter to send · Shift+Enter for a new line
      </p>
    </form>
  );
}
