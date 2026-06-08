import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { titleFromMessage } from "@/lib/sessions";
import type { SectionTag } from "@/types/chat";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[sessions GET]", error);
    return NextResponse.json(
      { error: "Failed to load sessions." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    sessions: data.map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    })),
  });
}

interface CreateSessionBody {
  title?: string;
  firstMessage?: string;
  messages?: Array<{
    role: "user" | "assistant";
    content: string;
    sections?: SectionTag[];
  }>;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateSessionBody;
  const title =
    body.title?.trim() ||
    (body.firstMessage ? titleFromMessage(body.firstMessage) : "New conversation");

  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id, title })
    .select("id, title, created_at, updated_at")
    .single();

  if (sessionError || !session) {
    console.error("[sessions POST]", sessionError);
    return NextResponse.json(
      { error: "Failed to create session." },
      { status: 500 },
    );
  }

  if (body.messages?.length) {
    const rows = body.messages.map((m) => ({
      session_id: session.id,
      role: m.role,
      content: m.content,
      sections_tagged: m.sections ?? [],
    }));

    const { error: messagesError } = await supabase.from("messages").insert(rows);

    if (messagesError) {
      console.error("[sessions POST messages]", messagesError);
      await supabase.from("chat_sessions").delete().eq("id", session.id);
      return NextResponse.json(
        { error: "Failed to save messages." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    session: {
      id: session.id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    },
  });
}
