import { AlertTriangle } from "lucide-react";

export const DISCLAIMER_TEXT =
  "This is for legal awareness only and does not constitute legal advice. For serious matters, please consult a licensed advocate.";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-xs leading-relaxed text-zinc-500 ${className ?? ""}`}
    >
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500/70" />
      <span>{DISCLAIMER_TEXT}</span>
    </p>
  );
}
