import Link from "next/link";
import { Scale } from "lucide-react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-zinc-100">
          <Scale className="size-5 text-amber-400" />
          <span className="font-semibold">LexAI</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
        >
          Home
        </Link>
      </header>
      {children}
    </div>
  );
}
