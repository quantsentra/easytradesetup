# Master Build Prompt — EasyTradeSetup clone

> Copy-paste this entire file into a fresh Claude (or any senior dev) and they have full spec to rebuild the same product end-to-end. Replace brand name + domain + colors if you want a different niche.

---

You are a senior full-stack engineer + product designer + growth strategist. Build me a production-ready single-product e-commerce site end-to-end. Below is the complete spec. Ship it.

## 1. Product

**Brand:** EasyTradeSetup (`easytradesetup.com`)
**One product only:** "Golden Indicator" — a sealed TradingView Pine Script v5 indicator that fuses market structure (BOS / CHoCH), regime bias, key levels (PDH / PDL / PWH / PWL), and supply-demand zones into one chart.

Bundle:
1. Pine v5 indicator (closed-source, personal use license)
2. TradingView Chart Gallery (PDF/web)
3. Trade Logic PDF (~50 pages, 8 setups)
4. Risk Calculator (web tool)
5. Daily Market Notes via email (NIFTY, SPX, XAU, BTC)
6. Lifetime updates

**Positioning (non-negotiable):** chart tool, not signal service. No buy/sell calls. No copy-trading. No recurring fees. No fake performance claims. Customer decides every trade.

**Audience:** retail F&O traders — primary: India NSE (NIFTY / BANKNIFTY weekly expiries); secondary: US indices, gold, silver, crude, BTC/ETH/SOL.

## 2. Pricing — single source of truth

Single file `lib/pricing.ts`. Never hardcode prices anywhere else.

| Tier | USD | INR |
|---|---|---|
| Retail (anchor, struck-through) | $149 | ₹13,999 |
| Launch price (sale price) | $49 | ₹4,599 |

FX anchor: `USD_TO_INR = 93.17`. Unit test enforces ±20% drift.

**Decision: this discount is permanent.** Framing: `OFFER_LABEL = "Launch price"`, `OFFER_TAGLINE = "67% off retail. Always."` No countdowns. No "ends in X days" urgency. Stable price forever — fewer revenue spikes, zero honesty issues, no expiry rituals.

`lib/launch.ts` may exist as stub (`LAUNCH_END_DATE = "9999-12-31"`) so legacy importers don't break.

## 3. Stack

- **Framework:** Next.js 15.5 App Router + React 19 + TypeScript 5.7
- **Styling:** Tailwind 3.4, custom semantic tokens, global CSS for utilities
- **Auth & DB:** Supabase (Auth + RLS + service-role admin client)
- **Email:** Resend transactional + DKIM/SPF on Cloudflare DNS
- **Payments:** Stripe Checkout Sessions — accept both USD and INR (cross-border charging works for India). Razorpay/UPI is future native upgrade, not MVP.
- **Hosting:** Vercel auto-deploy on `main` push. `vercel.json` runs `npm test && next build` so failed test gates production.
- **Analytics:** `@vercel/analytics`
- **Tests:** Vitest (unit, ~1s) + Playwright Chromium (e2e on prod build at port 3100)

## 4. Repo layout

