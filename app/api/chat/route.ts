import { NextResponse } from "next/server";
import { getChatModel, getOpenAIClient } from "@/lib/openai";
import { parseAssistantResponse } from "@/lib/parse-sections";
import { LEGAL_SYSTEM_PROMPT } from "@/lib/prompts/legal-system";
import type { ChatApiMessage } from "@/types/chat";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatApiMessage[] };

    if (!body.messages?.length) {
      return NextResponse.json(
        { error: "At least one message is required." },
        { status: 400 },
      );
    }

    const lastMessage = body.messages[body.messages.length - 1];
    if (lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "The last message must be from the user." },
        { status: 400 },
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: getChatModel(),
      max_tokens: 1200,
      messages: [
        { role: "system", content: LEGAL_SYSTEM_PROMPT },
        ...body.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "No response from the AI. Please try again." },
        { status: 502 },
      );
    }

    const { content, sections } = parseAssistantResponse(raw);

    return NextResponse.json({ content, sections });
  } catch (error) {
    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 503 },
      );
    }

    console.error("[chat]", error);
    return NextResponse.json(
      { error: "Failed to generate a response. Please try again." },
      { status: 500 },
    );
  }
}
