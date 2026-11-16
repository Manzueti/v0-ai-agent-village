# Changelog

## [Unreleased] - 2026-11-16

### 🐛 Fixes
- **Tasks:** a task whose execution fails (e.g. no AI key) now moves to *Downtime* and shows the reason. Before, it was marked *Done*. Failed API calls no longer replace a task card with an error object. The API now rejects unknown task statuses.
- **API routes:** malformed or incomplete request bodies return `400` instead of crashing with `500`, and a missing AI provider key returns `503`. Two routes used to crash with `Cannot read properties of undefined`.
- **Analytics:** Vercel Analytics only loads on Vercel. Elsewhere it 404'd on every page.
- **3D ecosystem:** fixed a React hook dependency warning in `EcosystemCanvas`.

### 🧹 Cleanup
- Removed unused components and modules: `AgentDetailPanel`, `AgentHut`, `RedundancyView`, `HealthBar`, `GeminiChat`, `theme-provider`, `lib/failover-simulation.ts`.
- Removed leftover files: empty `Untitled-*.n8n`, the legacy `.eslintrc.json` (replaced by `eslint.config.mjs`), the unused `styles/globals.css` and the v0 placeholder images.
- `tsconfig.tsbuildinfo` is no longer tracked and is now gitignored.
- Lint warnings cut from 157 to 15 (unused imports and variables, stray `any` casts).

## [0.2.0] - 2026-05-11

### 🔒 Security
- Removed `.env` from Git tracking and updated `.gitignore` to prevent accidental credential commits.
- Replaced hardcoded Windows paths in Hermes API with environment variables (`HERMES_PATH`, `HERMES_PROJECT_DIR`).

### 🚀 AI & Infrastructure
- **Unified Model Factory:** Added `lib/ai-models.ts` to centralize provider management (Gemini, DeepSeek, GPT).
- **Multi-Model Support:** Expanded `AIModel` types to include Claude 3.5 Sonnet, GPT-4o, and Gemini 1.5 Pro.
- **Improved API Routes:** Refactored infrastructure `analyze`, `chat`, and `execute` routes to use the unified model factory.

### 🎮 Gamification
- **Enhanced XP System:** Added `lib/game/xp-system.ts` with Level 1-7 thresholds and perk unlocking logic.
- **New Agent:** Integrated "Rank Rocket" (SEO Strategist) powered by GPT-4o.
- **XP API:** Added `/api/agents/xp` endpoint to handle agent progression.

### 🛠️ Stability & DX
- **Error Boundaries:** Added `ErrorBoundary` component to prevent 3D visualization or AI stream crashes from breaking the entire UI.
- **Type Safety:** Replaced `any` types with strict interfaces in core dashboard components.
- **Bug Fix:** Fixed missing `Canvas` import in `EcosystemCanvas.tsx` that caused rendering issues.

### 📄 Documentation
- Added `DEPLOYMENT.md` for Vercel and local setup instructions.
- Added `CHANGES.md` (this file).
- Created `.env.example` with all supported provider keys.
