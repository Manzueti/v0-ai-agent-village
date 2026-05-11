# Changelog

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
