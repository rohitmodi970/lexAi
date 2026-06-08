import Link from "next/link";
import { Scale } from "lucide-react";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Disclaimer } from "@/components/disclaimer";

export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Scale className="size-5 text-amber-400" />
            LexAI
          </Link>
          <Link
            href="/chat"
            className="text-sm text-amber-400 transition-colors hover:text-amber-300"
          >
            Open chat →
          </Link>
        </div>
      </header>

      <Hero />
      <Features />

      <footer className="border-t border-zinc-800 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Disclaimer />
          <p className="mt-4 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} LexAI. For legal awareness only.
          </p>
        </div>
      </footer>
    </div>
  );
}
