export type MessageRole = "user" | "assistant";

export interface SectionTag {
  code: string;
  title: string;
  act: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sections?: SectionTag[];
  createdAt: Date;
}

export interface ChatApiMessage {
  role: MessageRole;
  content: string;
}

export interface ChatApiResponse {
  content: string;
  sections: SectionTag[];
}
