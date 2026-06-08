import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Pin, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Conversational & clear",
    description:
      "No legal jargon. LexAI explains your situation and rights the way a knowledgeable friend would.",
  },
  {
    icon: Pin,
    title: "Section tagging",
    description:
      "Every answer surfaces relevant IPC sections, acts, and statutes so you know exactly what applies.",
  },
  {
    icon: Heart,
    title: "Sensitive topics welcome",
    description:
      "Harassment, domestic issues, workplace disputes — handled with empathy, not judgment.",
  },
  {
    icon: Shield,
    title: "Awareness, not advice",
    description:
      "Built-in disclaimers remind you to consult a licensed advocate for serious matters.",
  },
];

export function Features() {
  return (
    <section className="border-t border-zinc-800 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-zinc-100">
          Why LexAI?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-400">
          Most people avoid legal help because it feels intimidating. LexAI closes
          that gap.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <feature.icon className="size-5 text-amber-400" />
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
