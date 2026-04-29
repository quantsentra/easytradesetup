# EasyTradeSetup — Complete Site Content

Snapshot of all user-visible copy across the EasyTradeSetup marketing site.
Auto-extracted at commit `8fc6d73`. Prices shown as `[offer]` (currently
$49 USD / ₹4,599 INR) and `[retail]` ($149 / ₹13,999) — resolved per-visitor
by the geo-aware `<Price />` component.

---

# Global Chrome

Shown on every page.

## Offer banner (top of page)

> Dismissible. Shows live countdown. Post-launch falls back to "Launch window closed".

- **Label (live):** Inaugural launch
- **Price pair:** [retail] → [offer]
- **Tagline (desktop):** · First 500 customers only
- **Countdown:** Ends 15 May 2026 — **{N}d** **{N}h** **{N}m**
- **Post-launch label:** Launch window closed — Retail price in effect — [retail]

## Top navigation

- Logo: **EasyTradeSetup**
- Primary links: **Product · Pricing · Compare · Sample · FAQ**
- Secondary: **Contact**
- Theme: light / dark toggle
- Primary CTA: **Reserve · [offer] →**

## Markets ticker (site-wide, below header)

- Left label: **LIVE MARKETS** (when CoinGecko responds) · fallback **READS ANY SYMBOL ON TRADINGVIEW**
- Live rows: LIVE · **BTC / USD** · price · 24h %Δ (+/-)
- Live rows: LIVE · **ETH / USD** · price · 24h %Δ
- Live rows: LIVE · **SOL / USD** · price · 24h %Δ
- Live rows: LIVE · **XRP / USD** · price · 24h %Δ
- Static ribbon: NIFTY 50 · BANK NIFTY · SPX 500 · NASDAQ 100 · DOW JONES · XAU / USD · SILVER · CRUDE OIL · EUR / USD · GBP / JPY · NIFTY WEEKLY

## Reservation notice

> Small pill. Appears under hero and on pricing / product / checkout.

- **{claimed} / 500 CLAIMED · {remaining} LEFT**
- **{N}D LEFT · ENDS 15 MAY 2026**
- Progress bar (blue → cyan)
- Post-launch state: **LAUNCH CLOSED**

## Footer

- Tagline: _One sealed TradingView indicator. Any symbol. Any timeframe. One-time payment, lifetime access._
- **Product** — Golden Indicator · Pricing · Compare · Free Sample
- **Company** — About · Contact
- **Resources** — Install Guide · FAQ
- **Legal** — Terms · Privacy · Refund Policy · Trading Disclaimer
- **Copyright:** © {year} EasyTradeSetup · All rights reserved
- **Footer disclaimer:** Not investment advice · Trading involves risk · You decide every trade

### Risk disclosure (above footer, every page)

**RISK DISCLOSURE**
> Trading in financial instruments — stocks, F&O, commodities, forex, crypto — involves significant risk. Past performance of any strategy is not indicative of future results. EasyTradeSetup products are for educational purposes only and do not constitute investment advice. For Indian users: we are not SEBI-registered. Trade only with capital you can afford to lose. Full [trading disclaimer](/legal/disclaimer).

## Sticky buy bar (mobile, below 1024px)

- Appears after 400px scroll
- **INAUGURAL · LAUNCH PRICE**
- [retail] → [offer]
- Button: **Reserve**

## Exit-intent modal (desktop mouse-leave / mobile tab-hide)

> Fires once per session. Disabled on /checkout and /thank-you.

- Eyebrow: **Before you go**
- Title: **Take a sample of the playbook with you.**
- Body: Drop your email and we'll send a free 3-page sample from the Trade Logic PDF — structure, entry rules, invalidation. No spam. No follow-ups until launch.
- Form: email → **Send sample** (disabled state: _Sending…_)
- Success state: _Thanks — check your inbox. If it doesn't arrive in 5 minutes, peek in spam._
- Error state: _Couldn't send right now. Please try again or email welcome@easytradesetup.com._
- Footer link: _Or [view the sample page](/sample) · unsubscribe any time · we don't sell emails._

---

# Home page (/)

Section order: Hero → CleanVsNoisy → WhoFor → Bundle → MultiMarket → TheLoop → PricingTeaser → FAQTeaser → FinalCTA.

## Hero

> Pill: `v2.4 · Inaugural launch LIVE`

### H1

**One TradingView indicator.
Everything you'll _ever_ need
to read any market.**

### Sub

Golden Indicator is a sealed Pine v5 script. Regime, structure, key levels, entries, pullbacks, and risk — fused on one pane. Bar-close only. No repaint, no signal service. You decide every trade.

### CTAs

- Primary: **Reserve · [offer] →**
- Secondary (text link): _or read a free chapter first →_

### Stat strip

- **6** Bundle items
- **24/5** Markets covered
- **0** Subscriptions

### Chart mockup (right column)

