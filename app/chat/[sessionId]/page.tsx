import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatSessionLoader } from "@/components/chat/chat-session-loader";

export default async function SessionChatPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <>
      <ChatSessionLoader sessionId={sessionId} />
      <main className="flex min-h-0 flex-1 flex-col">
        <ChatMessages />
      </main>
      <ChatInput />
    </>
  );
}
