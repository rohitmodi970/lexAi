import { SECTIONS_DELIMITER } from "@/lib/prompts/legal-system";
import type { SectionTag } from "@/types/chat";

export function parseAssistantResponse(raw: string): {
  content: string;
  sections: SectionTag[];
} {
  const delimiterIndex = raw.indexOf(SECTIONS_DELIMITER);

  if (delimiterIndex === -1) {
    return {
      content: raw.trim(),
      sections: extractSectionsFallback(raw),
    };
  }

  const content = raw.slice(0, delimiterIndex).trim();
  const sectionsBlock = raw.slice(delimiterIndex + SECTIONS_DELIMITER.length).trim();

  try {
    const parsed = JSON.parse(sectionsBlock) as SectionTag[];
    if (Array.isArray(parsed)) {
      return { content, sections: parsed.filter(isValidSection) };
    }
  } catch {
    // fall through to regex fallback on visible content
  }

  return {
    content,
    sections: extractSectionsFallback(content),
  };
}

function isValidSection(section: SectionTag): boolean {
  return (
    typeof section.code === "string" &&
    section.code.length > 0 &&
    typeof section.title === "string" &&
    typeof section.act === "string"
  );
}

function extractSectionsFallback(text: string): SectionTag[] {
  const matches = [...text.matchAll(
    /\b(IPC|CrPC|BNS|IT Act)\s*(?:Section\s*)?(\d+[A-Za-z]?)\s*[—–-]\s*([^\n.]+)/gi,
  )];

  return matches.map((match) => ({
    act: match[1].toUpperCase() === "IT ACT" ? "IT Act" : match[1].toUpperCase(),
    code: `${match[1].toUpperCase() === "IT ACT" ? "IT Act" : match[1].toUpperCase()} ${match[2]}`,
    title: match[3].trim(),
  }));
}
