"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";

const NUDGE_AFTER_MESSAGES = 4;

export function SaveConversationNudge() {
  const router = useRouter();
  const { user } = useAuth();
  const messages = useChatStore((s) => s.messages);
  const sessionId = useChatStore((s) => s.sessionId);
  const saveGuestConversation = useChatStore((s) => s.saveGuestConversation);
  const [dismissed, setDismissed] = useState(false);
  const [saving, setSaving] = useState(false);

  if (sessionId || dismissed || messages.length < NUDGE_AFTER_MESSAGES) {
    return null;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const id = await saveGuestConversation();
      if (id) {
        router.push(`/chat/${id}`);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-4 mb-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Bookmark className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <p className="text-sm text-amber-100">
            Want to save this conversation? It&apos;s free — sign in or create an account.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
          {user ? (
            <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving…" : "Save chat"}
            </Button>
          ) : (
            <Link href={`/login?next=/chat`}>
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
