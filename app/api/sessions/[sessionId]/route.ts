import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/types/chat";

interface RouteContext {
  params: Promise<{ sessionId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, updated_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const { data: rows, error: messagesError } = await supabase
    .from("messages")
    .select("id, role, content, sections_tagged, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("[session GET messages]", messagesError);
    return NextResponse.json(
      { error: "Failed to load messages." },
      { status: 500 },
    );
  }

  const messages: Message[] = (rows ?? []).map((row) => ({
    id: row.id,
    role: row.role as Message["role"],
    content: row.content,
    sections: row.sections_tagged ?? [],
    createdAt: new Date(row.created_at),
  }));

  return NextResponse.json({
    session: {
      id: session.id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    },
    messages,
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .update({ title })
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .select("id, title, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  return NextResponse.json({ session: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
