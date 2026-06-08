import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { SaveConversationNudge } from "@/components/chat/save-conversation-nudge";

export default function ChatPage() {
  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col">
        <ChatMessages />
      </main>
      <SaveConversationNudge />
      <ChatInput />
    </>
  );
}