- Terminal header: `NIFTY 50 · 15m · Golden v2.4` · **LIVE**
- Price: **24,852.15** · ▲ +0.42%
- Tag: **UPTREND**
- Legend: Regime · Key Level · Entry · Pullback
- Floating badge: **Bar-close only** — NO REPAINT · NO FLICKER
- Footnote: _Illustrative · Not live · Not a trade recommendation_

## CleanVsNoisy (before / after)

### Eyebrow

**Before / after**

### Title

**Same chart. _Two very different reads._**

### Lede

You were never losing to the market. You were losing to a chart with no structure, no zones, and no idea who owns the level.

### Cards

**BEFORE · XAU / USD · 15m · TradingView**
Candles. Maybe a moving average. No market structure, no supply / demand, no way to read where size actually entered the book.

**AFTER · XAU / USD · 15m · Golden Indicator**
Buyer and seller zones. Regime bias. Market structure (HH / HL / LL / LH). PDH / PDL / PWH / PWL. One pane. One read. One decision.

### Footnote

REAL TRADINGVIEW SCREENSHOTS · NOT MORE INDICATORS — FEWER DECISIONS

### CTAs

- **Reserve · [offer] →**
- **See how it compares**

## WhoFor (three lanes)

### Eyebrow

**Who this is for**

### Title

**Three traders. _One tool._**

### Lede

Golden Indicator adapts to how you trade. Pick the lane that looks most like yours.

### Lane 1 — INTRADAY · Scalpers & day traders

- Markets: NIFTY · BANKNIFTY · SPX · NAS100
- Who: You trade 5m / 15m on NIFTY, BANKNIFTY, or SPX futures. You want a read before the second candle prints.
- WHAT IT GIVES YOU: Opening-range bias, VWAP context, regime flips, and trap zones — drawn on the chart, not buried in a dozen sub-panes.

### Lane 2 — SWING · Swing & positional traders

- Markets: Equities · XAU · BTC · ETH
- Who: You hold days to weeks on equities, gold, or crypto. You lose more to fake breakouts than to bad setups.
- WHAT IT GIVES YOU: Market-structure filter (HH / HL / BOS / CHoCH) tells you when you're buying the trend vs. buying the trap.

### Lane 3 — OPTIONS · Options & expiry players

- Markets: NIFTY weekly · BANKNIFTY weekly
- Who: You sell straddles on Thursday or buy weeklies for directional moves. You need bias + volatility on one pane.
- WHAT IT GIVES YOU: Expiry-day gamma awareness, range-day tagging, and session-time filters built into the script.

### Footnote

SYMBOL-AGNOSTIC · WORKS ON ANY TRADINGVIEW CHART · FREE TIER SUPPORTED

## Bundle (the kit — 4-grid)

### Eyebrow

**The kit**

### Title

**Four instruments. _One sealed workflow._**

### Lede

Regime, structure, entry, and pullback logic fused into a single non-repainting engine. No upsells, no feature tiers, no hunting across twelve scripts for the one piece that actually works.

### Items

**01 · Golden Indicator** · PINE SCRIPT V5
One signal engine replacing a dozen cluttered indicators. Bar-close only — no repaint, no mid-bar flicker.

**02 · Trade Logic PDF** · 50+ PAGES
Entries, exits, risk framework — in plain language. Rules you can read once and apply the next morning.

**03 · Risk Calculator** · NEW
Position sizing and R-multiple tracker tuned to your account currency. Protect capital before chasing P&L.

**04 · Daily Market Notes** · COMING SOON
Pre-market bias: NIFTY, SPX, Gold, BTC. Levels, gamma, session timing. Delivered before the open.

### Promise strip

✓ Lifetime updates included · ✓ Delivered by email · ✓ Installable in under 60 seconds

## MultiMarket (stacked terminal cards)

### Eyebrow

**Multi-market coverage**

### Title

**One script. _Every market you actually trade._**

### Lede

Symbol-agnostic by design. The regime filter, session timing, and volatility scaling adapt automatically to whatever chart you paste it on.

### Checklist

- ✓ Tuned first for NIFTY / BankNifty weekly expiries
- ✓ Runs clean on SPX, NASDAQ, DAX, FTSE
- ✓ Commodities: Gold, Silver, Crude — ready
- ✓ Crypto: BTC, ETH, major alts — bar-close safe
- ✓ Forex majors + INR pairs included

### CTA

**See how it compares →**

### Cards (right column)

**NIFTY 50 · 15m · Golden · NSE Intraday**
24,852.15 · ▲ +0.42% · Opening-range bias confirmed · long above VWAP

**SPX 500 · 1H · Golden · US Futures**
5,218.40 · ▲ +0.28% · Regime bullish · HH / HL intact · key level 5,200

**BTC / USD · 4H · Golden · Crypto**
71,420 · ▼ −0.18% · Range regime · mean-revert setup at upper band

## TheLoop (4-step workflow)

### Eyebrow

**The loop**

