# Competitor Watchlist — EasyTradeSetup

> Track who else is targeting our keywords. Never name them in published content without legal review. Use this file for internal positioning only.

Last refreshed: 2026-05-09

---

## Tier-1 competitors (direct overlap)

> Indicator + chart-tool brands targeting Indian retail F&O traders.

| Brand | URL | Pricing model | Strength | Weakness | Last reviewed |
|---|---|---|---|---|---|
| `<placeholder>` | — | subscription ₹X/mo | strong YT presence | recurring fees | — |
| `<placeholder>` | — | one-time ₹Y | brand recognition in NSE F&O | dated UI | — |

## Tier-2 competitors (adjacent)

> Signal services, telegram channels, course-sellers. Different model but compete for same wallet.

| Brand | URL | Model | Notes |
|---|---|---|---|
| `<placeholder>` | — | telegram signals | scaling fast in NIFTY weeklies |

## Tier-3 (international, future)

| Brand | URL | Notes |
|---|---|---|
| `<placeholder>` | — | TradingView marketplace listing — multi-asset, English-first |

---

## Field schema

```
| <Brand> | <Public URL or `internal-only`> | <Pricing/business model> | <Their main strength> | <Their main weakness> | <YYYY-MM-DD reviewed> |
```

## What Hermes tracks per competitor (monthly)

For each Tier-1, Hermes drops a `<brand>-snapshot-YYYY-MM.md` into `/content/blog/_research/competitor-snapshots/` (gitignored from public deploy):

- Top 10 ranking keywords (SERP scrape)
- New content shipped this month (titles + URLs)
- Pricing changes
- New social proof / testimonials they've added
- Estimated traffic delta (Ahrefs / Ubersuggest)

Snapshots are research only. Public content **never** names a competitor brand without legal review.

## Differentiation we lean into

| Pillar | Why we win |
|---|---|
| One-time payment | No recurring drip. Buy once, own forever. |
| No signals, no calls | Reader builds the skill. We're a tool, not a crutch. |
| Sealed indicator | Zero cluttered "buy/sell arrow" noise — single decision layer. |
| India-aware + global | INR equal-citizen with USD. NSE F&O playbook native. |
| Educational compliance posture | SEBI disclaimer, refund window, no fake testimonials |
| Bundle (PDF + calculator + notes) | Indicator alone isn't the product — it's the whole decision system |

## Pillars to monitor (where competitors might out-pace us)

- Long-form YouTube — we publish Shorts daily, long-form weekly is aspirational. Several competitors out-produce us here.
- Hindi content — we have one tagline. A serious Hindi-first competitor could segment-capture.
- Live trading rooms — we explicitly do not offer this. Some buyers want it.

## When a competitor changes pricing

Hermes alerts via GitHub issue tagged `competitor-watch`. Human decides whether to revise our `pricing.ts` — Hermes never edits pricing.
