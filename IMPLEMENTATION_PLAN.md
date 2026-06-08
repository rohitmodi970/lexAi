# LexAI — Implementation Plan

**Source spec:** [lexAi.md](./lexAi.md)  
**Current repo state:** Next.js 16 (App Router), React 19, Tailwind CSS v4 — default scaffold only  
**Last updated:** June 2025

---

## 1. Goals

Build LexAI in incremental, shippable phases. Each phase produces a working slice of the product that can be demoed and tested before moving on.


| Principle                 | Detail                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| Ship early                | Phase 1 delivers a usable guest chat with real AI responses                    |
| Defer complexity          | Auth, persistence, and OCR come after core chat works                          |
| Match the spec            | Tech choices follow [lexAi.md](./lexAi.md) unless a blocker forces a change    |
| India-first legal context | System prompt and section tagging target IPC, CrPC, and common Indian statutes |


---

## 2. Phase Overview


| Phase | Name                    | Outcome                                         | Depends on |
| ----- | ----------------------- | ----------------------------------------------- | ---------- |
| **1** | Foundation & Guest Chat | Landing page + live AI chat (no login)          | —          |
| **2** | Auth & Persistence      | Accounts, saved sessions, sidebar history       | Phase 1    |
| **3** | Section Pages & Polish  | Clickable section breakdowns, dashboard, search | Phase 2    |
| **4** | Optional OCR            | Document upload and analysis                    | Phase 3    |


Estimated calendar time (single developer, part-time): **Phase 1 ~1–2 weeks**, full MVP (Phases 1–3) ~4–6 weeks.

---

## 3. Phase 1 — Foundation & Guest Chat

### 3.1 Objective

A visitor can land on LexAI, open chat, ask a law-related question in plain language, and receive a conversational answer with inline legal section tags and a disclaimer — without creating an account.

### 3.2 Deliverables


| #   | Deliverable                                    | Route / artifact                      |
| --- | ---------------------------------------------- | ------------------------------------- |
| 1   | Project tooling and dependencies installed     | `package.json`, env template          |
| 2   | Design system (dark/neutral legal theme)       | `globals.css`, shadcn/ui components   |
| 3   | Landing page with value prop and CTA to chat   | `/`                                   |
| 4   | Chat layout (message list, input, empty state) | `/chat`                               |
| 5   | LLM API route with legal system prompt         | `app/api/chat/route.ts`               |
| 6   | Section tag parsing and badge UI               | `components/legal-section-badge.tsx`  |
| 7   | Disclaimer footer on every AI message          | `components/disclaimer.tsx`           |
| 8   | Off-topic guard (law-only responses)           | System prompt + optional server check |
| 9   | Mobile-responsive chat shell                   | Tailwind breakpoints                  |


### 3.3 Task Breakdown

#### Step 1 — Dependencies & environment

Install and configure:

```
@supabase/supabase-js   # client stub for Phase 2; no DB calls yet
zustand                 # chat UI state (messages, loading, input)
openai                  # GPT-4o primary model
class-variance-authority clsx tailwind-merge  # shadcn peer deps
lucide-react            # icons
```

Initialize shadcn/ui (Button, Input, Textarea, ScrollArea, Badge, Card).

Create `.env.example`:

```env
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Phase 2+
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

#### Step 2 — App structure

```
app/
  layout.tsx              # LexAI metadata, fonts, theme
  page.tsx                # Landing
  chat/
    page.tsx              # Guest chat
    layout.tsx            # Chat shell (header, main area)
  api/
    chat/
      route.ts            # Streaming or JSON LLM endpoint
components/
  chat/
    chat-messages.tsx
    chat-input.tsx
    message-bubble.tsx
  legal-section-badge.tsx
  disclaimer.tsx
  landing/
    hero.tsx
    features.tsx
lib/
  openai.ts               # OpenAI client singleton
  prompts/
    legal-system.ts       # System prompt (tone, scope, JSON schema)
  parse-sections.ts       # Extract section tags from AI output
store/
  chat-store.ts           # Zustand: messages[], isLoading, addMessage
types/
  chat.ts                 # Message, SectionTag types
