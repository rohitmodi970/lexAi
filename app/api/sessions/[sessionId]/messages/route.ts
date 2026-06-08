import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SectionTag } from "@/types/chat";

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

interface MessagePayload {
  role: "user" | "assistant";
  content: string;
  sections?: SectionTag[];
}

export async function POST(request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const body = (await request.json()) as MessagePayload | { messages: MessagePayload[] };

  const payloads: MessagePayload[] = "messages" in body ? body.messages : [body];

  if (!payloads.length || payloads.some((m) => !m.role || !m.content?.trim())) {
    return NextResponse.json({ error: "Invalid message payload." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const rows = payloads.map((m) => ({
    session_id: sessionId,
    role: m.role,
    content: m.content.trim(),
    sections_tagged: m.sections ?? [],
  }));

  const { data, error } = await supabase
    .from("messages")
    .insert(rows)
    .select("id, role, content, sections_tagged, created_at");

  if (error) {
    console.error("[messages POST]", error);
    return NextResponse.json(
      { error: "Failed to save messages." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    messages: (data ?? []).map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      sections: row.sections_tagged ?? [],
      createdAt: row.created_at,
    })),
  });
}
