"use client";

import { create } from "zustand";
import type { ChatApiMessage, Message, SectionTag } from "@/types/chat";

interface PersistableMessage {
  role: "user" | "assistant";
  content: string;
  sections?: SectionTag[];
}

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  isLoadingSession: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setAuthenticated: (value: boolean) => void;
  sendMessage: (content: string) => Promise<string | null>;
  loadSession: (sessionId: string) => Promise<void>;
  saveGuestConversation: () => Promise<string | null>;
  clearError: () => void;
  reset: () => void;
}

function toApiMessages(messages: Message[]): ChatApiMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

function toPersistable(message: Message): PersistableMessage {
  return {
    role: message.role,
    content: message.content,
    sections: message.sections,
  };
}

async function createSession(firstMessage: string): Promise<string> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstMessage }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create session.");
  }
  return data.session.id as string;
}

async function persistMessages(
  sessionId: string,
  payloads: PersistableMessage[],
): Promise<void> {
  const response = await fetch(`/api/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: payloads }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Failed to save messages.");
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  isLoadingSession: false,
  isAuthenticated: false,
  error: null,

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      messages: [],
      sessionId: null,
      isLoading: false,
      isLoadingSession: false,
      error: null,
    }),

  loadSession: async (sessionId: string) => {
    set({ isLoadingSession: true, error: null });

    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load conversation.");
      }

      set({
        sessionId: data.session.id,
        messages: data.messages.map(
          (m: Message & { createdAt: string }) => ({
            ...m,
            createdAt: new Date(m.createdAt),
          }),
        ),
        isLoadingSession: false,
      });
    } catch (error) {
      set({
        isLoadingSession: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load conversation.",
      });
    }
  },

  saveGuestConversation: async () => {
    const { messages, isAuthenticated } = get();
    if (!isAuthenticated || messages.length === 0) return null;

    const firstUser = messages.find((m) => m.role === "user");
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstMessage: firstUser?.content,
        messages: messages.map(toPersistable),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Failed to save conversation.");
    }

    const sessionId = data.session.id as string;
    set({ sessionId });
    return sessionId;
  },

  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || get().isLoading) return null;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    const nextMessages = [...get().messages, userMessage];
    set({ messages: nextMessages, isLoading: true, error: null });

    let sessionId = get().sessionId;
    let createdSessionId: string | null = null;

    try {
      if (get().isAuthenticated) {
        if (!sessionId) {
          sessionId = await createSession(trimmed);
          createdSessionId = sessionId;
          set({ sessionId });
          await persistMessages(sessionId, [toPersistable(userMessage)]);
        } else {
          await persistMessages(sessionId, [toPersistable(userMessage)]);
        }
      }

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

      if (get().isAuthenticated && sessionId) {
        await persistMessages(sessionId, [toPersistable(assistantMessage)]);
      }

      return createdSessionId;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get a response. Please try again.",
      });
      return null;
    }
  },
}));
