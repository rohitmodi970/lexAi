"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, Scale } from "lucide-react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export function ChatShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 lg:flex-row">
      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="flex items-center gap-2 text-zinc-100">
              <Scale className="size-5 text-amber-400" />
              <span className="font-semibold">LexAI</span>
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Home
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
