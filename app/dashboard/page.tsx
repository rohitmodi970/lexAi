import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { MessageSquare, Scale } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    redirect("/chat");
  }

  const user = await getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Scale className="size-5 text-amber-400" />
            LexAI
          </Link>
          <Link
            href="/chat"
            className="text-sm text-amber-400 hover:text-amber-300"
          >
            Open chat →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-zinc-400">Signed in as {user.email}</p>

        <Card className="mt-8">
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your LexAI account.</CardDescription>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </Card>

        <Card className="mt-4">
          <CardTitle>Recent conversations</CardTitle>
          <CardDescription>Your latest saved chats.</CardDescription>
          <ul className="mt-4 space-y-2">
            {!sessions?.length ? (
              <li className="text-sm text-zinc-500">No conversations yet.</li>
            ) : (
              sessions.map((session) => (
                <li key={session.id}>
                  <Link
                    href={`/chat/${session.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    <MessageSquare className="size-4 text-amber-400" />
                    {session.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
          <Link
            href="/chat"
            className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            Start a new chat →
          </Link>
        </Card>
      </main>
    </div>
  );
}
