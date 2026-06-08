"use client";

import { create } from "zustand";
import type { ChatApiMessage, Message } from "@/types/chat";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

function toApiMessages(messages: Message[]): ChatApiMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  reset: () => set({ messages: [], isLoading: false, error: null }),

  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || get().isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    const nextMessages = [...get().messages, userMessage];
    set({ messages: nextMessages, isLoading: true, error: null });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(nextMessages) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        sections: data.sections,
        createdAt: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get a response. Please try again.",
      });
    }
  },
}));
