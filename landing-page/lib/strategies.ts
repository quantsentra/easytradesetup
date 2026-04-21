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
    edge: "Session regime filter removes low-volatility chop days.",
    entry: [
      "Trend Regime = UP (green)",
      "Signal Ribbon cross confirmed on 15m close",
      "Volume Surge active in last 3 bars",
      "Entry: break of prior 15m high",
    ],
    exit: [
      "Trail stop at 1x ATR below swing low",
      "Partial target at 1.5R",
      "Full exit on Signal Ribbon flip",
    ],
    invalidation: "Close below Trend Regime mid-line — exit immediately.",
  },
  {
    slug: "ets-orb",
    name: "ETS Opening Range Breakout",
    summary: "First-15-min range breakout for Nifty futures — clean, mechanical, intraday only.",
    market: "NSE — Nifty futures",
    timeframe: "5m / 15m",
    risk: "Medium",
    edge: "Session Timer auto-marks the opening range; no manual draw.",
    entry: [
      "Mark 9:15-9:30 IST high/low",
      "Entry on 5m close above range high (long) or below range low (short)",
      "Trend Regime must agree",
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
    summary: "Counter-trend fade for ranging regimes — only fires when Trend Regime is NEUTRAL.",
    market: "NSE stocks · US equities",
    timeframe: "1h",
    risk: "High",
    edge: "Runs exclusively in ranging regimes identified by the script.",
    entry: [
      "Trend Regime = RANGE",
      "Price at outer Volatility Lens band",
      "Momentum Pulse > 75 (short) or < 25 (long)",
    ],
    exit: [
      "Target: midline of Volatility Lens",
      "Stop: 1.5 ATR beyond entry band",
    ],
    invalidation: "Trend Regime flips to UP or DOWN — exit immediately.",
  },
];

export const findStrategy = (slug: string) => strategies.find((s) => s.slug === slug);
