# LexAI

AI-powered legal awareness assistant for Indian law. Phase 1: guest chat with section tagging.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

4. Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/chat](http://localhost:3000/chat) to start chatting.

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