### Title

**Install. Read. _Decide._ Trade.**

### Lede

Four moves per session. No alerts to your phone, no paid signal rooms, no Telegram nags.

### Steps

**01 · Install** — Paste the Pine v5 file into TradingView's Pine Editor. Save. 60 seconds. Works on the free plan.

**02 · Read** — Structure, regime, key levels, and supply / demand zones print on one pane. Bar-close only. No repaint.

**03 · Decide** — Your entry, your stop, your size. The script shows the context; you own every trade.

**04 · Trade** — Same chart, any symbol. NIFTY, BANKNIFTY, SPX, XAU, BTC — the filter adapts to regime and session.

## PricingTeaser (anchor block)

> Pill: `Inaugural launch · First 500 customers only`

### Title

**[retail struck] [offer]**

### Sub

Inaugural launch price — over 60% off retail. One payment, yours for life.

Less than 2 months of a LuxAlgo subscription. One avoided bad trade covers it 10× over.

### Value list

- ✓ Any symbol, any timeframe on TradingView
- ✓ Bar-close only — no repaint, no flicker
- ✓ Equities, F&O, forex, crypto, commodities
- ✓ Lifetime updates — no subscription, ever
- ✓ Trade Logic PDF + risk calculator included
- ✓ Pine v5 — runs on the free TradingView plan

### CTAs

- **Reserve · [offer] →**
- **See full pricing**

### Footnote

ONE-TIME PAYMENT · INSTANT DELIVERY · LIFETIME ACCESS · 7-DAY REFUND

## FAQTeaser

### Eyebrow

**Frequent questions**

### Title

**Questions before you _buy._**

Still need more? [Email us](/contact) — we reply within 24 hours from a human.

### Q: Why pay when free Pine scripts exist on TradingView?

A: Free scripts are single-purpose — one MA, one oscillator, one pattern. Golden Indicator fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL / PWH / PWL), and supply / demand zones into one non-repainting engine. Plus the Trade Logic PDF and risk calculator. You're buying a system, not a plot.

### Q: Does it repaint? What about mid-bar signals?

A: No repaint. Every signal, zone, and structural break is calculated on bar close only. What you see at close is what stays on the chart — forever.

### Q: Is this a signal service or a buy / sell bot?

A: Neither. Golden Indicator is a chart tool. It draws the levels and structure; you decide the trade. No alerts to your phone, no copy-trading, no tips.

### Q: Which markets and timeframes are supported?

A: Any symbol on TradingView, any timeframe. Tuned for NIFTY / BANKNIFTY weekly expiries, clean on SPX / NAS100, XAU / Silver / Crude, major forex, and BTC / ETH / SOL.

### Q: Will this work on my free TradingView plan?

A: Yes. Pine Script v5 runs on every TradingView tier including the free plan. No upgrade needed.

### Q: How does the 7-day refund work?

A: Email within 7 days of purchase — full refund, no forms, no questions. Reply from the founder within 24 hours.

Link: **Read the full FAQ ›**

## FinalCTA (closing dark block)

> Eyebrow: **Feed the edge**

### H2

**Feed the read. _Starve the noise._**

### Sub

[offer] once. Not [offer]/month. Ever. Own the script for life and decide every trade yourself.

### Footnote

7-DAY REFUND · INSTANT EMAIL DELIVERY · NOT INVESTMENT ADVICE

### CTAs

- **Reserve · [offer] →**
- **Free chapter first**

---

# /product

## Page header

- Eyebrow: **Golden Indicator**
- Title: **One script. _One decision layer._**
- Lede: Built inside Pine Script v5 for TradingView. Every component shares the same bar data and the same chart — signals never contradict each other.

## Four promises

**One integrated engine** — Regime, momentum, levels, volume, and risk — fused into a single proprietary signal layer. One chart, one read.

**Any symbol. Any timeframe.** — Runs cleanly on NSE F&O, US equities, commodities, forex, and major crypto. From 1-minute to weekly.

**Zero subscriptions** — Pay once. Keep the script forever. Lifetime updates included. No feature tiers, no renewal traps.

**Delivered sealed** — Pine file, Trade Logic PDF, risk calculator, and daily market notes — by email within seconds.

## Bundle section

_(see Home → Bundle above — same component)_

## Technical specs

- **Language** — Pine Script v5
- **Platform** — TradingView · any plan
- **Symbols** — NSE · US · Forex · Crypto · Commodities
- **Timeframes** — 1m → 1W
- **Alerts** — Built-in alertcondition()
- **Delivery** — Email · .pine + PDF

## Reserve strip (bottom)

- **Reserve · [offer] →**
- **Read a free chapter**
- ONE-TIME · LIFETIME UPDATES · 7-DAY REFUND

---

# /pricing

## Page header

- Eyebrow: **Pricing**
- Title: **One price. _Forever._**
- Lede: No tiers. No upsells. No subscription that silently drains your account. Buy once, own forever.

