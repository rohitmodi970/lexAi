"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

export function ChatSessionLoader({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const loadSession = useChatStore((s) => s.loadSession);
  const isLoadingSession = useChatStore((s) => s.isLoadingSession);
  const error = useChatStore((s) => s.error);
  const currentSessionId = useChatStore((s) => s.sessionId);

  useEffect(() => {
    if (currentSessionId !== sessionId) {
      void loadSession(sessionId);
    }
  }, [sessionId, loadSession, currentSessionId]);

  useEffect(() => {
    if (error && !isLoadingSession) {
      router.replace("/chat");
    }
  }, [error, isLoadingSession, router]);

  if (isLoadingSession && currentSessionId !== sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-zinc-500">
        <Loader2 className="size-4 animate-spin" />
        Loading conversation…
      </div>
    );
  }

  return null;
}
