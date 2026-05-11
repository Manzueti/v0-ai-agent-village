# CYBEREMPIRE - Deployment Guide

## 🚀 Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

### Prerequisites
1.  **Remove/Rotate exposed API keys:** Ensure `.env` is NOT committed to your repository (already handled in v0.2.0).
2.  **Environment Variables:** Set the following in the Vercel Dashboard:

| Variable | Description | Required |
| :--- | :--- | :--- |
| `GOOGLE_API_KEY` | Your Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey) | Yes |
| `DEEPSEEK_API_KEY` | Your DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/) | Optional (for DeepSeek agents) |
| `OPENAI_API_KEY` | Your OpenAI API key | Optional (for GPT agents) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Optional (for Claude agents) |
| `HERMES_PATH` | Path to your Hermes executable | Optional |
| `HERMES_PROJECT_DIR` | Working directory for Hermes | Optional |

### Critical Notes
*   **Edge Runtime:** Most API routes (infrastructure, chat, execute) use `export const runtime = 'edge'`.
*   **Hermes API:** The Hermes route uses `child_process`, which **does not work on Vercel Edge**. If you deploy to Vercel, the Hermes chat will fail unless you move it to a Node.js serverless function or a separate microservice.
*   **3D Performance:** The post-processing effects require a modern GPU. Mobile performance may vary.

## 🛠️ Local Development

1.  Clone the repository.
2.  Run `npm install`.
3.  Copy `.env.example` to `.env` and fill in your keys.
4.  Run `npm run dev`.