## Hero price block

- Pill: **Inaugural launch · First 500 customers only**
- Retail: ~~[retail]~~
- Offer: **[offer]**
- ONE-TIME · TAXES INCLUDED
- CTAs: **Reserve · [offer] →** · **Read free chapter**
- INSTANT DELIVERY · LIFETIME ACCESS · 7-DAY REFUND
- Launch countdown widget

## You get

- **Golden Indicator · Pine v5** — Open source. Inspect and modify for personal use.
- **Trade Logic PDF** — 50-page playbook — entry rules, exits, risk framework.
- **Risk Calculator** — Position sizing and R-multiple tracker.
- **Daily Market Notes** — Pre-market bias — NIFTY, SPX, Gold, BTC.
- **Lifetime Updates** — Every future revision of the script, free.
- **Founder email support** — Replies within 24 hours.

## Not included

- Trading signals or tips
- Guaranteed returns
- Managed account service
- Daily buy/sell alerts

_EasyTradeSetup sells tooling and education. We do not sell calls._

---

# /checkout

## Page header

- Eyebrow: **Reserve early access**
- Title: **Lock in the launch price.**
- Lede: We're in the final days before launch. Reserve your copy today and your email gets the purchase link at the inaugural price — before it moves to retail.

## Risk callout

> **Educational tool, not investment advice.** Golden Indicator is a chart tool, not a signal service. You decide every trade. Past performance does not guarantee future results. Trading in financial instruments involves substantial risk of loss. Indian users — we are not SEBI-registered. Read our full [trading disclaimer](/legal/disclaimer) before purchase.

## Reserve form (step 1)

- Eyebrow: **Step 1 · Reserve**
- Title: **Drop your email. Lock the launch price.**
- Body: Payments go live shortly. Reserving now guarantees you the inaugural price of **[offer]** (retail ~~[retail]~~) and a priority email the moment checkout opens.
- Form: email → **Reserve my copy**
- Bullets:
  - ✓ One email when checkout opens. No drip sequence, no newsletter.
  - ✓ Price locked at reservation — even if we raise it before launch.
  - ✓ Unsubscribe with one click. We don't sell your email.
- PAYMENT METHODS ON LAUNCH: **UPI · Razorpay · Visa · Mastercard · Net Banking · Stripe (Intl)**

## Order preview (sidebar)

- ORDER PREVIEW
- Golden Indicator · complete bundle — Lifetime access · one-time payment
- Retail: ~~[retail]~~
- Offer applied: **Inaugural launch**
- Taxes: Included
- **Launch price: [offer]**
- ✓ 7-day no-questions refund
- ✓ Lifetime updates included
- ✓ One-time payment — no subscription
- ✓ Priority email on launch day

Back link: **← See full pricing**

---

# /compare

## Page header

- Eyebrow: **Compare**
- Title: **Side by side with _the alternatives._**
- Lede: We respect the competition. Every row below is verifiable from public listings. If you spot an error, email welcome@easytradesetup.com and we'll correct it.

## Comparison table (abridged)

Columns: **EasyTradeSetup (Golden Indicator — Recommended)** · LuxAlgo · TrendSpider · YouTuber script

| What you get | EasyTradeSetup | LuxAlgo | TrendSpider | YouTuber script |
|---|---|---|---|---|
| Price on signup | $49 · ₹4,599 (launch) | $39.99 / mo | $58 / mo | Free–₹5,000 |
| 3-year cost | $49 · ₹4,599 (flat) | ~$1,440 | ~$2,088 | Varies heavily |
| Billing model | One-time · lifetime | Monthly sub | Monthly sub | Sub or one-time |
| Pine Script editable | Yes | Obfuscated | N/A (SaaS) | Sometimes |
| Redistribution | Personal use only | Prohibited | Prohibited | Ambiguous |
| Session + regime logic | Yes | Yes | Yes | Rarely |
| Repaint-safe signals | Bar-close only | Bar-close | Bar-close | Often repaints |
| Daily market notes | Included · multi-market | No | No | Often paywalled |
| Risk calculator | Yes | No | No | Rarely |
| Strategy PDF | Yes | No | No | Sometimes |
| Founder accessible | Direct email · 24h | Ticket queue | Ticket queue | DM roulette |
| Signals / trade calls | No — tool only | No | No | Often yes |
| Fake performance claims | None | Restrained | Restrained | Common |
| Refund window | 7 days · no questions | Pro-rated | Pro-rated | Usually none |

## Summary cards

**3-YEAR COST DELTA — Save $1,400–$2,000** — Versus a typical $39-$58/month subscription over 36 months, at the inaugural launch price of [offer].

**OWNERSHIP MODEL — You own it. Forever.** — No renewal emails. No retention dark patterns. No silent upgrade to a pricier tier. The Pine Script lives in your TradingView account.

**WHAT WE DON'T DO — We don't sell calls.** — If you want trade signals, this is not the right product. Golden Indicator is a chart-reading tool for people who want to do their own thinking.

