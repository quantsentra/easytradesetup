# EasyTradeSetup

[![CI](https://github.com/quantsentra/easytradesetup/actions/workflows/test.yml/badge.svg)](https://github.com/quantsentra/easytradesetup/actions/workflows/test.yml)
[![Deploys on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://www.easytradesetup.com)

**Golden Indicator** — a single sealed TradingView Pine v5 indicator that fuses regime, structure, key levels, and volume into one decision layer.

Production: <https://www.easytradesetup.com>
Customer portal: <https://portal.easytradesetup.com>
Admin console: <https://portal.easytradesetup.com/admin>

## Stack

- Next.js 15.5 (App Router) · React 19 · TypeScript 5.7
- Tailwind 3.4 with custom brand tokens
- Supabase (Auth + Postgres) · Resend (transactional email)
- Vercel hosting · GitHub Actions CI (vitest + Playwright)

## Repo layout

```
easytradesetup/
├─ landing-page/             Next.js app — primary deliverable
│  ├─ app/                   Route groups: (marketing), (auth), portal, admin, api
│  ├─ components/            UI primitives + sections + nav + auth + analytics + seo + admin
│  ├─ lib/                   pricing.ts, launch.ts, admin.ts, auth-server.ts, supabase clients
│  ├─ supabase/migrations/   Numbered SQL — append-only, idempotent
│  ├─ tests/                 unit (vitest) + e2e (Playwright)
│  ├─ docs/                  ARCHITECTURE.md — single source for system map
│  └─ middleware.ts          Host-aware routing + Supabase session
├─ src/pine/                 Golden Indicator Pine v5 source
├─ .github/workflows/        CI workflow
└─ CLAUDE.md                 Project context for AI assistants
```

## Local dev

```bash
cd landing-page
npm install
npm run dev          # localhost:3000
npm test             # vitest unit
npm run test:e2e     # Playwright (builds + serves on :3100)
npm run build        # production build
```

## Architecture + roadmap

Single source of truth lives at [`landing-page/docs/ARCHITECTURE.md`](landing-page/docs/ARCHITECTURE.md) — diagrams (mermaid) + data model + auth flow + CI/CD + 25-item P0–P5 backlog.

Live, gated, interactive version: <https://portal.easytradesetup.com/admin/architecture>

Live MVP checklist (toggle done + notes): <https://portal.easytradesetup.com/admin/checklist>

## Hermes Agent SEO Workflow

This repo is wired for **Hermes Agent** — an external 24/7 agentic SEO and marketing assistant. Hermes does not run inside the application. It reads this repo, drafts content, and proposes changes via GitHub issues + PRs.

The loop:

1. **Hermes researches and drafts.** New content drafts land in [`/content/blog/`](content/blog/), [`/content/youtube-shorts/`](content/youtube-shorts/), [`/content/instagram/`](content/instagram/), [`/content/facebook/`](content/facebook/). Strategy and rules live in [`/docs/seo/`](docs/seo/). Hermes opens GitHub issues using the [`SEO Task`](.github/ISSUE_TEMPLATE/seo-task.yml) template.
2. **Claude Code implements.** Once a brief or task is approved, Claude Code wires the route, meta, JSON-LD, sitemap entry, and tests inside `landing-page/`. Hermes does not modify application code, payments, auth, or production secrets.
3. **Human approves.** Every PR requires a human reviewer. Pre-merge gate is the checklist in [`/docs/seo/publishing-rules.md`](docs/seo/publishing-rules.md). No auto-merge.
4. **Deployment happens only after review.** Vercel deploys on push to `main` — which only happens after the PR is merged by a human.

Operating rules and allowed-paths boundary: [`/docs/seo/hermes-agent-operating-rules.md`](docs/seo/hermes-agent-operating-rules.md).

Operator dashboard: [portal.easytradesetup.com/admin/hermes](https://portal.easytradesetup.com/admin/hermes) — see drafts, open issues, file new tasks, observe the feedback loop.

## Discipline rules

- **Frozen MVP scope.** P0 → P5 backlog in `mvp_tasks` is the only task list. New ideas go in note fields, not new rows. New rows require a migration commit, not an admin UI insert.
- **Migrations are append-only.** Each ship that completes a backlog item adds a new `00X_mvp_progress.sql` migration that flips `done=true` keyed on slug. Never edit prior migrations.
- **No fake testimonials.** Customer quotes appear only post-launch with written permission.
- **Single source of truth for prices.** `lib/pricing.ts`. Never hardcode elsewhere.
- **No secrets in repo.** Env vars live in Vercel project settings + per-machine `.claude/settings.local.json` (gitignored).

## Commit + deploy

Push to `main` triggers two parallel paths:

1. **GitHub Actions** runs unit + e2e + production build — see badge above.
2. **Vercel** auto-deploys to all three domains:
   - `easytradesetup.com` — 307 redirect to www
   - `www.easytradesetup.com` — marketing site
   - `portal.easytradesetup.com` — auth + portal + admin

## License

Source: proprietary — all rights reserved. Pine indicator is licensed personal-use only on purchase, not redistributable.
