"use client";

import { Scale, User } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { LegalSectionList } from "@/components/legal-section-badge";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-zinc-700" : "bg-amber-600/20 text-amber-400"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Scale className="size-4" />}
      </div>

      <div
        className={`max-w-[85%] space-y-2 sm:max-w-[75%] ${
          isUser ? "items-end text-right" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-amber-600 text-white"
              : "border border-zinc-800 bg-zinc-900 text-zinc-100"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {!isUser && message.sections && message.sections.length > 0 && (
          <LegalSectionList sections={message.sections} />
        )}

        {!isUser && (
          <Disclaimer />
        )}
      </div>
    </div>
  );
}
