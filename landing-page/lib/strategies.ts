export type Strategy = {
  slug: string;
  name: string;
  summary: string;
  market: string;
  timeframe: string;
  risk: "Low" | "Medium" | "High";
  edge: string;
  entry: string[];
  exit: string[];
  invalidation: string;
};

export const strategies: Strategy[] = [
  {
    slug: "ets-momentum",
    name: "ETS Momentum",
    summary: "Trend-following setup for Nifty and BankNifty futures that rides strong directional days.",
    market: "NSE F&O — Nifty, BankNifty",
    timeframe: "15m",
    risk: "Medium",
    edge: "Built-in regime filter skips low-volatility chop days automatically.",
    entry: [
      "Golden Indicator shows bullish regime",
      "Confirmation signal prints on 15m close",
      "Volume flag active in last 3 bars",
      "Entry: break of prior 15m high",
    ],
    exit: [
      "Trail stop at 1× ATR below swing low",
      "Partial target at 1.5R",
      "Full exit on signal flip",
    ],
    invalidation: "Close below indicator mid-line — exit immediately.",
  },
  {
    slug: "ets-orb",
    name: "ETS Opening Range Breakout",
    summary: "First-15-min range breakout for Nifty futures — clean, mechanical, intraday only.",
    market: "NSE — Nifty futures",
    timeframe: "5m / 15m",
    risk: "Medium",
    edge: "Opening range and session markers are auto-drawn by Golden Indicator — no manual draw.",
    entry: [
      "Mark 9:15-9:30 IST high/low",
      "Entry on 5m close above range high (long) or below range low (short)",
      "Indicator regime must agree",
    ],
    exit: [
      "Target: range width projected",
      "Stop: opposite side of range",
      "Time stop: square off by 3:15 PM IST",
    ],
    invalidation: "Re-entry into range within 2 bars — exit flat.",
  },
  {
    slug: "ets-mean-reversion",
    name: "ETS Mean Reversion",
    summary: "Counter-trend fade for ranging regimes — only fires when Golden Indicator flags NEUTRAL.",
    market: "NSE stocks · US equities",
    timeframe: "1h",
    risk: "High",
    edge: "Runs exclusively in ranging regimes identified by the indicator.",
    entry: [
      "Golden Indicator regime = RANGE",
      "Price at outer volatility band",
      "Momentum reading above 75 (short) or below 25 (long)",
    ],
    exit: [
      "Target: volatility-band midline",
      "Stop: 1.5 ATR beyond entry band",
    ],
    invalidation: "Indicator regime flips to UP or DOWN — exit immediately.",
  },
];

export const findStrategy = (slug: string) => strategies.find((s) => s.slug === slug);
