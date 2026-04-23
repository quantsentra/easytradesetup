# EasyTradeSetup — project context for Claude

Single source of truth Claude reads at session start. Keep it tight. When decisions change, update here first.

---

## Product

**EasyTradeSetup** sells **Golden Indicator** — a single sealed TradingView Pine v5 indicator that fuses regime, structure, key levels, and volume into one decision layer.

Positioning: chart tool, not a signal service. No calls, no copy-trading, no recurring fees, no fake performance claims. The customer decides every trade.

Bundle includes:
1. Golden Indicator (Pine v5, open-source, personal use)
2. TradingView Chart Gallery
3. Trade Logic PDF (~50 pages, 8 setups)
4. Risk Calculator (web)
5. Daily Market Notes (email — NIFTY, SPX, XAU, BTC)
6. Lifetime updates

Target traders: NSE F&O (intraday NIFTY / BANKNIFTY, weekly expiries), US indices, commodities, crypto.

---

## Pricing

Single source of truth: `landing-page/lib/pricing.ts`.

| | USD | INR |
|---|---|---|
| Retail | $149 | ₹13,999 |
| Inaugural offer | $49 | ₹4,599 |

FX anchor: `USD_TO_INR = 93.17` (captured 2026-04-21).

**Never hardcode a price elsewhere.** Always import from `@/lib/pricing`. Update INR amounts in lockstep with USD × FX (unit test `tests/unit/pricing.test.ts` enforces ±20%).

Launch window source: `landing-page/lib/launch.ts` — `LAUNCH_END_DATE`, `RESERVATION_CAP` (500). Surface wires through `<ReservationNotice />` and `<LaunchCountdown />`.

---

## Stack

- **Framework:** Next.js 15.5 (App Router) + React 19 + TypeScript 5.7
- **Styling:** Tailwind 3.4, custom tokens in `landing-page/tailwind.config.ts`, global CSS in `landing-page/app/globals.css`
- **Analytics:** @vercel/analytics
- **Hosting:** Vercel, auto-deploy from `main` on push
- **Payments (planned):** Razorpay (INR), Stripe (USD) — not live yet
- **Email capture:** `app/api/lead/route.ts` — logs to console today, TODO wire to Resend + Sheet

All code lives in `landing-page/`. The root of the repo is reserved for the Pine script (`src/pine/`), research notes, and CLAUDE memory.

---

## Design system (dark)

Palette: navy `#05070F` (bg), panel `#0E1530`, electric blue `#2B7BFF`, cyan `#22D3EE`, brand gold `#F0C05A`, violet `#8B5CF6`. Up/down semantic: `#2DBE6D` / `#FF4D4F`.

Backdrop: aurora + starfield (fixed, CSS-only).
Cards: `glass-card` / `glass-card-soft` / `glass-flat` — backdrop-blur with gradient borders.
Accents: `grad-text` (blue → cyan → gold, the brand-signature), `grad-text-2` (inverted), `grad-border`.
Buttons: `btn`, `btn-primary`, `btn-outline`, `btn-ghost`, `btn-lg`.
Eyebrow: `eye` + `eye-dot`.
Layering: fixed backdrop sits below; content sections use `above-bg` helper for proper z-index.

Motion: all animations behind `motion-safe:`. Global `prefers-reduced-motion` override respected.

**Do not introduce `bg-white` or `text-gray-*` Tailwind colors.** Use the semantic tokens (`bg-page`, `bg-panel`, `text-ink`, `text-ink-60`, `text-ink-40`, `border-rule`, etc.). Back-compat aliases for the old light theme exist in `tailwind.config.ts` — treat them as deprecated.

---

## Content & messaging discipline

- **No fake testimonials.** Customer quotes appear only post-launch with written permission and verifiable purchase records. `Principles.tsx` explicitly promises this.
- **No SEBI-registered research language.** We are not a registered research analyst. Indian users see the SEBI disclaimer on checkout.
- **"Educational, not investment advice"** callout must be on every page that shows hypothetical trade outcomes (case studies, sample, checkout).
- **Claims must be verifiable from code or public listing.** Compare page gets a monthly review date in the footnote.
- **India-first but global.** Keep Hindi tagline in TrustStrip, maintain NSE-specific examples, keep INR equal-citizen status with USD (geo-aware `<Price />` component in `components/ui/Price.tsx`).

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

Home composition (`app/page.tsx`), 7 sections only:

```
Hero → CleanVsNoisy → WhoFor → Bundle → PricingTeaser → FAQTeaser → FinalCTA
```

Global chrome: `OfferBanner` (dismissible, countdown-aware), `TopNav`, `Footer`, `StickyBuyBar`, `ExitIntent` modal.

SEO: JSON-LD Organization + WebSite + Product + FAQPage + Breadcrumb via `components/seo/JsonLd.tsx`.

---

## Testing

Two-layer suite. Run before every commit that touches `lib/`, `api/`, or home-page copy.

| Command | Runs |
|---|---|
| `npm test` | Vitest unit (node env) — 21 tests, <1s |
| `npm run test:watch` | Vitest watch |
| `npm run test:coverage` | Unit coverage (v8, `lib/` + `app/api/`) |
| `npm run test:e2e` | Playwright chromium — 38 tests, builds + starts prod server on :3100 |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:all` | Unit + e2e chained |

Unit tests: `landing-page/tests/unit/*.test.ts`.
E2E: `landing-page/tests/e2e/*.spec.ts`.

**If you edit marketing copy on the home page, update `tests/e2e/home.spec.ts` in the same commit.** The e2e suite asserts on specific strings (headline, reservation notice, 3-lane titles, FAQ objection handlers, FinalCTA sub-line).

**If you touch `lib/pricing.ts` or `lib/launch.ts`, run `npm test` before committing.** Unit tests catch FX drift, format changes, and launch-date regressions.

---

## Git & deploy workflow

- Default branch: `main`. Vercel deploys on push.
- **Never commit secrets.** `.claude/settings.local.json` is gitignored — it holds per-machine tokens. GitHub push-protection is on.
- **Never commit `.next/`, `node_modules/`, `coverage/`, `playwright-report/`, `test-results/`** — all ignored.
- Always `npm run build` successfully before pushing (Vercel fails the deploy otherwise).
- Commit style: short verb-led title, body explains *why* when non-obvious. Co-author Claude.

Safety tags:
- Secrets live only in `.claude/settings.local.json` (local) or Vercel env (prod). Not in code, not in env files checked into git.

---

## Known gaps / non-goals

- **Founder identity is placeholder "TS".** Real name + photo + LinkedIn pending — owner will fill. Do not fabricate.
- **No live customer testimonials yet.** Placeholder footnote in `Principles.tsx`. Do not invent.
- **No Hindi full-site translation.** Only the TrustStrip tagline line. A full localization pass is explicitly out of scope until revenue justifies it.
- **Payments not live.** Checkout captures reservations (email → `/api/lead`), not money. Do not wire Razorpay / Stripe credentials without explicit go-ahead.
- **No A/B framework.** Changes to home copy are manual. If we add GrowthBook or similar, document the wiring here.

---

## When in doubt

1. Read this file first.
2. Read `landing-page/lib/pricing.ts` and `landing-page/lib/launch.ts` before touching any price or date.
3. Run `npm test` + `npm run test:e2e` locally before pushing anything that touches the home page.
4. When adding a new public page, add it to `app/sitemap.ts` and a smoke row in `tests/e2e/pages.spec.ts`.
5. When adding a new section to the home page, register it in `app/page.tsx` and add at least one assertion in `tests/e2e/home.spec.ts`.
