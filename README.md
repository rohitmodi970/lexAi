# LexAI

AI-powered legal awareness assistant for Indian law.

**Phase 1:** Guest chat with section tagging  
**Phase 2:** Email auth, saved chat sessions, sidebar history

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Configure `.env.local`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the Supabase migration (SQL Editor or CLI):

```bash
# Apply supabase/migrations/001_chat_schema.sql in your Supabase project
```

In the Supabase dashboard: **SQL Editor** → paste the migration file → run.

5. Enable email auth in Supabase: **Authentication** → **Providers** → Email.

6. Add redirect URL in Supabase: **Authentication** → **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

7. Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/chat](http://localhost:3000/chat) to start chatting.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/chat` | New guest or authenticated chat |
| `/chat/[sessionId]` | Saved conversation |
| `/login` | Sign in / sign up |
| `/dashboard` | Account and recent chats (protected) |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project docs

- [lexAi.md](./lexAi.md) — Product specification
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — Phased implementation plan