## CTAs

- **Reserve · [offer] →**
- **Read free chapter first**
- 7-DAY REFUND · LIFETIME UPDATES · NO SUBSCRIPTION

## Footnote

Comparison reviewed 2026-04-22. Pricing from public web listings. Third-party names are trademarks of their respective owners and used here for comparison only — no affiliation, no endorsement.

---

# /sample

## Page header

- Eyebrow: **Free sample**
- Title: **A chapter from the playbook. No email required.**
- Lede: This is one setup from the 50-page Trade Logic PDF shipped with Golden Indicator. Same format, same rigour — just ungated so you can judge the quality before you reserve.

## Chapter 4 · Sample — Trade Logic PDF Excerpt

### The Opening Range Breakout — Nifty Futures

A mechanical intraday setup for NSE Nifty futures. Works best during the first 90 minutes after the Indian market open (9:15–10:45 IST) when directional conviction is highest and expiry-gamma pressure is lowest.

### The setup in one sentence

When Nifty futures close a 5-minute bar **outside** the high or low of the first 15-minute range (9:15-9:30 IST), and the Golden Indicator's regime filter agrees, we take the break with a range-width target and a stop at the opposite side of the range.

### Entry rules

01. Mark the high and low of the 9:15-9:30 IST bars. This is the "opening range" (OR).
02. Wait for a 5-minute close outside the OR — long above OR high, short below OR low.
03. Confirm regime: Golden Indicator must show the matching direction. No counter-regime entries.
04. Enter on the open of the next bar. Do not chase within the confirmation bar.

### Exit rules

- ✓ **Target:** project the range width in the direction of the break. OR width = 40 pts → target 40 pts from entry.
- ✓ **Stop:** opposite side of the opening range. Never inside the range.
- ✓ **Time stop:** square off by 15:15 IST regardless of PnL. This is an intraday setup; overnight exposure invalidates the edge.
- ✓ **Scale-out option:** take half at 0.7× range width, trail the remainder with a 1× ATR stop.

### Invalidation

Re-entry back inside the opening range within two 5-minute bars after entry = false breakout. **Exit flat immediately.** Do not average. Do not flip. Record the outcome and stand aside until the next clean setup.

### Why this edge exists

The first 15 minutes in Indian markets absorb the most overnight positioning and macro news flow. A clean break of that range on rising volume typically indicates that one side's stops are being run — and the resulting move is often directional for the first 60-90 minutes before expiry-hedging and profit-taking dampen momentum. The Golden Indicator's regime filter removes the biggest killer of this setup: range-bound chop days where the break fails within the hour.

### Risk framework

| Parameter | Value |
|---|---|
| Risk per trade | 0.5% of account — hard cap |
| Max trades per day | 2 — one long attempt, one short attempt |
| Daily stop loss | -1.5% — stop trading for the day |
| Reward/risk target | ≥ 1.5R on closed trades, net |
| Win rate expectation | 45-55% (edge is in the RR, not the hit rate) |

### What the full PDF contains

- 8 complete setups across intraday, swing, and positional
- Multi-market variants: SPX, BankNifty, XAU, BTC
- Session-timing and expiry-cycle playbooks
- Position-sizing spreadsheet walkthrough
- Journal template for self-review
- Checklists for pre-trade and post-trade hygiene

### Educational disclaimer

**Educational content. Not investment advice.** No strategy wins every trade, and historical descriptions do not guarantee future results. Trading involves substantial risk of loss. See the full [trading disclaimer](/legal/disclaimer).

## Close-out

- Title: **Like the format?**
- Sub: This is one of 8 full setups inside the Trade Logic PDF shipped with Golden Indicator.
- CTAs: **Reserve the full bundle** · See how we compare ›

---

# /docs/faq

## Page header

- Eyebrow: **FAQ**
- Title: **Asked. And answered.**
- Lede: If anything is missing, email welcome@easytradesetup.com and we'll add it.

## Product

### Q: Is this a signal service?

A: No. Golden Indicator is a TradingView chart tool that helps you read regime, momentum, levels, and volume on one pane. You decide when to trade.

### Q: Why pay when free Pine scripts exist on TradingView?

A: Free scripts are usually single-purpose — one moving average, one oscillator, one pattern. Golden Indicator fuses regime, structure, levels, and volume into one decision layer, plus ships the Trade Logic PDF and risk calculator that tie it all together. You're paying for the system, not just the code.

### Q: I already use MA + RSI + volume. Why add this?

A: Then you already know the pain of switching between panes. Golden Indicator replaces that stack with one decision layer — regime-aware, session-aware, volatility-aware. Most users drop 3-5 indicators within a week of installing it.

### Q: Can I modify the Pine Script?

A: Yes. The script is delivered as open source. Modify it for personal use. Redistribution or resale is not permitted.

### Q: Which markets does it work on?

