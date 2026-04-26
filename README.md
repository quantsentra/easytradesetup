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