```

#### Step 3 — System prompt design

The legal system prompt must enforce:

- **Scope:** Law-only; politely redirect off-topic questions
- **Tone:** Empathetic, plain language, not textbook
- **Output shape:** Structured so the app can parse section tags reliably

Recommended approach: ask the model to append a machine-readable block at the end of each response:

```json
{
  "sections": [
    { "code": "IPC 420", "title": "Cheating", "act": "IPC" }
  ]
}
```

Or use a delimiter format (`---SECTIONS---`) if JSON-in-stream is awkward for Phase 1.

Always include the awareness disclaimer in the visible text (not only in UI) so saved exports remain compliant.

#### Step 4 — Chat UI

- **Layout:** Centered conversation column; max-width ~768px; sticky input at bottom
- **User vs AI:** Clear visual separation (alignment, background, avatar/icon)
- **Loading:** Typing indicator or skeleton while awaiting API
- **Empty state:** Example prompts ("My landlord changed the locks…", "What is IPC 302?")
- **Errors:** Friendly retry message if API fails or key is missing

#### Step 5 — Landing page

Sections from spec:

- Headline: AI legal assistant, plain language
- Short problem statement
- Primary CTA → `/chat`
- Secondary: "No account needed to try"
- Feature bullets: law-focused, section tagging, sensitive-topic care
- Footer with product disclaimer

#### Step 6 — API route

`POST /api/chat`

Request body:

```json
{ "messages": [{ "role": "user" | "assistant", "content": "..." }] }
```

Response: assistant message text + parsed `sections[]`.

Phase 1 uses **non-streaming JSON** for simplicity; streaming can be added in Phase 2.

Rate limiting: basic in-memory or Vercel edge limit (document as follow-up).

#### Step 7 — Section badges (read-only in Phase 1)

Render badges inline below AI messages:

```
📌 IPC Section 420 — Cheating
```

In Phase 1, badges are **display-only** (no `/sections/[code]` page yet). Optional: `title` tooltip with one-line summary from the model.

### 3.4 Acceptance Criteria

- [ ] `pnpm dev` runs; `/` and `/chat` load without errors
- [ ] User can send a legal question and receive a relevant answer within ~15s
- [ ] Off-topic question (e.g. "What's the weather?") gets a polite redirect
- [ ] At least one legal section badge appears on substantive legal answers
- [ ] Every AI message shows the awareness disclaimer
- [ ] Layout works on mobile (375px) and desktop (1280px)
- [ ] `OPENAI_API_KEY` is never exposed to the client
- [ ] `.env.example` documents required variables; `.env.local` is gitignored

### 3.5 Out of Scope (Phase 1)

- User accounts and Supabase Auth
- Saving chat sessions to database
- Sidebar chat history
- `/chat/[sessionId]`, `/login`, `/dashboard`, `/sections/[code]`
- Google OAuth
- OCR document upload
- Supabase Realtime typing sync across devices
- Claude / GPT-3.5 fallback routing

### 3.6 Risks & Mitigations


| Risk                                     | Mitigation                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Inconsistent section tag format from LLM | Strict prompt + `parse-sections.ts` with fallback regex for "IPC Section NNN" |
| API cost during development              | Use `gpt-4o-mini` in dev via env flag; cap `max_tokens`                       |
| Legal accuracy expectations              | Prominent disclaimer; prompt says "awareness only, not advice"                |
| Next.js 16 API differences               | Read `node_modules/next/dist/docs/` before implementing routes                |


---

## 4. Phase 2 — Auth & Persistence (Preview)

**Goal:** Returning users keep full conversation history.


| Task               | Detail                                                            |
| ------------------ | ----------------------------------------------------------------- |
| Supabase project   | Create project; run SQL migration for `chat_sessions`, `messages` |
| Auth               | Email sign-up/login via Supabase Auth; protect `/dashboard`       |
| Guest → user nudge | After N messages, prompt to save conversation                     |
| Persist messages   | Server action or API: create session, insert messages             |
| Sidebar            | List sessions by `title`, `updated_at`; new chat button           |
| Routes             | `/chat/[sessionId]`, `/login`                                     |
| Row Level Security | Users can only read/write their own sessions                      |


**Schema (from spec):**

```sql
-- chat_sessions
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
title text not null default 'New conversation',
created_at timestamptz default now(),
updated_at timestamptz default now()

-- messages
id uuid primary key default gen_random_uuid(),
session_id uuid references chat_sessions(id) on delete cascade,
role text not null check (role in ('user', 'assistant')),
content text not null,
sections_tagged jsonb default '[]',
created_at timestamptz default now()
```

---

## 5. Phase 3 — Section Pages & Polish (Preview)


| Task                | Detail                                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| `/sections/[code]`  | Plain-language breakdown; seed from LLM or static JSON for common sections |
| Clickable badges    | Link from chat badges to section pages                                     |
| `/dashboard`        | Account settings, full history, rename/delete sessions                     |
| Search              | Full-text search across user's `messages.content`                          |
| Guided conversation | Prompt tuning for follow-up questions before final answer                  |
| Google OAuth        | Supabase provider config                                                   |
| Streaming responses | SSE or Vercel AI SDK for smoother UX                                       |


---

## 6. Phase 4 — OCR (Optional, Preview)

Only if client approves add-on scope.


| Task                    | Detail                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| Supabase Storage bucket | Private uploads per user                                         |
| Upload UI               | Image/PDF picker on chat input                                   |
| OCR                     | Tesseract.js (free) or Google Vision API (accuracy)              |
| Pipeline                | Upload → extract text → attach to LLM context → explain document |


---

## 7. Implementation Order (Phase 1 Checklist)

Use this as the day-by-day execution list for Phase 1:

```
[ ] 1. Install dependencies + shadcn/ui + base components
[ ] 2. Add .env.example and lib/openai.ts
[ ] 3. Write legal-system.ts prompt + types/chat.ts
[ ] 4. Implement POST /api/chat + parse-sections.ts
[ ] 5. Build Zustand chat-store.ts
[ ] 6. Build chat components (messages, input, bubbles)
[ ] 7. Wire /chat page end-to-end (manual test with real API key)
[ ] 8. Build landing page (/) with CTA to /chat
[ ] 9. Apply dark/neutral theme in globals.css + layout metadata
[ ] 10. Mobile pass + error states + disclaimer component
[ ] 11. README: local setup instructions for LexAI
[ ] 12. Phase 1 acceptance criteria sign-off
```

---

## 8. Definition of Done — Phase 1

Phase 1 is **complete** when:

1. All acceptance criteria in §3.4 are checked
2. A stakeholder can demo: landing → chat → legal Q&A → section badges → disclaimer
3. Code is lint-clean (`pnpm lint`)
4. No secrets committed; README explains how to run locally

**Next step after Phase 1:** Begin Phase 2 (Supabase schema + email auth + session persistence).

---

## 9. Reference


| Document                 | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| [lexAi.md](./lexAi.md)   | Full product spec, features, routes, cost estimates |
| [AGENTS.md](./AGENTS.md) | Next.js 16 agent rules for this repo                |


