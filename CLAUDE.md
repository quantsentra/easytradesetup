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

**USD only.** Single global price — no INR, no geo-aware currency switch, no FX anchor.

| | USD |
|---|---|
| Retail | $149 |
| Launch offer | $49 |

**Never hardcode a price elsewhere.** Always import from `@/lib/pricing` (`OFFER_USD`, `RETAIL_USD`, `USD_SET`, `format`). Unit test `tests/unit/pricing.test.ts` asserts offer < retail and the discount stays in the honest 50–80% band.

History: INR pricing + the geo-aware `<Price />` currency switch + the Razorpay rail were removed 2026-05-28 when the business refocused on US / UAE / international. `lib/currency.ts` was deleted; payments are Stripe-USD only.

Launch window source: `landing-page/lib/launch.ts` — `LAUNCH_END_DATE`, `RESERVATION_CAP` (500). Surface wires through `<ReservationNotice />` and `<LaunchCountdown />`.

---

## Stack

- **Framework:** Next.js 15.5 (App Router) + React 19 + TypeScript 5.7
- **Styling:** Tailwind 3.4, custom tokens in `landing-page/tailwind.config.ts`, global CSS in `landing-page/app/globals.css`
- **Analytics:** @vercel/analytics
- **Hosting:** Vercel, auto-deploy from `main` on push
- **Payments:** Stripe (USD) — **LIVE** (`cs_live`). **Guest checkout** — no login wall; anon buyers pay first, the webhook (`lib/stripe-fulfill.ts`) creates/links the Clerk user from the Stripe email + grants the entitlement. `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` confirmed set in prod (2026-06-01).
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
- **No registered-adviser language.** We are not a registered investment adviser or research analyst in any jurisdiction. Keep the jurisdiction-neutral disclaimer site-wide (esp. on checkout + any page with hypothetical outcomes) — it is protective precisely because retained NIFTY/BANKNIFTY SEO content still draws Indian organic traffic.
- **"Educational, not investment advice"** callout must be on every page that shows hypothetical trade outcomes (case studies, sample, checkout).
- **Claims must be verifiable from code or public listing.** Compare page gets a monthly review date in the footnote.
- **US / UAE / international focus (since 2026-05-28).** USD-only pricing. India is no longer a sales-targeted market: no INR, no Hindi tagline, no India-first positioning. BUT NIFTY/BANKNIFTY educational blogs + `/indicator/nifty` + `/indicator/banknifty` are **retained for SEO** — they pull global + Indian organic traffic and NIFTY traders worldwide. Don't delete that content; just don't sell/price to India. `resolveHomeMarket()` (`lib/geo.ts`) still shows NIFTY-first to IN IPs as a content nicety.

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

## Content auto-publishing pipeline (v1.2 stable, 2026-05-08)

End-to-end publishing to Instagram + YouTube Shorts from a single source-of-truth queue. Founder time = 0 once the queue is seeded.

**Source:** `landing-page/admin-assets/content/14-day-queue.json` — 14 day post queue with hook + caption + slide outline + image prompt + CTA per row. IG carousel + IG static + IG reel + YT short formats. Reels are filtered out at sync time and handled separately by Opus Clip.

**State:** `content_posts` table (migrations 027 + 028). Independent state machines per platform — `status` for IG, `yt_status` for YT, each goes pending → publishing → published / failed → (retry-failed → pending).

**Pipeline:**
```
admin-assets/content/14-day-queue.json
  ↓ /api/admin/content-posts/sync (admin button)
content_posts table
  ↓ Vercel cron 03:30 UTC daily (IG) / 04:30 UTC daily (YT)
/api/og/post/[day] (1080x1350 IG)  +  /api/og/post/[day]/yt (1080x1920 YT)
  ↓ image rendered dynamically by next/og
IG: directly to graph.instagram.com Graph API (single + carousel)
YT: → Cloudinary image-to-video (e_zoompan, du_10, vc_h264) → fetched MP4 → multipart upload to googleapis.com/youtube/v3/videos → videos.update flip private→public
  ↓
Live on @easytradesetup IG + @easytradesetups YT
```

**Admin pages:**
- `/admin/content-queue` — queue view with one-click clipboard copy buttons (caption, hashtags, visual brief). Manual workflow option.
- `/admin/seo-keywords` — AnswerThePublic keyword research clusters (10 clusters, 30 keywords) used to draft new queue rows.
- `/admin/instagram` — auto-publisher status dashboard. Both platforms side-by-side, live countdown timers per pending row, per-platform Test publish + Retry failed actions. Per-row ETA based on serial position in queue × daily cron tick.

