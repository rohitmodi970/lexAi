import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
          <Scale className="size-4" />
          AI-powered legal awareness
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          Legal help that speaks your language
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-zinc-400">
          LexAI is a conversational assistant built exclusively around Indian law.
          Ask anything — from rent disputes to workplace issues — and get clear
          answers with the relevant sections explained in plain language.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/chat"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 text-base font-medium text-white transition-colors hover:bg-amber-500 sm:w-auto"
          >
            Start chatting
            <ArrowRight className="size-4" />
          </Link>
          <p className="text-sm text-zinc-500">No account needed to try</p>
        </div>
      </div>
    </section>
  );
}
