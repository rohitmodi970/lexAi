# LexAI — AI-Powered Legal Assistant Web Application
### Project Proposal & Technical Specification
**Prepared by:** Rohit modi
**Date:** June 2025
**Version:** 1.0

---

## 1. Project Overview

**LexAI** is a conversational AI web application built exclusively around law. The idea is simple — most people facing a legal situation have no idea where to start. They're scared, confused, and don't know which law even applies to them. LexAI gives them a safe, friendly space to ask anything — from basic questions to serious concerns — and get clear, human answers with the relevant legal sections explained in plain language.

Think of it as a knowledgeable friend who happens to know the law, available 24/7.

---

## 2. The Problem I'm Solving

People don't avoid legal help because they don't care — they avoid it because it feels intimidating and expensive. The gap I want to fill:

- Most people don't know which law applies to their situation
- Legal websites are either too technical or too generic
- There's no platform that feels conversational and safe for sensitive topics like harassment, domestic issues, or workplace disputes

LexAI solves this by combining the accessibility of a chat interface with the depth of AI legal reasoning — focused entirely on law, nothing else.

---

## 3. Who This Is Built For

| User | Situation |
|---|---|
| Common citizen | "My landlord changed the locks without notice, what are my rights?" |
| Student | "What is the actual difference between IPC 302 and 304?" |
| Small business owner | "Can my employee take legal action for this?" |
| Harassment victim | "Someone is threatening me online — which section applies?" |

---

## 4. Core Features

### 4.1 AI Legal Chat
The heart of the product. A clean, focused chat interface where users can ask any law-related question in plain everyday language. The AI responds conversationally — not like a legal textbook — and always identifies the applicable law sections inline.

- Strictly law-focused — no off-topic responses
- Casual, empathetic tone that doesn't make people feel judged
- Handles sensitive topics (domestic violence, fraud, harassment) carefully
- Every response includes a soft disclaimer about seeking professional advice

### 4.2 Legal Section Tagging
Every AI response automatically surfaces the relevant legal sections so users know exactly what covers their situation:

```
Based on what you've described, this may fall under:
📌 IPC Section 420 — Cheating
📌 IPC Section 406 — Criminal Breach of Trust
```

Each tag is clickable and opens a plain-language breakdown of that section — no legal jargon.

### 4.3 Persistent Chat History
Users create an account and all their conversations are saved — just like ChatGPT. They can:

- Pick up any previous conversation right where they left off
- Organize chats by topic (e.g., "Rent Dispute", "Workplace Issue")
- Search across their history to find past answers

### 4.4 Guided Conversation
The AI doesn't just answer — it asks smart follow-up questions to fully understand the user's situation before responding. This leads to more accurate, relevant answers rather than generic information.

### 4.5 OCR Document Upload *(Optional Add-on)*
If the client wants this feature, users can upload legal documents — FIRs, notices, agreements — as images or PDFs. The system extracts the text via OCR and the AI then explains the document in simple language, highlighting key clauses and deadlines.

---

## 5. Design Direction

The interface will be clean and minimal — a focused chat experience that feels familiar and trustworthy. Key design decisions:

- Neutral/dark color palette suited to a professional legal context
- Clear visual separation between user messages and AI responses
- Legal section tags displayed as styled badges inline with responses
- Left sidebar for navigating chat history
- Fully mobile responsive

---

## 6. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | **Next.js 14+** (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Auth UI | Supabase Auth |

### Backend & Database
| Layer | Technology |
|---|---|
| Backend | Next.js API Routes + Server Actions |
| Database | **Supabase (PostgreSQL)** |
| Authentication | Supabase Auth (email + Google OAuth) |
| File Storage | Supabase Storage *(for OCR uploads)* |
| Realtime | Supabase Realtime *(typing indicators)* |

**Database Structure:**
- `users` — managed by Supabase Auth
- `chat_sessions` — id, user_id, title, created_at
- `messages` — id, session_id, role, content, sections_tagged[], created_at

### AI / LLM
| Option | Model | Purpose |
|---|---|---|
| Primary | **OpenAI GPT-4o** | Nuanced legal reasoning |
| Alternative | **Claude (Anthropic)** | Sensitive topics, strong reasoning |
| Fallback | GPT-3.5-turbo | Cost-efficient simple queries |

The AI will be configured via a system prompt to stay strictly within legal topics, always cite applicable sections, maintain an empathetic tone, and recommend consulting a professional for serious matters.

### OCR *(Optional)*
| Layer | Technology |
|---|---|
| Engine | Tesseract.js or Google Vision API |
| Upload | Supabase Storage + Next.js API Route |
| Flow | Extract text → send to LLM with document context |

---

## 7. System Architecture

```
┌─────────────────────────────────────────┐
│             Next.js Frontend            │
│   (Chat UI, Auth, History Sidebar)      │
└────────────────┬────────────────────────┘
                 │ API Routes / Server Actions
┌────────────────▼────────────────────────┐
│            Next.js Backend              │
│   (LLM Prompt Builder, OCR Handler)     │
└──────┬──────────────────────┬───────────┘
       │                      │
┌──────▼──────┐        ┌──────▼──────────┐
│  Supabase   │        │   LLM API       │
│  (DB + Auth │        │  (OpenAI /      │
│   + Storage)│        │   Anthropic)    │
└─────────────┘        └─────────────────┘
```

---

## 8. Key User Flows

### New User — First Question
1. Lands on homepage, sees a chat interface ready to go (no login needed to start)
2. Asks: *"My boss hasn't paid me for 3 months, what can I do?"*
3. AI responds with a clear explanation + tags Payment of Wages Act, IPC 406
4. Nudge appears: *"Want to save this conversation? It's free."*

### Returning User — Continuing a Chat
1. Logs in, sees their previous sessions in the sidebar
2. Opens "Salary Dispute" chat
3. Continues the conversation with full context intact

### Document Analysis — OCR Flow *(if enabled)*
1. User uploads a legal notice as a photo
2. OCR extracts the text automatically
3. AI explains what the notice means, flags important dates and sections

---

## 9. Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page with product intro and live chat preview |
| `/chat` | Main chat (guest mode — limited history) |
| `/chat/[sessionId]` | A specific saved chat session |
| `/login` | Sign up / login page |
| `/dashboard` | User's full chat history and account settings |
| `/sections/[code]` | Plain-language page for any legal section |

---

## 10. Infrastructure Cost Estimate

| Service | Plan | Estimated Cost |
|---|---|---|
| Vercel (Hosting) | Pro | ~$20/month |
| Supabase | Pro | ~$25/month |
| OpenAI API | GPT-4o usage | ~$50–200/month |
| Domain | — | ~$15/year |
| **Total** | | **~$100–250/month** |

> All costs scale with user volume. OCR via Google Vision API adds approximately $1.50 per 1,000 pages if that feature is enabled.

---

## 11. Product Disclaimer (Built In)

Every AI response will carry this footer:

> ⚠️ *This is for legal awareness only and does not constitute legal advice. For serious matters, please consult a licensed advocate.*

The platform will not provide case-specific legal strategy, represent users legally, or retain uploaded documents beyond the active session unless explicitly saved by the user.

---


*All cost estimates are approximate and subject to change based on final scope and usage.*