A: Symbol-agnostic. NSE F&O (NIFTY, BANKNIFTY), US equities (SPX, NASDAQ, NYSE), commodities (Gold, Crude, Silver), major forex pairs, and major crypto pairs (BTC, ETH). Any symbol available on TradingView.

### Q: Will it work on my TradingView free plan?

A: Yes. Pine Script runs on every TradingView tier, including the free plan.

## Purchase & delivery

### Q: How do I receive the files?

A: By email, within seconds of payment. The email contains the .pine file, trade-logic PDF, and risk calculator link.

### Q: Do I need to enter card details every month?

A: No. It's a one-time payment. No recurring charges, ever.

### Q: Are taxes included in the price?

A: Yes. India: ₹4,599 inclusive of GST. International: $49 inclusive of applicable taxes.

### Q: Refund policy?

A: 7-day refund window. Email welcome@easytradesetup.com within 7 days of purchase for a full refund — no questions, no forms. See refund policy.

## Technical

### Q: Does it repaint?

A: The script uses bar-close confirmations. Live bars can shift while forming — this is normal Pine Script behavior. For signal fidelity, trigger alerts on bar close only.

### Q: What Pine Script version?

A: v5 — the current supported version on TradingView.

### Q: Will you release updates?

A: Yes. Every update is delivered free to existing customers. The version number bumps each time.

## Legal

### Q: Is this SEBI-registered advice?

A: No. We do not provide investment advice. Golden Indicator is a charting tool. Read the full trading disclaimer.

### Q: Are you a registered research analyst?

A: No. EasyTradeSetup sells software tools, not research. All educational content is for informational purposes only.

---

# /docs/install

## Page header

- Eyebrow: **Docs / Install**
- Title: **Install on TradingView**
- Lede: Ninety seconds, start to finish.

## Before you start

- A TradingView account (the free tier works).
- The `Golden-Indicator.pine` file from your purchase email.

## Step 1 — Open Pine Editor

Log into TradingView, open any chart, then click **Pine Editor** at the bottom of the screen.

## Step 2 — Paste the script

Open `Golden-Indicator.pine` in any text editor, select all (`Ctrl+A`), copy (`Ctrl+C`), and paste into the Pine Editor — replacing the default template.

## Step 3 — Save and add to chart

Click **Save**, give it any name, then click **Add to chart**. The indicator will render immediately.

## Step 4 — Pin it

Open the indicator settings (gear icon), tune inputs to your market and timeframe, then click the **favorites star** to pin it across all charts.

## Troubleshooting

- **"script has errors"** — ensure you pasted the full file, no missing lines.
- **Signals look different from the preview** — Pine Script repaints on non-final bars. Use bar-close signals only.
- **Nothing shows on chart** — try a lower timeframe (15m/5m) with at least 500 bars loaded.

---

# /about

## Page header

- Eyebrow: **About**
- Title: **Built by one trader, for other traders.**

## Why EasyTradeSetup exists

Most TradingView indicators are either beautiful charts with no logic, or dense code with no explanation. Golden Indicator is the opposite: simple on the chart, documented in the code, coherent in the logic.

## What we don't do

- We don't sell trading signals.
- We don't run a Telegram pump group.
- We don't promise returns.
- We don't charge recurring fees.

## What we do

- Write one good Pine Script, and keep improving it.
- Document every setup so you can replicate, not copy.
- Reply to emails within 24 hours.
- Ship pre-market notes every trading day — India plus global (SPX, Gold, BTC).

## The product roadmap

Lean. Always. One indicator, one price, lifetime updates. New strategies are added to the library as they prove themselves. Everything else stays out.

---

# /contact

## Page header

- Eyebrow: **Contact**
- Title: **Talk to a person.**
- Lede: Direct line to the founder. No ticket queue, no chatbot.

## Email card

- EMAIL
- welcome@easytradesetup.com
- Response within 24 hours on business days.

## Before you write

- BEFORE YOU WRITE
- — For install issues, check [docs/install](/docs/install) first.
- — For refund requests, include order ID and reason.
- — For bulk licensing (trading rooms, academies), mention team size.

## Contact form

- QUICK MESSAGE
- Name · Email · Message
- **Send**

---

# /thank-you

> `robots: { index: false }` — not indexed.

- Eyebrow: **Order confirmed**
- H1: **Welcome. Check your inbox.**
- Body: Your Pine Script, Trade Logic PDF, and risk calculator link are on the way — arrival in under 60 seconds. If nothing lands, check spam, then email us.
- CTAs: **Install guide** · **Read the FAQ**

---

# Legal

## /legal/disclaimer

- Eyebrow: **Legal**
- Title: **Trading Disclaimer**
- Lede: Please read carefully before using Golden Indicator.

### High-risk activity

Trading in stocks, futures, options, commodities, forex, and crypto involves substantial risk and is not suitable for every investor. You can lose some or all of your invested capital. Do not trade with money you cannot afford to lose.

