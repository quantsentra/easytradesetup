// Sample setup data — one chapter per market. Used by /sample tabs.
// Keeping shape uniform so a single <SetupCard /> can render any of them.

export type Setup = {
  id: "india" | "us" | "crypto" | "gold";
  label: string;
  short: string;
  chapter: string;
  title: string;
  symbol: string;
  intro: string;
  oneLiner: { highlight: string; before: string; mid?: string; after: string };
  entries: string[];
  exits: Array<{ k: string; v: string }>;
  invalidation: string;
  why: string;
  risk: Array<[string, string]>;
};

export const SETUPS: Setup[] = [
  {
    id: "india",
    label: "Indian Market",
    short: "India",
    chapter: "Chapter 4 · Sample",
    title: "Opening Range Breakout — NIFTY Futures",
    symbol: "NIFTY · 5m / 15m · 9:15–15:15 IST",
    intro:
      "A mechanical intraday setup for NSE Nifty futures. Works best during the first 90 minutes after the Indian market open (9:15–10:45 IST) when directional conviction is highest and expiry-gamma pressure is lowest.",
    oneLiner: {
      before: "When Nifty futures close a 5-minute bar ",
      highlight: "outside",
      mid: " the high or low of the first 15-minute range (9:15–9:30 IST), and the Golden Indicator's regime filter agrees,",
      after: " we take the break with a range-width target and a stop at the opposite side of the range.",
    },
    entries: [
      "Mark the high and low of the 9:15–9:30 IST bars. This is the “opening range” (OR).",
      "Wait for a 5-minute close outside the OR — long above OR high, short below OR low.",
      "Confirm regime: Golden Indicator must show the matching direction. No counter-regime entries.",
      "Enter on the open of the next bar. Do not chase within the confirmation bar.",
    ],
    exits: [
      { k: "Target", v: "Project the range width in the direction of the break. OR width = 40 pts → target 40 pts from entry." },
      { k: "Stop", v: "Opposite side of the opening range. Never inside the range." },
      { k: "Time stop", v: "Square off by 15:15 IST regardless of PnL. Intraday-only — overnight exposure invalidates the edge." },
      { k: "Scale-out", v: "Take half at 0.7× range width, trail the remainder with a 1× ATR stop." },
    ],
    invalidation:
      "Re-entry back inside the opening range within two 5-minute bars after entry = false breakout. Exit flat immediately. Do not average. Do not flip. Record the outcome and stand aside until the next clean setup.",
    why:
      "The first 15 minutes in Indian markets absorb overnight positioning and macro news flow. A clean break of that range on rising volume typically indicates one side's stops are being run — and the resulting move is often directional for the first 60–90 minutes before expiry-hedging and profit-taking dampen momentum. The Golden Indicator's regime filter removes the biggest killer: range-bound chop days where the break fails within the hour.",
    risk: [
      ["Risk per trade", "0.5% of account — hard cap"],
      ["Max trades per day", "2 — one long attempt, one short attempt"],
      ["Daily stop loss", "-1.5% — stop trading for the day"],
      ["Reward/risk target", "≥ 1.5R on closed trades, net"],
      ["Win rate expectation", "45–55% (edge is in the RR, not the hit rate)"],
    ],
  },

  {
    id: "us",
    label: "US Market",
    short: "US",
    chapter: "Chapter 6 · Sample",
    title: "Morning Trend Pullback — S&P 500 Futures (ES)",
    symbol: "ES · 15m · 9:30–16:00 ET",
    intro:
      "A swing-style intraday continuation setup for ES futures (or SPY / SPX index). Targets the second leg of a clean NY-morning trend, after the first impulse fades into a controlled pullback. Avoids the FOMC / CPI / NFP windows where the setup gets steamrolled by news.",
    oneLiner: {
      before: "After a clean NY-morning trend leg, wait for a ",
      highlight: "50% pullback to the 20-EMA",
      mid: " on the 15m chart and a same-direction regime read,",
      after: " then enter on the first reversal bar back in the trend's direction.",
    },
    entries: [
      "Identify a clean trend leg in the first 90 minutes (9:30–11:00 ET) — at least 3 higher-highs / lower-lows.",
      "Wait for a pullback to the 20-EMA reaching ~50% of the leg. No deeper, no shallower.",
      "Confirm regime: Golden Indicator must agree with the trend direction.",
      "Enter on the close of the first reversal bar (bullish engulf / pin in uptrend, mirror in downtrend).",
    ],
    exits: [
      { k: "Target", v: "Prior swing high (long) or swing low (short). Project 1× the impulse leg as a stretch target." },
      { k: "Stop", v: "1 ATR below the pullback low (long) / above pullback high (short). Never inside the EMA cluster." },
      { k: "Time stop", v: "Flat by 15:30 ET. Last 30 minutes are MOC-rebalance noise — outside the edge window." },
      { k: "Scale-out", v: "Take half at the prior swing, trail remainder under each new HL / above each new LH." },
    ],
    invalidation:
      "Two consecutive 15m closes on the wrong side of the 20-EMA after entry = trend has flipped. Exit at market. Do not wait for the stop to fill. The setup is built on continuation; once continuation fails, edge evaporates.",
    why:
      "US index futures show the strongest trend continuity inside the 9:30–11:30 ET window. Institutional rebalancing and ES → SPY arbitrage flow create compounding directional pressure during the first impulse, while the first pullback typically attracts late algo trend-followers buying the dip / shorting the bounce. The Golden Indicator's regime filter screens out range-day false breaks and keeps you out of FOMC / CPI chop where the setup gets shredded.",
    risk: [
      ["Risk per trade", "0.5% of account — hard cap"],
      ["Max trades per day", "2 — one in each direction max"],
      ["Daily stop loss", "-1.5% — stop trading for the day"],
      ["Reward/risk target", "≥ 1.8R (US trends extend further than IN intraday)"],
      ["Win rate expectation", "50–60% — pullback entries reward patience"],
    ],
  },

  {
    id: "crypto",
    label: "Crypto",
    short: "Crypto",
    chapter: "Chapter 7 · Sample",
    title: "Asian Range Breakout — BTC / USDT",
    symbol: "BTC · 1h · London / NY session",
    intro:
      "Crypto trades 24/7 but liquidity is not. The Asian session (00:00–08:00 UTC) accumulates a tight range while London and NY desks are offline. The London open (07:00 UTC) and NY open (13:30 UTC) are when stops above and below that range get run — and the setup captures the directional follow-through.",
    oneLiner: {
      before: "When BTC closes a 1-hour bar ",
      highlight: "outside the Asian session range",
      mid: " (00:00–08:00 UTC) during the London or NY open and the Golden Indicator's regime filter agrees,",
      after: " we take the break with a 1× range projection target and a stop at the opposite side of the range.",
    },
    entries: [
      "At 08:00 UTC mark the high and low of the Asian session (00:00–08:00 UTC).",
      "Wait for a 1-hour close outside that range during London (07:00–11:00 UTC) or NY (13:00–17:00 UTC) windows.",
      "Confirm regime: Golden Indicator must agree with the break direction. No counter-regime entries.",
      "Enter on the open of the next bar. If the bar gaps > 0.4%, skip — the break is already late.",
    ],
    exits: [
      { k: "Target", v: "Project 1× the Asian range width in the direction of the break." },
      { k: "Stop", v: "Opposite side of the Asian range. Never tighten — crypto wicks long." },
      { k: "Time stop", v: "Flat at 17:00 UTC if neither target nor stop hit. Asian session resumes accumulation, edge fades." },
      { k: "Scale-out", v: "Take 40% at 0.6× range, trail remainder under each new 4h HL / above each new 4h LH." },
    ],
    invalidation:
      "Reclaim of the Asian range within the entry hour = trapped break. Exit at market. Crypto wicks are vicious — do not give it room to come back. Re-entry only on a fresh close outside the range during the same window.",
    why:
      "Asian session liquidity is thin. Stops cluster just above and below the overnight range because retail traders place their orders before bed. London and NY desks open into that liquidity void, and the resulting break is amplified by perp-funding and futures-basis arbitrage. The Golden Indicator's regime filter removes the highest-loss scenario: chop days where BTC fakes both sides of the Asian range and burns position-sizers in both directions.",
    risk: [
      ["Risk per trade", "0.25% of account — crypto vol is 2× equity vol"],
      ["Max trades per day", "1 — one window, one attempt"],
      ["Daily stop loss", "-0.75% — stop trading for the day"],
      ["Reward/risk target", "≥ 2R (crypto trends extend, ride them)"],
      ["Win rate expectation", "40–50% — RR carries the curve"],
    ],
  },

  {
    id: "gold",
    label: "Gold",
    short: "Gold",
    chapter: "Chapter 8 · Sample",
    title: "London–NY Overlap Trend — XAU / USD",
    symbol: "XAU · 15m · 13:00–17:00 UTC",
    intro:
      "Gold trends most cleanly during the London–NY overlap (13:00–17:00 UTC) when DXY and US yields are most active. Outside that window XAU mostly drifts. This setup catches the second leg of a clean overlap-window trend after a controlled pullback to the 50-period MA.",
    oneLiner: {
      before: "During the London–NY overlap, after a clean trend leg, wait for a ",
      highlight: "pullback to the 50-period MA",
      mid: " on the 15m chart with the Golden Indicator's regime filter agreeing,",
      after: " then enter on the first rejection bar back in the trend's direction.",
    },
    entries: [
      "Confirm trend structure (HH / HL or LH / LL) on the 1h chart entering 13:00 UTC.",
      "Wait for the 15m chart to pull back and touch the 50-period MA. Wick-touch counts; close-through invalidates.",
      "Confirm regime: Golden Indicator must agree with the trend direction.",
      "Enter on the close of the rejection bar (engulf / pin / inside-bar break). Skip if rejection volume is below the 20-bar average.",
    ],
    exits: [
      { k: "Target", v: "1.5× the prior swing range in the trend direction. Project from entry, not from the swing high/low." },
      { k: "Stop", v: "0.5× ATR beyond the rejection bar's wick. XAU spreads widen on news — give it room." },
      { k: "Time stop", v: "Flat by 17:00 UTC. NY-PM session is when XAU drift starts and the edge dies." },
      { k: "Scale-out", v: "Take 40% at 0.8× target, trail remainder with a 2× ATR stop." },
    ],
    invalidation:
      "A close back through the 50-MA in the wrong direction within 3 bars = pullback became a reversal. Exit at market. Gold reverses fast on Fed-speak headlines — once the setup invalidates, sit out until the next overlap window.",
    why:
      "XAU's largest moves come during the London–NY overlap because that's when DXY and 10Y yield repricing happens. A pullback into the 50-MA in a confirmed trend tends to attract macro funds adding into the position, plus systematic CTAs trading momentum. The Golden Indicator's regime filter screens out range-bound days driven by quiet DXY tape — those days, the pullback never resolves and the setup chops sideways.",
    risk: [
      ["Risk per trade", "0.5% of account — hard cap"],
      ["Max trades per day", "2 — one in each direction max"],
      ["Daily stop loss", "-1.5% — stop trading for the day"],
      ["Reward/risk target", "≥ 1.8R (XAU trends extend through the overlap)"],
      ["Win rate expectation", "45–55% — selectivity beats activity here"],
    ],
  },
];
