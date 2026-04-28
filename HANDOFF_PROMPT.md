# EasyTradeSetup — Developer Handoff Brief

> Written first-person, founder voice. Drop this into a developer's lap and they'll have full project context.

---

## Who I am, what we're building

I'm the founder of **EasyTradeSetup**. We sell **Golden Indicator** — a single sealed TradingView Pine v5 indicator that fuses regime, structure, key levels, and volume into one decision layer.

Positioning is critical: we are a **chart tool, not a signal service**. No calls. No copy-trading. No recurring fees. No fake performance claims. The customer decides every trade. This positioning shows up in copy everywhere — keep it consistent.

The bundle:
1. Golden Indicator (Pine v5, open-source, personal use)
2. TradingView Chart Gallery
3. Trade Logic PDF (~50 pages, 8 setups)
4. Risk Calculator (web)
5. Daily Market Notes (email — NIFTY, SPX, XAU, BTC)
6. Lifetime updates

Target traders: NSE F&O (intraday NIFTY / BANKNIFTY, weekly expiries), US indices (SPX/NAS100), commodities (XAU/Silver/Crude), crypto (BTC/ETH/SOL).

---

## Pricing — single source of truth

All prices live in `landing-page/lib/pricing.ts`. **Never hardcode a price anywhere else.**

| | USD | INR |
|---|---|---|
| Retail (anchor) | $149 | ₹13,999 |
| Launch price (current) | $49 | ₹4,599 |

FX anchor: `USD_TO_INR = 93.17` (captured 2026-04-21).

**Decision: pricing model is permanent, not a launch window.** I removed all "inaugural" / countdown / scarcity framing. The framing is now `OFFER_LABEL = "Launch price"` and `OFFER_TAGLINE = "67% off retail. Always."` Less revenue per sale, but stable forever — no expiry rituals, no honesty issues.

`landing-page/lib/launch.ts` has been stubbed: `LAUNCH_END_DATE = "9999-12-31"` so existing importers keep working without rendering countdowns.

Unit tests in `tests/unit/pricing.test.ts` enforce ±20% FX drift. Run `npm test` before any pricing edit.

---

## Stack

- **Framework:** Next.js 15.5 (App Router) + React 19 + TypeScript 5.7
- **Styling:** Tailwind 3.4, custom tokens in `landing-page/tailwind.config.ts`, global CSS in `landing-page/app/globals.css`
- **Auth & DB:** Supabase (Auth + RLS + service-role admin client)
- **Email:** Resend transactional (DKIM/SPF verified on Cloudflare DNS)
- **Payments:** Stripe Checkout Sessions — accepts both USD and INR (cross-border charging). Razorpay/UPI is a *future* India-native upgrade, not in scope yet.
- **Analytics:** @vercel/analytics
- **Hosting:** Vercel — auto-deploy from `main` on push. `vercel.json` runs `npm test && next build` so a failed test gates the deploy.

All app code lives in `landing-page/`. Repo root holds the Pine script (`pine-scripts/`), research notes, and CLAUDE handoff docs.

---

## Architecture decisions worth knowing

### Geo-aware currency (India sees INR, others see USD)

Implemented via cookie + Vercel edge headers. No client-side JS race.

- `lib/currency.ts` — `resolveCurrency({query, cookie, ipCountry})` precedence: query → cookie → IN geo → USD default
- Cookie name: `ets_ccy=inr|usd`, domain `.easytradesetup.com`, max-age 1 year
- `middleware.ts` reads `x-vercel-ip-country`, writes the cookie if missing, sticky on `?ccy=` override
- `<Price>` is a **server component** (`components/ui/Price.tsx`) reading the cookie via `next/headers` — SSR HTML is correct on first paint, no flash, no SEO mismatch
- `<PriceClient>` (`components/ui/PriceClient.tsx`) is the client variant for sticky bar / offer banner — uses variant-aware placeholder so SSR shape matches even when invisible
- `<CurrencySwitcher>` in TopNav lets the user override

