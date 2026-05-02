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
        caption: "NIFTY 50 · Buy setup",
      },
      {
        src: "/banknifty-lifeline.png",
        alt: "BANKNIFTY chart with the Golden Indicator's Lifeline plotted in black and a Sell signal printing below it",
        caption: "BANKNIFTY · Sell setup",
      },
    ],
    intro:
      "Same Lifeline strategy, tuned for Indian markets — and it works both ways. The black trailing line on your chart is the Lifeline (McGinley-derived, smooth in trend, fast on reversal). A Buy (B) signal above the Lifeline, confirmed by the next candle closing above it, means take the long. A Sell (S) signal below the Lifeline, confirmed by the next candle closing below it, means take the short. Mirror rules. Same risk framework. NIFTY for clean intraday momentum, BANKNIFTY when volatility expands — and Buy or Sell, whichever the Lifeline tells you.",
    oneLiner: {
      before: "After the Indian market opens, when a Golden Indicator ",
      highlight: "Buy / Sell signal prints on the right side of the Lifeline",
      mid: " and the next candle confirms by closing further in that direction,",
      after: " enter on the candle that follows the confirmation close, place your stop below (long) or above (short) the signal candle or the Lifeline, target 1:2 RR — and trail the runner with the Lifeline as far as the move wants to go.",
    },
    entries: [
      "Wait for 9:15 IST. No pre-open entries — the Lifeline drift hasn't reset on the gap.",
      "Identify the black Lifeline plotted by the Golden Indicator on your NIFTY / BANKNIFTY chart. Price above = look for Buy setups. Price below = look for Sell setups.",
      "Wait for the matching signal: Buy (B) above the Lifeline OR Sell (S) below the Lifeline. Signal candle must close — no acting on intra-bar prints.",
      "Confirmation: next candle must close on the same side as the signal — for Buy, close ABOVE the signal candle's high; for Sell, close BELOW the signal candle's low. No confirmation = no trade. Filters out fake signals where price reverses straight back into the Lifeline.",
      "Enter at the open of the candle that follows the confirmation close. Do not chase inside the signal or confirmation candle.",
    ],
    exits: [
      { k: "Stop loss", v: "For Buy: below the signal candle low, the previous candle low, OR just below the Lifeline. For Sell: above the signal candle high, the previous candle high, OR just above the Lifeline. Pick the structurally tightest level before you enter. Never widen." },
      { k: "Target 1 · book half", v: "1:2 reward-to-risk. Book half. Move the remaining stop to cost (breakeven). The trade is now risk-free." },
      { k: "Target 2 · let it run", v: "Unlimited. Trail the stop along the Lifeline as it pivots. Let the runner extend as long as price respects the line. NIFTY trends often deliver 3–5R; BANKNIFTY can deliver more on volatile days and expiries — both directions." },
      { k: "Hard exit", v: "Price closing back through the Lifeline = trend over. Exit at market regardless of where the trade is. The line is the line in the sand — both for longs and shorts." },
    ],
    invalidation:
      "A close back through the Lifeline before Target 1 = the trend has flipped. Exit immediately, take the full 1R loss, and stand aside. Do not average down. Do not flip on impulse. The Lifeline broke — wait for a fresh setup with a fresh structure on the other side.",
    why:
      "The first 60–90 minutes after Indian open absorb overnight positioning, US-close handover, and Asian-session continuation. The Lifeline filters that noise from real direction the way McGinley designed it — slow in trend, fast on reversal. NIFTY runs cleaner intraday momentum; BANKNIFTY expands harder on volatility days and weekly expiries. Same rules apply both directions: Buy above, Sell below. The edge isn't in the entry — it's in trusting the line and not bailing early.",
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
      ["Trail rule", "Above Lifeline → stay long. Below Lifeline → stay short. Line broken against you → exit. No exceptions."],
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
    chapter: "Free sample · XAU / USD",
    title: "Lifeline Buy — Gold (XAU / USD)",
    symbol: "XAU · 15m · London / NY session",
    images: [
      {
        src: "/xau-lifeline.png",
        alt: "Gold (XAU/USD) 15-minute chart with the Golden Indicator's Lifeline plotted in black and a Buy signal printing above it",
        caption: "XAU / USD · Buy setup",
      },
    ],
    intro:
      "Gold is where the Golden Indicator earns its name — the Lifeline rides XAU's macro-driven trends with rare precision, especially on the 15-minute timeframe. The black trailing line tracks momentum the way McGinley designed it: smooth in trend, fast on reversal. When a Buy signal prints above the Lifeline during London or NY session and the next candle closes above that signal candle, the path is clear: enter, define risk under the line, and let the trend run. 15m is the recommended timeframe for XAU — clean enough to filter noise, fast enough to catch the move.",
    oneLiner: {
      before: "On the XAU 15-minute chart during the London or NY session, when a Golden Indicator ",
      highlight: "Buy signal prints above the Lifeline",
      mid: " and the next candle closes above that signal candle,",
      after: " enter on the candle that follows the confirmation close, place your stop below the signal candle or the Lifeline, target 1:2 RR — and trail the runner with the Lifeline as far as the move wants to go.",
    },
    entries: [
      "Set the chart to XAU / USD on the 15-minute timeframe. This is the suggested timeframe — XAU's structure breathes cleanly here without intra-bar noise.",
      "Wait for London open (07:00 UTC) or NY open (13:00 UTC). XAU drifts in Asia; real direction starts when DXY and US yields wake up.",
      "Identify the black Lifeline plotted by the Golden Indicator. Price above = bullish bias. Price below = stand aside for longs.",
      "Wait for a Buy (B) signal to print above the Lifeline. Signal candle must close — no acting on intra-bar prints.",
      "Confirmation: wait for the next candle to close ABOVE the Buy signal candle's high. No close-above = no trade. This filters fake signals where price reverses straight back into the Lifeline.",
      "Enter at the open of the candle that follows the confirmation close. Do not chase inside the signal or confirmation candle.",
    ],
    exits: [
      { k: "Stop loss", v: "Below the Buy signal candle low, OR the previous candle low, OR just below the Lifeline — whichever is structurally tightest without being noise. XAU spreads widen on news — pick a level that respects that. Pick before you enter. Never widen." },
      { k: "Target 1 · book half", v: "1:2 reward-to-risk. Book half. Move the remaining stop to cost (breakeven). The trade is now risk-free." },
      { k: "Target 2 · let it run", v: "Unlimited. Trail the stop along the Lifeline as it pivots. Gold trends extend through London-NY overlap — runners often deliver 4–6R, sometimes more on yield-driven days. Let the runner run." },
      { k: "Hard exit", v: "Close below the Lifeline = trend over. Exit at market regardless of where the trade is. The line is the line in the sand." },
    ],
    invalidation:
      "A close below the Lifeline before Target 1 = the trend has flipped. Exit immediately, take the full 1R loss, and stand aside. Do not average down. Do not flip on a single Fed-speak headline. The Lifeline broke — wait for a fresh setup with fresh structure.",
    why:
      "XAU's largest moves come during the London-NY overlap because that's when DXY and 10Y yield repricing happens. The 15-minute timeframe is a sweet spot for XAU — slow enough to filter Fed-speak whipsaws, fast enough to catch the move before it's gone. The Lifeline tracks XAU's macro-driven momentum cleanly because XAU trends with conviction once direction is set; it doesn't churn the way equity indices do. Buy signals above the line during overlap windows give the cleanest trades the Golden Indicator produces on any market — the indicator was named for it.",
    risk: [
      ["Risk per trade", "2% of account — hard cap. Never bigger."],
      ["3 losses in a row", "Stop trading for the day. Psychology breaks before the math does."],
      ["3 wins in a row", "Stop trading for the day. Lock the day. Heat fades fast on the next trade."],
      ["Reward/risk floor", "1:2 minimum at Target 1. No 1:1, no 1:1.5 — too thin for variance."],
      ["Trail rule", "Above Lifeline → stay long. Lifeline broken → exit. No exceptions."],
    ],
  },
];