```
/
├── CLAUDE.md                 # terse project SSOT, read first every session
├── pine-scripts/             # Pine v5 source (private, sealed)
├── public/
│   ├── .well-known/security.txt
│   └── og/                   # static OG fallbacks
└── landing-page/             # all app code
    ├── app/
    │   ├── (marketing)/      # public-facing routes
    │   │   ├── page.tsx      # home — composes 7 sections
    │   │   ├── product/
    │   │   ├── pricing/
    │   │   ├── checkout/
    │   │   ├── compare/
    │   │   ├── sample/
    │   │   ├── about/
    │   │   ├── contact/
    │   │   ├── thank-you/
    │   │   ├── docs/{faq,install}/
    │   │   ├── legal/{disclaimer,privacy,terms,refund}/
    │   │   └── loading.tsx
    │   ├── admin/            # gated, lives on portal subdomain
    │   │   ├── customers/
    │   │   ├── raw-entitlements/
    │   │   ├── stripe-sessions/
    │   │   ├── stripe-payments/
    │   │   ├── stripe-recover/
    │   │   ├── audit/
    │   │   ├── errors/
    │   │   ├── qa/
    │   │   ├── qa/[id]/
    │   │   ├── readiness/
    │   │   └── loading.tsx
    │   ├── portal/           # customer post-purchase area
    │   ├── auth/             # sign-in / sign-up
    │   ├── api/
    │   │   ├── lead/
    │   │   ├── stripe/checkout/
    │   │   ├── stripe/webhook/
    │   │   ├── admin/qa-run/
    │   │   ├── admin/entitlement-revoke/
    │   │   ├── admin/entitlement-restore/
    │   │   └── admin/readiness/toggle/
    │   ├── opengraph-image.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    │   ├── sections/         # Hero, CleanVsNoisy, Bundle, MultiMarket, FAQTeaser, PricingTeaser, FinalCTA
    │   ├── ui/               # Price, PriceClient, CurrencySwitcher, Skeleton, etc.
    │   ├── admin/            # DataTable<T>, *Table.tsx, RevokeEntitlementButton, ReadinessAckButton
    │   └── seo/              # JsonLd.tsx
    ├── lib/
    │   ├── pricing.ts        # USD_SET, INR_SET, format, USD_TO_INR
    │   ├── launch.ts         # stubbed, kept for back-compat
    │   ├── currency.ts       # resolveCurrency, CURRENCY_COOKIE
    │   ├── qa-suite.ts       # 50+ automated checks
    │   └── launch-readiness.ts
    ├── middleware.ts         # CSP nonce + currency cookie
    ├── tailwind.config.ts
    ├── next.config.mjs
    ├── vercel.json
    ├── supabase/migrations/
    │   ├── 001_init.sql
    │   ├── ...
    │   ├── 020_qa_runs.sql
    │   ├── 021_soft_delete.sql
    │   └── 022_launch_readiness.sql
    └── tests/
        ├── unit/             # vitest, lib/ + api/
        └── e2e/              # playwright, home + smoke + pages
```

## 5. Sitemap (14 routes)

```
Tier 1 (1.0 / 0.9):  /  /product  /pricing  /checkout
Tier 2 (0.8):        /compare  /sample
Tier 3 (0.7):        /docs/faq
Tier 4 (0.6):        /docs/install
Tier 5 (0.3-0.5):    /legal/disclaimer  /legal/privacy  /legal/terms  /legal/refund
Ancillary:           /about  /contact  /thank-you
```

Home composition (`app/(marketing)/page.tsx`), 7 sections in this order:

```
Hero → CleanVsNoisy → Bundle → MultiMarket → FAQTeaser → PricingTeaser → FinalCTA
```

Global chrome: `OfferBanner` (dismissible) → `TopNav` → page → `StickyBuyBar` → `ExitIntent` modal → `Footer`.

TopNav menu: Product · Compare · **Free sample** · Pricing · FAQ · Contact. (Use "Free sample" not "Library".)

## 6. Design system (dark, premium, glass)

Palette:
- Navy `#05070F` (page bg)
- Panel `#0E1530`
- Electric blue `#2B7BFF`
- Cyan `#22D3EE`
- Brand gold `#F0C05A`
- Violet `#8B5CF6`
- Up green `#2DBE6D`, down red `#FF4D4F`

Components:
- Backdrop: aurora gradient + starfield, fixed, pure CSS, sits below all content
- Cards: `glass-card`, `glass-card-soft`, `glass-flat` — backdrop-blur + gradient border
- Accents: `grad-text` (blue→cyan→gold, signature), `grad-text-2` (inverted), `grad-border`
- Buttons: `btn`, `btn-primary`, `btn-outline`, `btn-ghost`, `btn-lg`
- Eyebrow label: `eye` + `eye-dot`
- Layering helper: `above-bg`

Motion: every animation gated on `motion-safe:`. Honor `prefers-reduced-motion`.