**Critical bug we already fixed:** previous Price implementation rendered `OFFER` placeholder regardless of variant, so `<Price retail/>` and `<Price amount/>` both output the same number in SSR. Don't regress that.

### Strict CSP with per-request nonce

`middleware.ts` builds a CSP per request:
- `crypto.randomUUID().replace(/-/g, "")` for the nonce
- `'strict-dynamic'` + nonce, no `'unsafe-inline'`, no `'unsafe-eval'`
- Sets `x-nonce` request header for server components to read
- Inline scripts (only one — JsonLd) read the nonce via `next/headers` in an async server component

Don't add inline `<script>` or inline event handlers. If you need an inline script, follow the JsonLd pattern: async server component that reads `headers().get("x-nonce")`.

### Soft-delete pattern for entitlements

`/admin` revoke flow defaults to soft-delete:
- `revoked_at`, `revoked_by`, `revoke_reason` columns on `entitlements`
- `?hard=1` or `{ hard: true }` body param for permanent delete
- Restore endpoint at `/api/admin/entitlement-restore` clears the revoke fields
- Two-click confirm in the UI with 5-sec auto-disarm

Migration: `supabase/migrations/021_soft_delete.sql`.

### Admin tables — generic & dynamic

`components/admin/DataTable.tsx` is a generic `DataTable<T>` with:
- Search (free-text across configured columns)
- Sort (click headers, ARIA `aria-sort`)
- Filter chips (configurable per table)
- Pagination
- CSV export
- Mobile card-list fallback under 640px

All admin tables (CustomerTable, RawEntitlementsTable, StripeSessionsTable, StripePaymentsTable, AuditTable) wrap this. **When you add a new admin list, use DataTable — don't roll your own.**

### Skeleton loaders site-wide

Every route has a `loading.tsx` matching its layout:
- `app/admin/loading.tsx`, `app/admin/customers/loading.tsx`, `app/admin/qa/loading.tsx`, etc.
- `app/portal/loading.tsx`
- `app/(marketing)/loading.tsx`

Skeleton primitives in `components/ui/Skeleton.tsx` (`Skeleton`, `SkeletonText`, `SkeletonRect`, `SkeletonKpi`, `SkeletonTable`, `SkeletonCard`). CSS shimmer via `.ets-skel`.

---

## Design system (dark)

Palette:
- Navy `#05070F` (bg)
- Panel `#0E1530`
- Electric blue `#2B7BFF`
- Cyan `#22D3EE`
- Brand gold `#F0C05A`
- Violet `#8B5CF6`
- Up/down semantic: `#2DBE6D` / `#FF4D4F`

Components & utilities:
- Backdrop: aurora + starfield (fixed, CSS-only)
- Cards: `glass-card`, `glass-card-soft`, `glass-flat` — backdrop-blur + gradient border
- Accents: `grad-text` (blue → cyan → gold, signature), `grad-text-2` (inverted), `grad-border`
- Buttons: `btn`, `btn-primary`, `btn-outline`, `btn-ghost`, `btn-lg`
- Eyebrow: `eye` + `eye-dot`
- Layering: fixed backdrop sits below; sections use `above-bg` helper for proper z-index

Motion: all animations behind `motion-safe:`. Global `prefers-reduced-motion` override respected.

**Hard rules:**
- Do **not** introduce `bg-white` or `text-gray-*` Tailwind colors
- Use semantic tokens: `bg-page`, `bg-panel`, `text-ink`, `text-ink-60`, `text-ink-40`, `border-rule`
- Back-compat aliases for the old light theme exist in `tailwind.config.ts` — treat them as deprecated

---

## Sitemap

14 public routes, priority-tuned in `app/sitemap.ts`.

| Tier | Path |
|---|---|
| Core (1.0–0.9) | `/`, `/product`, `/pricing`, `/checkout` |
| Proof (0.8) | `/compare`, `/sample` |
| Supporting (0.7) | `/docs/faq` |
| Docs (0.6) | `/docs/install` |
| Legal (0.3–0.5) | `/legal/disclaimer`, `/legal/privacy`, `/legal/terms`, `/legal/refund` |
| Ancillary | `/about`, `/contact`, `/thank-you` |

