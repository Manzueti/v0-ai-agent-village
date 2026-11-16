# CYBEREMPIRE — AI Agent Village

A Next.js dashboard that presents an AI workforce as a gamified command center. It brings together agent profiles and activity, task assignment and execution, infrastructure monitoring, AI-powered chat and recommendations, and an **Automaton Colony** where agents must earn their own (simulated) compute to survive.

## Stack

- **Language:** TypeScript / TSX, CSS (Tailwind CSS 4)
- **Framework:** Next.js 16 (App Router), React 19, Node.js API routes
- **Libraries:** Vercel AI SDK (Google, OpenAI, Anthropic, DeepSeek, xAI), React Three Fiber / Three.js for 3D views, Framer Motion, Radix UI components

## Quick start

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env
npm run dev
```

Then open http://localhost:3000.

The app starts without any API keys. To enable the AI features, add at least one provider key to `.env`: `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY` or `XAI_API_KEY`. Without a key, AI endpoints return `503` with a message naming the keys to set.

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (includes type checking) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Sections

Navigate with the sidebar. Every section lives at `/?s=<name>`.

| Section | `?s=` | What it shows |
|---|---|---|
| Home | — | Landing screen |
| Business Builder | `builder` | Chat with an AI co-founder to start or grow a business. A live plan panel fills in, and milestones can be handed to village agents on the Task board |
| CyberEmpire | `cyberempire` | Main enterprise dashboard and Hermes chat |
| Tasks | `tasks` | Kanban task board: create from templates, auto-assign to the best agent, run with AI |
| Ecosystem | `village` | Agent pods, mission log, 2D virtual office and 3D visualizer |
| Infrastructure | `infrastructure` | Isometric infrastructure map, node details, AI analysis |
| AI Control | `ai-control` | Operator oversight and decision log |
| Automaton | `automaton` | Survival simulation: credits, tiers, constitution, SOUL.md, replication ([docs](docs/automaton.md)) |
| COE | `coe` | Center of Excellence for sending directives to agents |

## How it's organized

```text
app/
  page.tsx            Home screen and ?s= section router
  <section>/page.tsx  One folder per section (see table above)
  api/                AI, agent, task, infrastructure, automaton and Hermes endpoints
components/
  village/            Agent pods, ecosystem visualizations, mission log
  infrastructure/     Isometric map, node panels, decision log
  tasks/              Task board, cards, task creation
  ai/                 Hermes chat
  ui/                 Shared UI primitives (shadcn/Radix)
lib/
  ai-models.ts        Provider selection, model-ID normalization, fallback, error statuses
  data.ts             Agent roster
  infrastructure-data.ts  Infrastructure nodes, zones, health
  tasks/              Task types and agent-assignment scoring
  automaton/          Colony engine, survival tiers, constitution
  game/               XP and level progression
hooks/                Client hooks (tasks, automaton colony)
docs/                 Feature docs
```

**AI provider fallback.** Each agent has a preferred model. `lib/ai-models.ts` maps retired model IDs to current ones. If the preferred provider has no key, it falls back in this order: Google → OpenAI → Anthropic → DeepSeek → xAI.

## What's real and what's simulated

This is a demo and prototyping app, not a production operations backend.

| Feature | State |
|---|---|
| AI chat, analysis, task execution, directives | Real AI responses when a key is set |
| Tasks | Kept in server memory. Reset on restart and not shared between serverless instances |
| Business Builder chats and plans | Saved in the browser's `localStorage` |
| Automaton Colony | Simulated credits, saved in the browser's `localStorage`. No real money or wallets |
| Agent roster, infrastructure nodes, health metrics | Static sample data |
| XP endpoint, infrastructure "execute" actions | Compute or describe the result, but save and change nothing |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). On Vercel, set your provider keys as environment variables. Vercel Analytics only loads on Vercel.

## Changelog

See [CHANGES.md](CHANGES.md).