### Not investment advice

EasyTradeSetup is a provider of charting software. We are not a SEBI-registered research analyst or investment advisor. Nothing we publish — the indicator, the strategies, the market updates — constitutes investment advice or a recommendation to buy or sell any security.

### No performance guarantees

Past performance of any trading strategy or signal does not guarantee future results. Backtested performance has inherent limitations, including look-ahead bias and the absence of actual execution costs.

### Your responsibility

- You alone are responsible for your trading decisions.
- Consult a qualified advisor before making any investment decision.
- Understand the products you trade — leverage, margin, expiry mechanics, circuit limits.
- Only risk capital you can afford to lose.

### Jurisdiction

Golden Indicator is sold globally. Users are responsible for compliance with their local exchange and regulatory requirements. Indian users trading in NSE or BSE F&O — please note that EasyTradeSetup is not a SEBI-registered research analyst or investment advisor.

## /legal/privacy

- Eyebrow: **Legal**
- Title: **Privacy Policy**
- Lede: Last updated: 2026-04-21

### 1. What we collect

- **Email address** — to deliver your purchase and market updates.
- **Name** — when you use the contact form.
- **Payment metadata** — order ID, amount, timestamp. Card details are never stored on our servers; payment processing is handled by third-party providers.

### 2. How we use it

- To deliver the product you purchased.
- To respond to your messages.
- To send daily market updates (customers only, until you unsubscribe).

### 3. What we don't do

- Sell or rent your data to anyone.
- Track you across the web.
- Run third-party advertising pixels.

### 4. Your rights

Email welcome@easytradesetup.com to request data export or deletion. We'll respond within 30 days.

### 5. Cookies

We use only essential cookies required for site functionality. No analytics or tracking cookies are set without your consent.

## /legal/terms

- Eyebrow: **Legal**
- Title: **Terms of Service**
- Lede: Last updated: 2026-04-21

### 1. Acceptance

By accessing easytradesetup.com or purchasing Golden Indicator, you agree to these terms.

### 2. License

Your purchase grants you a personal, non-transferable license to use the Pine Script for your own trading. You may modify the script for personal use. You may not redistribute, resell, sublicense, or publish it, whether modified or not.

### 3. No investment advice

EasyTradeSetup sells software tools. It does not provide investment advice, trade signals, or portfolio management. Nothing on this site or in the product constitutes a recommendation to buy, sell, or hold any security.

### 4. No guarantees

Past performance is not indicative of future results. Trading carries substantial risk including loss of capital. You trade at your own risk.

### 5. Payment & refunds

Indian customers are billed in Indian Rupees (₹2,499) inclusive of GST. International customers are billed in US Dollars ($49). All applicable taxes are included in the displayed price. Refunds are subject to our refund policy.

> **Note:** this page still references the old ₹2,499 figure. Current price is ₹4,599. Flag for cleanup.

### 6. Limitation of liability

To the fullest extent permitted by law, EasyTradeSetup's total liability for any claim arising from your use of the product is limited to the amount you paid for it.

### 7. Governing law

These terms are governed by the laws of India, where EasyTradeSetup is based. Any dispute, regardless of user jurisdiction, is subject to the exclusive jurisdiction of courts in India. International users agreeing to these terms acknowledge this venue.

## /legal/refund

- Eyebrow: **Legal**
- Title: **Refund Policy**
- Lede: Last updated: 2026-04-21

### 7-day refund window

If the Pine Script fails to install, throws errors on your chart, or does not function as documented, you can request a full refund within 7 days of purchase.

### How to request

1. Email welcome@easytradesetup.com.
2. Include your order ID and a short description of the issue (screenshots help).
3. Refund is processed within 5-7 business days to the original payment method.

### Not eligible

- Change of mind after successful install.
- Dissatisfaction with trading outcomes (the product is a tool, not a signal service).
- Requests made after 7 days from purchase date.

### Why this policy

The product is a one-time digital download. A short refund window gives you enough time to install and evaluate, while protecting the business from serial refund abuse.

---

# SEO — page metadata

## / (root layout)

- **Title (default):** Golden Indicator — one TradingView Pine v5 for any market · EasyTradeSetup
- **Title template:** `%s · EasyTradeSetup`
- **Description:** Golden Indicator fuses market structure, regime bias, key levels, and supply / demand into one non-repainting Pine v5 script. NIFTY, SPX, XAU, BTC, forex. One-time $49 / ₹4,599. 7-day refund.
- **Keywords:** TradingView Pine v5 indicator · no repaint indicator · market structure indicator · price action indicator · NIFTY 50 indicator · BANKNIFTY intraday indicator · SPX indicator · XAU gold indicator · BTC TradingView indicator · supply and demand indicator · Pine Script one-time payment · LuxAlgo alternative · TrendSpider alternative
- **OG title:** Golden Indicator — one TradingView Pine v5 for any market
- **OG description:** Structure, regime, levels, supply / demand — fused on one chart. Bar-close only, no repaint, no signal service.
- **Twitter description:** Bar-close only. No repaint. One-time $49 / ₹4,599. Lifetime.
- **Canonical:** /

