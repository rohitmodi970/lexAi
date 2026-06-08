"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useChatStore } from "@/store/chat-store";
import { Loader2 } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "My landlord changed the locks without notice — what are my rights?",
  "What is the difference between IPC 302 and IPC 304?",
  "Someone is threatening me online — which section applies?",
];

export function ChatMessages() {
  const router = useRouter();
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const isLoadingSession = useChatStore((s) => s.isLoadingSession);
  const error = useChatStore((s) => s.error);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleExamplePrompt(prompt: string) {
    const newSessionId = await sendMessage(prompt);
    if (newSessionId) {
      router.replace(`/chat/${newSessionId}`);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (isLoadingSession) {
    return null;
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-zinc-100">
            Ask anything about Indian law
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Plain-language answers with relevant legal sections — no account needed.
          </p>
        </div>

        <div className="grid w-full max-w-lg gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void handleExamplePrompt(prompt)}
              disabled={isLoading}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="size-4 animate-spin" />
          LexAI is thinking…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