Home composition (`app/(marketing)/page.tsx`), 7 sections only:

```
Hero → CleanVsNoisy → Bundle → MultiMarket → FAQTeaser → PricingTeaser → FinalCTA
```

Global chrome: `OfferBanner` (dismissible), `TopNav`, `Footer`, `StickyBuyBar`, `ExitIntent` modal.

Rename done: TopNav menu uses **"Free sample"** (not "Library").

---

## SEO

- JSON-LD: Organization + WebSite + Product + SoftwareApplication + FAQPage + Breadcrumb via `components/seo/JsonLd.tsx`
- FAQ list exported as `homeFaqs` from `components/sections/FAQTeaser.tsx` so JSON-LD and visible UI never drift
- hreflang: `en-IN`, `en-US`, `x-default` all → `/` (currency switches via cookie, not URL)
- robots.txt: blocks 17 AI scrapers (GPTBot, ClaudeBot, PerplexityBot, Bytespider, etc.) — keep Google/Bing unblocked
- OG image: `app/opengraph-image.tsx` — uses ASCII only (no `✓`, no `₹`) because `@vercel/og` runtime dynamic-font fetches intermittently 400. Use "ETS" letter mark, "INR" prefix.
- Meta description: ~155 chars max (Google truncates past ~160)
- Title: ~55 chars max (template appends `· EasyTradeSetup`)

---

## Content & messaging discipline

These are non-negotiable:

- **No fake testimonials.** Customer quotes only post-launch with written permission and verifiable purchase. `Principles.tsx` explicitly promises this.
- **No SEBI-registered research language.** We are not a registered research analyst. Indian users see the SEBI disclaimer on checkout.
- **"Educational, not investment advice"** callout on every page that shows hypothetical trade outcomes (case studies, sample, checkout).
- **Claims must be verifiable from code or public listing.** Compare page gets a monthly review date in the footnote.
- **India-first but global.** Hindi tagline in TrustStrip, NSE-specific examples, INR equal-citizen status with USD.

---

## Testing — non-negotiable

Two-layer suite. **Run before every commit that touches `lib/`, `api/`, or home-page copy.**