**Required Vercel env vars** (set via dashboard, never committed):
```
# Instagram (IG Business Login API)
INSTAGRAM_USER_ID
INSTAGRAM_LONG_TOKEN          (60-day, auto-refreshed weekly via cron)
INSTAGRAM_APP_SECRET          (only for token refresh)

# YouTube (Data API v3, OAuth)
YT_CLIENT_ID
YT_CLIENT_SECRET
YT_REFRESH_TOKEN              (7-day in testing mode, 60-day after audit)

# Cloudinary (image-to-video for YT)
CLOUDINARY_CLOUD_NAME
CLOUDINARY_UPLOAD_PRESET      (must be 'unsigned' signing mode)

# Already set, used by these crons
CRON_SECRET                   (Bearer auth on all cron routes)
NEXT_PUBLIC_SITE_URL          (used by cron to construct image URLs)
```

**Cron schedule** (`landing-page/vercel.json`):
- `30 3 * * *` — IG publish (09:00 IST)
- `0 4 * * 0` — IG token refresh (Sun 09:30 IST)

> **YouTube pipeline removed 2026-06-01.** Recurring API issues (7-day OAuth token + Cloudinary image-to-video). Deleted: `publish-youtube` cron, `/api/og/post/[day]/yt`, `run-publish-yt` + `retry-failed-yt` routes, `lib/youtube.ts`, `lib/cloudinary.ts`, and all YT UI in the auto-publisher dashboard. **IG is the sole channel.** `content_posts.yt_*` columns are left in the DB (harmless, droppable later). If YT is revived, restore from git history before this date.

**Refresh tokens / auth notes:**
- IG long-lived token: 60 days, auto-refreshed weekly via cron. No manual rotation required unless cron silently fails for >60 days.
- YT refresh token in testing mode: **7 days** before manual re-auth via OAuth Playground. To get permanent (60-day) refresh tokens, submit the OAuth project for YouTube API Compliance Audit (1-6 weeks). Workaround until audit clears: re-do Playground flow weekly (~3min).
- Meta App + Google Cloud project both owned by `quantsentra@gmail.com` personal — not the EasyTradeSetup business portfolio (Meta Developer requires personal FB; Google Cloud OAuth requires personal Google).

**Carousel + multi-slide / audio next steps** (not yet wired):
- Multi-slide YT video (stitch all carousel slides into one 30s clip): needs Cloudinary `multi` API + signed uploads + asset tagging. Out of scope until basic pipeline proves.
- Background audio for YT Shorts: needs royalty-free audio asset uploaded to Cloudinary + audio-overlay transformation. Same out-of-scope reason.
- Direct video uploads (skipping image-to-video conversion): future phase if user starts generating real video content via Veo / Kling / phone recordings.

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

- **Founder identity is placeholder "TS".** Real name + photo + LinkedIn pending — owner will fill. Do not fabricate. **Recommended:** real photo + real name (avatar trust signal is poor in trader/finance niche).
- **No live customer testimonials yet.** Placeholder footnote in `Principles.tsx`. Do not invent.
- **No Hindi / localization.** Site is English, USD-only. India sales positioning was removed 2026-05-28; the old TrustStrip Hindi tagline is being retired in the copy-reposition pass.
- **Payments LIVE + guest checkout (2026-06-01).** Stripe-USD only (Razorpay/INR removed). Anon buyers pay first; webhook creates/links the Clerk user from the Stripe email + grants the entitlement. Login wall removed (was the #1 conversion leak). `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` set in prod. Stripe webhook must stay registered → `https://www.easytradesetup.com/api/webhook/stripe` (event `checkout.session.completed`).
- **No A/B framework.** Changes to home copy are manual. If we add GrowthBook or similar, document the wiring here.
- **YouTube auto-publish REMOVED (2026-06-01).** Was failing on API issues; pipeline deleted, IG-only now. See the YT-removed note in the pipeline section. Don't re-add without addressing the 7-day OAuth-token problem first.

---

## When in doubt

1. Read this file first.
2. Read `landing-page/lib/pricing.ts` and `landing-page/lib/launch.ts` before touching any price or date.
3. Run `npm test` + `npm run test:e2e` locally before pushing anything that touches the home page.
4. When adding a new public page, add it to `app/sitemap.ts` and a smoke row in `tests/e2e/pages.spec.ts`.
5. When adding a new section to the home page, register it in `app/page.tsx` and add at least one assertion in `tests/e2e/home.spec.ts`.
6. Touching the auto-publishing pipeline? IG-only since 2026-06-01 (YT removed). Read `lib/instagram.ts` + the cron route `app/api/cron/publish-instagram/`. State lives in `content_posts` table (migrations 027 + 028). Source data is `admin-assets/content/100-day-queue.json`.
7. Adding a new admin page? Wire it into `app/admin/layout.tsx` `navSections` array under the right category (Operations / Content / Growth / Insights / System) — the sidebar is data-driven.
