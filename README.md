# Mizumi Next.js Starter

> A minimal streaming chat app built with Next.js (App Router) + TypeScript, powered by [Mizumi](https://mizumi.co) — one OpenAI-compatible API for OpenAI & Gemini models.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mizumico/mizumi-nextjs-starter/pulls)

<!-- Add your screenshot here -->
<!-- ![Screenshot](docs/screenshot.png) -->

## What you get

- Single-page chat UI (no UI framework — just React + CSS)
- Server-side route handler calling Mizumi via the official `openai` SDK
- Token-by-token streaming to the browser
- Model picker: `gpt-5.6-sol` (flagship), `gpt-5.6-luna` (budget), `gemini-3.6-flash` (Google, fast)

## Get started in 3 minutes

1. **Install**

   ```bash
   npm install
   ```

2. **Add your API key**

   ```bash
   cp .env.example .env.local
   # then edit .env.local and paste your key
   ```

   Get a key at [mizumi.co](https://mizumi.co) — new users get **$3 free trial credit**.

3. **Run**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 and start chatting.

## How it works

- `app/page.tsx` — client component: chat state, model picker, stream reader.
- `app/api/chat/route.ts` — server route: creates an OpenAI client with
  `baseURL: "https://api.mizumi.co/v1"` and your `MIZUMI_API_KEY`, then pipes the
  streaming completion back as plain text.
- Nothing Mizumi-specific beyond the `baseURL` — any OpenAI SDK code works as-is.

## Models

Full model list and pricing: **[mizumi.co](https://mizumi.co)** · API docs: **[mizumi.co/docs](https://mizumi.co/docs)**

## License

MIT — see [LICENSE](LICENSE).

---

Built with Mizumi — official OpenAI & Gemini models via one OpenAI-compatible API. $3 free trial credit at https://mizumi.co
