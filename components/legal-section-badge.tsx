import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SectionTag } from "@/types/chat";

interface LegalSectionBadgeProps {
  section: SectionTag;
}

export function LegalSectionBadge({ section }: LegalSectionBadgeProps) {
  return (
    <Badge title={`${section.act} — ${section.title}`}>
      <Pin className="size-3" />
      <span>
        {section.code} — {section.title}
      </span>
    </Badge>
  );
}

export function LegalSectionList({ sections }: { sections: SectionTag[] }) {
  if (sections.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Relevant sections
      </p>
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <LegalSectionBadge key={`${section.code}-${section.title}`} section={section} />
        ))}
      </div>
    </div>
  );
}
