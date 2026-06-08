"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, MessageSquarePlus, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";
import type { ChatSessionSummary } from "@/types/database";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const reset = useChatStore((s) => s.reset);
  const sessionId = useChatStore((s) => s.sessionId);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const hasLoadedSessions = user ? loadedForUserId === user.id : false;

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetch("/api/sessions")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setSessions(data.sessions as ChatSessionSummary[]);
          setLoadedForUserId(user.id);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, sessionId, pathname]);

  function handleNewChat() {
    reset();
    onClose();
    router.push("/chat");
  }

  async function handleSignOut() {
    reset();
    await signOut();
    onClose();
    router.push("/chat");
    router.refresh();
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <span className="text-sm font-medium text-zinc-300">Conversations</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      {user && (
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleNewChat}
          >
            <MessageSquarePlus className="size-4" />
            New chat
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {!user ? (
          <p className="px-2 py-4 text-sm text-zinc-500">
            Sign in to save and revisit your conversations.
          </p>
        ) : !hasLoadedSessions ? (
          <p className="px-2 py-4 text-sm text-zinc-500">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="px-2 py-4 text-sm text-zinc-500">No saved chats yet.</p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => {
              const active =
                pathname === `/chat/${session.id}` || sessionId === session.id;
              return (
                <li key={session.id}>
                  <Link
                    href={`/chat/${session.id}`}
                    onClick={onClose}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <span className="line-clamp-2">{session.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-auto border-t border-zinc-800 p-3 space-y-2">
        {user ? (
          <>
            <p className="truncate px-1 text-xs text-zinc-500">{user.email}</p>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login?next=/chat" onClick={onClose}>
            <Button variant="outline" className="w-full gap-2">
              <LogIn className="size-4" />
              Sign in to save chats
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:flex">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />
          <aside className="relative z-10 h-full w-72 border-r border-zinc-800 bg-zinc-950 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