## /product

- **Title:** Golden Indicator — TradingView Pine v5 for any market
- **Description:** Golden Indicator fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL), and supply / demand into one non-repainting Pine v5 script. NIFTY, SPX, XAU, BTC.
- **Keywords:** TradingView Pine v5 indicator · no repaint indicator · market structure indicator · NIFTY 50 indicator · BANKNIFTY indicator · price action indicator · supply and demand indicator

## /pricing

- **Title:** Pricing — one-time, lifetime, no subscription
- **Description:** Golden Indicator inaugural launch: $49 / ₹4,599 (retail $149 / ₹13,999). One-time payment, lifetime updates, no recurring fees. 7-day refund.
- **Keywords:** TradingView indicator price · Pine Script one-time payment · no subscription trading indicator · Golden Indicator pricing

## /compare

- **Title:** Golden Indicator vs LuxAlgo, TrendSpider & signal services
- **Description:** Side-by-side: Golden Indicator vs LuxAlgo, TrendSpider, paid signal groups, and YouTuber Pine bundles. Pricing model, repaint behavior, support, claims.
- **Keywords:** Golden Indicator vs LuxAlgo · LuxAlgo alternative · TrendSpider alternative · best TradingView indicator · Pine Script comparison

## /sample

- **Title:** Free sample chapter — Golden Indicator Trade Logic PDF
- **Description:** Free chapter from the Golden Indicator Trade Logic PDF — setup rules, entry logic, invalidation, R-multiple sizing. Ungated. No email required.
- **Keywords:** trading playbook PDF · Pine Script trade logic · NIFTY trading guide · price action rules · free sample chapter

## /docs/faq

- **Title:** FAQ — Golden Indicator questions answered
- **Description:** Golden Indicator FAQ — repaint, signals, markets, timeframes, refunds. Everything traders ask before buying a TradingView Pine v5 indicator.
- **Keywords:** TradingView indicator FAQ · Pine Script questions · no repaint indicator · Golden Indicator refund · NIFTY indicator FAQ

## /docs/install

- **Title:** Install Golden Indicator on TradingView
- **Description:** Step-by-step guide to install Golden Indicator on TradingView. Pine v5, works on free + paid plans. 90-second setup with screenshots.
- **Keywords:** install TradingView indicator · Pine Script install guide · add Pine v5 to TradingView · Golden Indicator setup

## /about

- **Title:** About EasyTradeSetup — Golden Indicator
- **Description:** EasyTradeSetup builds one-off trading tools for working traders. No subscription, no signal rooms, no gurus. Just Pine v5 scripts that read any market.
- **Keywords:** EasyTradeSetup · Golden Indicator founder · independent trading tools

## /contact

- **Title:** Contact — Golden Indicator support
- **Description:** Get in touch with the EasyTradeSetup team. Email welcome@easytradesetup.com — founder replies within 24 hours. Refund, install, feature requests.
- **Keywords:** EasyTradeSetup contact · Golden Indicator support · TradingView indicator help

## /checkout

- **Title:** Reserve early access
- **Description:** Reserve your copy of Golden Indicator at the launch price. $49 / ₹4,599 inaugural — locked in when you join the list.

## /thank-you

- **Title:** Thank you
- **robots:** index: false

## /legal/*

- **Titles:** Trading Disclaimer · Privacy Policy · Terms of Service · Refund Policy

---

# Sitemap

Priorities (from `app/sitemap.ts`):

| Path | Priority | Change frequency |
|---|---|---|
| / | 1.0 | weekly |
| /product | 0.9 | weekly |
| /pricing | 0.9 | weekly |
| /checkout | 0.9 | weekly |
| /compare | 0.8 | monthly |
| /sample | 0.8 | monthly |
| /docs/faq | 0.7 | monthly |
| /docs/install | 0.6 | monthly |
| /about | 0.6 | monthly |
| /contact | 0.5 | monthly |
| /legal/disclaimer | 0.5 | yearly |
| /legal/refund | 0.4 | yearly |
| /legal/terms | 0.3 | yearly |
| /legal/privacy | 0.3 | yearly |

---

# robots.txt

- **User-agent:** `*` — allow `/`, disallow `/api/`, `/thank-you`, `/_next/`, `/test-results/`
- **User-agent:** `GPTBot` — disallow `/`
- **User-agent:** `CCBot` — disallow `/`
- **User-agent:** `Google-Extended` — disallow `/`
- **User-agent:** `anthropic-ai` — disallow `/`
- **User-agent:** `ClaudeBot` — disallow `/`
- **Sitemap:** `https://easytradesetup.com/sitemap.xml`
- **Host:** `https://easytradesetup.com`

---

_End of content snapshot._