| Command | Runs |
|---|---|
| `npm test` | Vitest unit (node env) — ~1s |
| `npm run test:watch` | Vitest watch |
| `npm run test:coverage` | Unit coverage (v8, `lib/` + `app/api/`) |
| `npm run test:e2e` | Playwright chromium — builds + starts prod server on :3100 |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:all` | Unit + e2e chained |

Unit tests: `landing-page/tests/unit/*.test.ts`.
E2E: `landing-page/tests/e2e/*.spec.ts`.

**Rules:**
- If you edit marketing copy on the home page, **update `tests/e2e/home.spec.ts` in the same commit**. The e2e suite asserts on specific strings (headline, 3-lane titles, FAQ objection handlers, FinalCTA sub-line).
- If you touch `lib/pricing.ts` or `lib/launch.ts`, run `npm test` before committing.
- `vercel.json` build command runs `npm test && next build`, so a failing test gates production deploy.

---

## Admin surfaces (`/admin/*`)

Gated to admin users only. Lives at `portal.easytradesetup.com` (separate host from marketing `www.easytradesetup.com`).

- `/admin` — dashboard, KPI cards
- `/admin/customers` — DataTable of joined auth.users + entitlements
- `/admin/raw-entitlements` — DataTable of every entitlement row (catches orphans where auth user is gone)
- `/admin/stripe-sessions` — DataTable of Stripe checkout sessions
- `/admin/stripe-payments` — DataTable of Stripe payments
- `/admin/audit` — DataTable of audit log
- `/admin/qa` — Run the QA suite, list past runs
- `/admin/qa/[id]` — Drill into a run with sticky filter chips (All / Red flags / Warnings / Passed)
- `/admin/readiness` — Launch readiness checklist with auto-detect + manual ack
- `/admin/stripe-recover` — Stripe payment recovery (orphan payments → entitlement rebuild)
- `/admin/errors` — error log

QA suite: `lib/qa-suite.ts` runs 50+ checks across Build / Env / Security / Functional / SEO / Database / Pricing / UX. Probes the production marketing host (`https://www.easytradesetup.com`), not the admin host (which would 307 to sign-in). Stored in `qa_runs` table (migration `020_qa_runs.sql`).

Launch readiness: `lib/launch-readiness.ts` defines 9 blockers + 8 warnings, each with `auto: () => Promise<AutoStatus>` for auto-detection or manual ack via `launch_readiness_acks` table (migration `022_launch_readiness.sql`).

---

## Git & deploy

- Default branch: `main`. Vercel deploys on push.
- **Never commit secrets.** `.claude/settings.local.json` is gitignored — it holds per-machine tokens. GitHub push-protection is on.
- **Never commit** `.next/`, `node_modules/`, `coverage/`, `playwright-report/`, `test-results/`.
- **Always `npm run build` successfully before pushing** (Vercel fails the deploy otherwise).
- Commit style: short verb-led title, body explains *why* when non-obvious.
- Secrets live only in `.claude/settings.local.json` (local) or Vercel env (prod). Not in code, not in env files in git.

---

## What's done, what's pending

### Done
- Marketing site redesign (dark, glass cards, aurora backdrop)
- Sitemap (14 routes), JSON-LD schema, robots.txt with AI scraper blocks
- Geo-aware INR/USD pricing (cookie-based, server-rendered)
- Stripe Checkout (USD + INR cross-border)
- Supabase auth + RLS + admin client
- Resend transactional email + DKIM/SPF verified
- Strict CSP with per-request nonce (no `unsafe-inline`)
- Skeleton loaders on every route
- Admin dashboard with generic dynamic DataTable
- QA suite (50+ automated checks, stored in DB)
- Soft-delete + restore for entitlements
- Launch readiness checklist with auto-detect
- Test suite (Vitest unit + Playwright e2e) gating Vercel deploy
- Permanent "67% off retail, always" pricing framing

### Pending (manual/external — owner action required)
- **Founder identity** — currently placeholder "TS". Need real name + photo + LinkedIn before launch.
- **Live customer testimonials** — hold until post-launch, written permission only.
- **Hindi full-site translation** — out of scope until revenue justifies.
- **Razorpay / UPI for India** — Stripe INR works as bridge; UPI is a future native upgrade.
- **Admin 2FA enrollment** — manual user action.
- **Staging environment / preview gate** — manual user action.
- **Stripe INR live charge tested end-to-end** — manual.
- **Backup restore drill** — manual.
- **Sentry alert routes** — manual user config.
- **Run pending Supabase migrations**: 020 (qa_runs), 021 (soft_delete), 022 (launch_readiness) in SQL editor.

---

## When in doubt — read this order

1. `CLAUDE.md` (project root) — single source of truth, terse.
2. `landing-page/lib/pricing.ts` and `landing-page/lib/launch.ts` before touching any price or date.
3. Run `npm test` + `npm run test:e2e` locally before pushing anything that touches the home page.
4. When adding a new public page, add it to `app/sitemap.ts` and a smoke row in `tests/e2e/pages.spec.ts`.
5. When adding a new home section, register in `app/(marketing)/page.tsx` and add at least one assertion in `tests/e2e/home.spec.ts`.
6. When adding a new admin list, wrap `DataTable<T>` from `components/admin/DataTable.tsx`.

---

## Contact & ownership

- Founder: Thomas Selvanathan (`thomas.selvanathan@aldahra.com`)
- Repo: `c:/DO_NOT_Backup/easytradesetup`
- Production: `https://www.easytradesetup.com`
- Admin: `https://portal.easytradesetup.com`
- Security contact: `security@easytradesetup.com` (also in `public/.well-known/security.txt`)
