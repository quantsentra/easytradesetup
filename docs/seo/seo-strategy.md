# SEO Strategy — EasyTradeSetup

> Source of truth for Hermes Agent and human collaborators. Update here first when strategy shifts.

---

## 1. Objective

Win organic traffic for trader-intent queries that convert to **Golden Indicator** purchases. Positioning: *chart tool, not signal service*. Educational, not investment advice.

Primary KPI: organic sessions → checkout reservations (`/api/lead`) → paid conversions once payments are wired.
Secondary KPI: branded search lift, returning visitors, time-on-page on `/product` and `/sample`.

---

## 2. Audience tiers

| Tier | Who | Pain | Search behaviour |
|---|---|---|---|
| T1 — Active retail F&O | NSE NIFTY / BANKNIFTY weekly-expiry traders | Indicator stack overload, signal-service fatigue | "best indicator for nifty options", "stop subscribing to signals" |
| T2 — Swing / positional | Equities + commodities, India + global | Wants regime + structure clarity | "trend vs range indicator", "support resistance pine script" |
| T3 — Crypto / global indices | BTC, SPX, XAU traders | Cross-asset same playbook | "tradingview multi-asset indicator" |
| T4 — Beginners | New TradingView users | Setup paralysis, scam-ad fatigue | "tradingview indicator for beginners", "first chart setup" |

---

## 3. Core content pillars

1. **Indicator literacy** — what makes an indicator decision-grade, not noise. Framing competitor-class tools without naming.
2. **Risk + math discipline** — position sizing, expectancy, why win-rate ≠ edge.
3. **Market structure** — regime detection, S/D zones, trend-vs-range, key levels.
4. **TradingView craft** — Pine v5, multi-timeframe, alerts, chart hygiene.
5. **NSE F&O playbook** — NIFTY / BANKNIFTY weekly expiry, lot sizing, OI signals.
6. **Brand + meta** — why one-time-pay vs subscriptions, why we don't do calls.

---

## 4. Content velocity targets

| Channel | Cadence | Owner |
|---|---|---|
| Blog (`/blog/[slug]`) | 2 articles/week | Hermes drafts → Claude Code implements → human approves |
| Instagram | 1/day (auto-publisher in place, see `CLAUDE.md`) | Auto-publish from `100-day-queue.json` |
| YouTube Shorts | 1/day (auto-publisher in place) | Auto-publish from `100-day-queue.json` |
| YouTube long-form | 1/week | Manual, future phase |
| Facebook | 3/week | Manual repost from IG initially |
| Newsletter / Daily Notes | 5 weekdays/week (existing offering) | Existing pipeline |

---

## 5. On-page SEO baseline (every new page)

- Unique `<title>` (≤60 char) and `meta description` (≤155 char). Set in `metadata` export of the route.
- One `<h1>` matching primary keyword intent.
- Above-fold CTA tied to `/checkout` or `/sample`.
- JSON-LD: `Article` for blog, `FAQPage` if FAQ block, `BreadcrumbList` always.
- Internal-link rule: every blog ≥3 internal links to product/pricing/compare/sample/docs.
- Images: `alt`, lazy-loaded except hero, brand palette only (no stock chart screenshots without caption).
- Risk disclaimer block on any page that names a price level, setup, or hypothetical P&L.
- `noindex` on `/admin/*`, `/thank-you`, `/checkout` success.

---

## 6. Off-page strategy (manual, low priority pre-launch)

- Reddit: r/IndianStreetBets, r/IndiaInvestments, r/Daytrading — answer questions, no spam.
- TradingView Ideas: publish weekly idea using Golden Indicator chart, link in profile.
- YouTube collabs: comment-then-DM on 3-5 mid-tier Indian trading channels/week.
- Quora India trading topics: long-form answers, link to `/sample`.

---

## 7. Restricted topics

Hermes drafts, but humans **must** approve before publishing:

- Anything that names a specific stock, option strike, or price target.
- Backtest screenshots — must include data range, slippage assumptions, "past performance" disclaimer.
- Any P&L claim, screenshot, or testimonial.
- Comparisons that name a competitor by brand — legal review first.

See [hermes-agent-operating-rules.md](./hermes-agent-operating-rules.md) for the full guardrail list.

---

## 8. Review cadence

- Weekly: Hermes posts a "what shipped + what's next" comment on the [SEO Improvement Tracker](https://github.com/quantsentra/easytradesetup/issues?q=label%3Aseo) issue.
- Monthly: human refreshes `keyword-bank.md`, `competitor-watchlist.md`, GSC audit.
- Quarterly: re-evaluate pillars vs revenue contribution; prune content with <50 sessions/mo and no link equity.