Hard rules:
- No `bg-white`, no `text-gray-*`. Use semantic tokens: `bg-page`, `bg-panel`, `text-ink`, `text-ink-60`, `text-ink-40`, `border-rule-{1,2,3}`.
- 8px spacing grid (8 / 16 / 24 / 32 / 48).
- Mobile-first. Test all sections at 360px, 768px, 1280px.
- Radius 20–24px on cards. Soft minimal shadows. Subtle accent glow only.

## 7. Geo-aware currency (key architecture)

India sees ₹. Rest of world sees $. Single URL per page (no `/in`, no `/us`). Cookie-based.

Implementation:
- `lib/currency.ts` exports `resolveCurrency({query, cookie, ipCountry})` with precedence: `?ccy=` query → `ets_ccy` cookie → `IN` geo (Vercel `x-vercel-ip-country` header) → `USD` default.
- Cookie: `ets_ccy=inr|usd`, domain `.easytradesetup.com`, max-age 1 year, Path `/`.
- `middleware.ts` writes cookie if missing (geo-derived), refreshes on `?ccy=` override.
- `<Price>` is **server component** reading cookie via `next/headers` — SSR HTML correct on first paint, no flash, no SEO mismatch, hreflang `en-IN` / `en-US` / `x-default` all point to same URL.
- `<PriceClient>` is `"use client"` variant for components that need client features (StickyBuyBar, OfferBanner). Use variant-aware placeholder so SSR shape matches even when invisible.
- `<CurrencySwitcher>` in TopNav (USD/INR toggle, writes cookie + reloads).

**Bug to avoid:** previous build had Price always rendering OFFER placeholder regardless of variant — both `<Price retail/>` and `<Price amount/>` output same number. Variant-aware placeholder fixes this.

## 8. Strict CSP with per-request nonce

`middleware.ts`:
- Generate nonce: `const nonce = crypto.randomUUID().replace(/-/g, "");`
- Build CSP with `'strict-dynamic'` + nonce. **No `'unsafe-inline'`. No `'unsafe-eval'`.**
- Set `x-nonce` request header (server components read it).
- Set `Content-Security-Policy` response header.

Inline scripts are forbidden EXCEPT JSON-LD. For JSON-LD, async server component reads nonce:

```tsx
async function Script({ data, id }) {
  const { headers } = await import("next/headers");
  const nonce = (await headers()).get("x-nonce") || undefined;
  return <script type="application/ld+json" id={id} nonce={nonce}
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

`next.config.mjs` securityHeaders: HSTS, COOP same-origin, CORP same-site, X-Frame-Options DENY, X-Content-Type-Options nosniff. **Do not** put CSP in `next.config.mjs` — middleware owns it.

## 9. Auth + DB (Supabase)

Schema highlights:
- `entitlements` (user_id, product, granted_at, source, active, **revoked_at, revoked_by, revoke_reason**)
- `stripe_sessions`, `stripe_payments`
- `audit_log`
- `qa_runs` (migration 020)
- `launch_readiness_acks` (migration 022)
- `mvp_tasks` (P0/P1/P2 with `tier` + `position`)

RLS: customers can only read their own entitlements. Admin role via service-role client (server-only).

Soft-delete pattern for entitlements:
- Default revoke = soft (`active=false`, `revoked_at`, `revoked_by`, `revoke_reason`)
- `?hard=1` or body `{ hard: true }` for permanent delete
- Restore endpoint clears revoke fields, sets `active=true`
- UI: two-click confirm with 5-sec auto-disarm

## 10. Stripe

- Stripe Checkout Sessions, **not** Payment Links (programmatic + currency control).
- Body `{ currency }` accepted; falls back to cookie → IP geo → USD.
- Metadata: `tier: "launch"`, `product: "golden-indicator"`.
- Webhook `checkout.session.completed` → grant entitlement + send Resend email.
- Cross-border INR works on UAE/EU/US Stripe accounts. UPI is future native upgrade.

## 11. Admin surfaces (`portal.easytradesetup.com/admin/*`)

Admin host is **separate** from marketing host so middleware can apply different policies. Gated to admin role.

Pages:
- `/admin` — dashboard, KPI cards
- `/admin/customers` — joined auth.users + entitlements
- `/admin/raw-entitlements` — every entitlement row direct (catches orphans where auth user gone)
- `/admin/stripe-sessions`
- `/admin/stripe-payments`
- `/admin/stripe-recover` — orphan payments → entitlement rebuild
- `/admin/audit`
- `/admin/errors`
- `/admin/qa` — run QA suite, list past runs
- `/admin/qa/[id]` — drill into run with sticky filter chips (All / Red flags / Warnings / Passed)
- `/admin/readiness` — launch readiness checklist with auto-detect + manual ack

**Generic DataTable** (`components/admin/DataTable.tsx`):
- `<DataTable<T>>` with `Column<T>[]` + `FilterChip<T>[]`
- Free-text search across configured columns
- Click-header sort with `aria-sort`
- Filter chips (configurable per table)
- Pagination
- CSV export
- Mobile card-list fallback under 640px
- ARIA: `aria-pressed`, `aria-label`, `role="button"`, keyboard sort

**Every admin list wraps DataTable.** Don't roll your own.

## 12. QA suite (`lib/qa-suite.ts`)

50+ automated checks across categories: Build / Env / Security / Functional / SEO / Database / Pricing / UX. `runSuite(origin)` runs in parallel batches of 8.

**Critical gotcha:** probe production marketing host (`https://www.easytradesetup.com`), not admin host (which 307s to sign-in). Resolve origin server-side: body.origin → `process.env.VERCEL_ENV === "production" ? marketing host : request host`.

Robots check: parse per-user-agent groups; only fail if wildcard `*` blocks `/`.

Store runs in `qa_runs` table for history.

## 13. Launch readiness (`lib/launch-readiness.ts`)

`ReadinessItem` type with `auto: () => Promise<AutoStatus>` for auto-detection where possible.

9 blockers + 8 warnings tracked. Examples:
- Blocker: `security.csp-nonce` (auto: probe live CSP header)
- Blocker: founder bio (manual ack)
- Blocker: admin 2FA enrolled (manual ack)
- Warning: staging environment exists, sentry configured, backup drill done

Page renders status banner (red/amber/green) + 4 KPI cards + per-category grouped items with severity chips, fix steps, auto-detect status. Manual items toggleable via `/api/admin/readiness/toggle`. Auto-detected items rejected from manual toggle.

## 14. Skeleton loaders (`components/ui/Skeleton.tsx`)

Primitives: `Skeleton`, `SkeletonText`, `SkeletonRect`, `SkeletonKpi`, `SkeletonTable`, `SkeletonCard`. CSS shimmer via `.ets-skel` class with neutral gray gradient.

Every route gets `loading.tsx` matching its layout. No bare spinners.

## 15. SEO

- JSON-LD on home: Organization + WebSite + Product + SoftwareApplication + FAQPage + Breadcrumb
- Export FAQ list as `homeFaqs` from `FAQTeaser.tsx` so JSON-LD and visible UI never drift
- hreflang: `en-IN`, `en-US`, `x-default` all → `/`
- robots.txt: block 17 AI scrapers (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Bytespider, Amazonbot, Applebot-Extended, Diffbot, FacebookBot, Meta-ExternalAgent, cohere-ai, ImagesiftBot, DuckAssistBot, YouBot, OAI-SearchBot, CCBot, Google-Extended). Keep Google/Bing unblocked.
- Sitemap with priority tiers per route
- OG image (`app/opengraph-image.tsx`): **ASCII only.** No `✓`, no `₹`. Use "ETS" letter mark and "INR" prefix. Reason: `@vercel/og` runtime dynamic-font fetches for those glyphs intermittently 400.
- Meta description ~155 chars max
- Title ~55 chars max (template appends `· EasyTradeSetup`)
- `public/.well-known/security.txt`

## 16. Content discipline (non-negotiable)

- **No fake testimonials.** Customer quotes only post-launch with written permission and verifiable purchase.
- **No SEBI-registered research language.** We are not a registered research analyst. Indian users see SEBI disclaimer on checkout.
- **"Educational, not investment advice"** callout on every page that shows hypothetical trade outcomes (case studies, sample, checkout).
- **Claims must be verifiable from code or public listing.** Compare page gets monthly review date footnote.
- **English only.** No Hindi (only short tagline in TrustStrip if at all). No multi-language until revenue justifies.
- **Don't reveal indicator internals.** Showcase result via screenshots + videos. Pine source stays sealed.

## 17. Tests — gating production deploy

`vercel.json`:
```json
{ "framework": "nextjs", "buildCommand": "npm test && next build", "installCommand": "npm install" }
```

Unit (`tests/unit/*.test.ts`, Vitest, ~1s):
- Pricing FX drift ±20%
- Currency cookie precedence
- Format helpers

E2E (`tests/e2e/*.spec.ts`, Playwright Chromium):
- `home.spec.ts` asserts headline, 3-lane titles, FAQ objection handlers, FinalCTA sub-line
- `pages.spec.ts` smoke for every public route (status 200, no console errors)

**Rules:**
- Edit home copy → update `home.spec.ts` in same commit
- Edit `lib/pricing.ts` or `lib/launch.ts` → run `npm test` before commit
- Add public page → register in `sitemap.ts` + smoke row in `pages.spec.ts`
- Add home section → register in `(marketing)/page.tsx` + assertion in `home.spec.ts`

## 18. Deploy / git rules

- Default branch `main`. Vercel auto-deploys on push.
- **Never commit secrets.** `.claude/settings.local.json` gitignored. Vercel env for prod. GitHub push-protection on.
- **Never commit** `.next/`, `node_modules/`, `coverage/`, `playwright-report/`, `test-results/`.
- **Always `npm run build` cleanly before push.**
- Commit style: short verb-led title; body explains *why* when non-obvious.

## 19. Build order (recommended)

1. Bootstrap Next 15.5 + TS + Tailwind in `landing-page/`
2. Design tokens + globals.css + 4 button variants + glass-card + aurora backdrop
3. `lib/pricing.ts` + `lib/launch.ts` + unit test for FX drift
4. Home page 7 sections with placeholder copy
5. Sitemap + robots + JSON-LD + OG image
6. Supabase migrations + auth scaffolding
7. Stripe Checkout Session API + webhook + entitlement grant
8. Resend email on webhook fire
9. `middleware.ts` — CSP nonce + currency cookie
10. `<Price>` server component + `<PriceClient>` + `<CurrencySwitcher>`
11. Admin: `DataTable<T>` then customers / raw-entitlements / stripe tables
12. QA suite + `/admin/qa` + per-run drill page
13. Launch readiness checklist
14. Skeleton loaders site-wide
15. Playwright e2e + wire `npm test && next build` into Vercel
16. Soft-delete + restore for entitlements
17. Polish: ExitIntent, StickyBuyBar, OfferBanner, TrustStrip
18. Production deploy + smoke

## 20. What's out of scope (don't build until asked)

- Multi-product catalog (single product only)
- Multi-language UI (English only)
- Razorpay/UPI native (Stripe INR works as bridge)
- Customer testimonials (gated post-launch)
- A/B testing framework (manual copy changes for now)
- Mobile app
- Telegram/Discord integrations
- Founder identity (placeholder; owner fills with real name + photo + LinkedIn)

## 21. When stuck

1. Re-read `CLAUDE.md`.
2. Re-read `lib/pricing.ts` and `lib/launch.ts` before any price/date edit.
3. Run `npm test && npm run test:e2e` before push.
4. Adding a route → sitemap + e2e smoke in same commit.
5. Adding home section → register in page + e2e assertion in same commit.
6. Adding admin list → wrap `DataTable<T>`. Don't roll your own.

---

**Now build it.** Ship in this order:
1. Repo skeleton + design system + home page (placeholder copy)
2. Pricing + currency + Stripe checkout
3. Auth + entitlements + portal
4. Admin + QA suite + readiness
5. Tests + CI gate + production deploy

Make reasonable assumptions. Don't ask questions for routine decisions. Course-correct as you go.
