import { Suspense } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-950 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-zinc-100">
        <Scale className="size-6 text-amber-400" />
        <span className="text-xl font-semibold">LexAI</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to save your conversations and pick up where you left off.
        </CardDescription>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </Card>
    </div>
  );
}
