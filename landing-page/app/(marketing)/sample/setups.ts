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
  // Optional annotated chart screenshots. One = full-width frame.
  // Two+ = side-by-side gallery (stacks on mobile). Each gets the same
  // brand frame, zoom-to-full-size, and annotation legend.
  images?: Array<{ src: string; alt: string; caption?: string }>;
};

export const SETUPS: Setup[] = [
  {
    id: "india",
    label: "Indian Market",
    short: "India",
    chapter: "Free sample · NIFTY & BANKNIFTY",
    title: "Lifeline Buy — NIFTY & BANKNIFTY",
    symbol: "NIFTY / BANKNIFTY · 5m / 15m · 9:15 IST onward",
    images: [
      {
        src: "/nifty-lifeline.png",
        alt: "NIFTY 50 chart with the Golden Indicator's Lifeline plotted in black and a Buy signal printing above it during the Indian morning session",
        caption: "NIFTY 50",
      },
      {
        src: "/banknifty-lifeline.png",
        alt: "BANKNIFTY chart with the Golden Indicator's Lifeline plotted in black and a Buy signal printing above it",
        caption: "BANKNIFTY",
      },
    ],
    intro:
      "Same Lifeline strategy, tuned for Indian markets. The black trailing line on your chart is the Lifeline — McGinley-derived, smooth in trend, fast on reversal. When a Buy signal prints above it after 9:15 IST and the next candle confirms with a close above the signal, you take the entry, define risk under the Lifeline, and let the trend run. NIFTY for clean intraday momentum, BANKNIFTY when volatility expands.",
    oneLiner: {
      before: "After the Indian market opens, when a Golden Indicator ",
      highlight: "Buy signal prints above the Lifeline",
      mid: " and the next candle closes above that signal candle,",
      after: " enter on the candle that follows the confirmation close, place your stop below the signal candle or the Lifeline, target 1:2 RR — and trail the runner with the Lifeline as far as the move wants to go.",
    },
    entries: [
      "Wait for 9:15 IST. No pre-open entries — the Lifeline drift hasn't reset on the gap.",
      "Identify the black Lifeline plotted by the Golden Indicator on your NIFTY / BANKNIFTY chart. Price above = bullish bias. Price below = stand aside for longs.",
      "Wait for a Buy (B) signal to print above the Lifeline. Signal candle must close — no acting on intra-bar prints.",
      "Confirmation: wait for the next candle to close ABOVE the Buy signal candle's high. No close-above = no trade. This filters out fake signals where price reverses straight back into the Lifeline.",
      "Enter at the open of the candle that follows the confirmation close. Do not chase inside the signal or confirmation candle.",
    ],
    exits: [
      { k: "Stop loss", v: "Below the Buy signal candle low, OR the previous candle low, OR just below the Lifeline — whichever is structurally tightest without being noise. Pick before you enter. Never widen." },
      { k: "Target 1 · book half", v: "1:2 reward-to-risk. Book half. Move the remaining stop to cost (breakeven). The trade is now risk-free." },
      { k: "Target 2 · let it run", v: "Unlimited. Trail the stop below each new Lifeline pivot. Let the runner extend as long as price respects the line. NIFTY trends often deliver 3–5R, BANKNIFTY can deliver more on volatile days." },
      { k: "Hard exit", v: "Close below the Lifeline = trend over. Exit at market regardless of where the trade is. The line is the line in the sand." },
    ],
    invalidation:
      "A close below the Lifeline before Target 1 = the trend has flipped. Exit immediately, take the full 1R loss, and stand aside. Do not average down. Do not flip short on impulse. The Lifeline broke — wait for a fresh setup with a fresh structure.",
    why:
      "The first 60–90 minutes after Indian open absorb overnight positioning, US-close handover, and Asian-session continuation. The Lifeline filters that noise from real direction the way McGinley designed it — slow in trend, fast on reversal. NIFTY runs cleaner intraday momentum; BANKNIFTY expands harder on volatility days and weekly expiries. Same rules, both symbols. The edge isn't in the entry — it's in trusting the line and not bailing early.",
    risk: [
      ["Risk per trade", "2% of account — hard cap. Never bigger."],
      ["3 losses in a row", "Stop trading for the day. Psychology breaks before the math does."],
      ["3 wins in a row", "Stop trading for the day. Lock the day. Heat fades fast on the next trade."],
      ["Reward/risk floor", "1:2 minimum at Target 1. No 1:1, no 1:1.5 — too thin for variance."],
      ["Trail rule", "Above Lifeline → stay long. Lifeline broken → exit. No exceptions."],
    ],
  },

  {
    id: "us",
    label: "US Market",
    short: "US",
    chapter: "Free sample · US 30",
    title: "Lifeline Buy — US 30 (Dow Jones)",
    symbol: "US30 · 5m / 15m · NY session open",
    images: [
      {
        src: "/us30-lifeline.png",
        alt: "US 30 chart with the Golden Indicator's Lifeline plotted in black and a Buy signal printing above it during the New York session open",
      },
    ],
    intro:
      "Simple. Mechanical. High-discipline. Wait for the New York session to open. The black trailing line on your chart — the Lifeline — does the heavy lifting; it's a McGinley-derived momentum tracker that smooths chop yet flips fast on real reversals. When a Buy signal prints above the Lifeline, the path is laid out: enter the next candle, define your risk underneath, and let the trend run as far as the Lifeline holds.",
    oneLiner: {
      before: "Once the New York session opens, when a Golden Indicator ",
      highlight: "Buy signal prints above the Lifeline",
      mid: " and the next candle closes above that signal candle,",
      after: " enter on the candle that follows the confirmation close, place your stop below the signal candle or the Lifeline, target 1:2 RR — and trail the runner with the Lifeline as far as the move wants to go.",
    },
    entries: [
      "Wait for the New York session to open. No pre-NY entries — overnight liquidity is thin and the Lifeline drift hasn't reset.",
      "Identify the black Lifeline plotted by the Golden Indicator. Price above = bullish bias. Price below = stand aside for longs.",
      "Wait for a Buy (B) signal to print above the Lifeline. Signal candle must close — no acting on intra-bar prints.",
      "Confirmation: wait for the next candle to close ABOVE the Buy signal candle's high. No close-above = no trade. This filters out fake signals where price reverses straight back into the Lifeline.",
      "Enter at the open of the candle that follows the confirmation close. Do not chase inside the signal or confirmation candle.",
    ],
    exits: [
      { k: "Stop loss", v: "Below the Buy signal candle low, OR the previous candle low, OR just below the Lifeline — whichever is structurally tightest without being noise. Pick before you enter. Never widen." },
      { k: "Target 1 · book half", v: "1:2 reward-to-risk. Book half. Move the remaining stop to cost (breakeven). The trade is now risk-free." },
      { k: "Target 2 · let it run", v: "Unlimited. Trail the stop below each new Lifeline pivot. Let the runner extend as long as price respects the line. Some days the runner does 5R, 8R, more — that's where the equity curve is built." },
      { k: "Hard exit", v: "Close below the Lifeline = trend over. Exit at market regardless of where the trade is. The line is the line in the sand." },
    ],
    invalidation:
      "A close below the Lifeline before Target 1 = the trend has flipped. Exit immediately, take the full 1R loss, and stand aside. Do not average down. Do not flip short on impulse. The Lifeline broke — wait for a fresh setup with a fresh structure.",
    why:
      "The New York session is when real US institutional flow hits the tape. The Lifeline filters retail-hour noise from genuine direction the way McGinley designed it — slow in trend, fast on reversal. A Buy signal printing above the Lifeline means structural bias and momentum agree. Entries above the line with stops below it produce asymmetric trades: risk one to make 2, 3, 5, even 8R when the trend extends. The edge isn't in the entry. It's in trusting the line and not bailing early.",
    risk: [
      ["Risk per trade", "2% of account — hard cap. Never bigger."],
      ["3 losses in a row", "Stop trading for the day. Psychology breaks before the math does."],
      ["3 wins in a row", "Stop trading for the day. Lock the day. Heat fades fast on the next trade."],
      ["Reward/risk floor", "1:2 minimum at Target 1. No 1:1, no 1:1.5 — too thin for variance."],
      ["Trail rule", "Above Lifeline → stay long. Lifeline broken → exit. No exceptions."],
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
