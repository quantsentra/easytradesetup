import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Product — Golden Indicator",
  description: "The 8 integrated tools inside Golden Indicator — trend regime, momentum, levels, session timer, volume surge, volatility, signal ribbon, risk guard.",
};

const tools = [
  { n: "01", name: "Trend Regime", desc: "Adaptive multi-MA filter that distinguishes trending from ranging markets. No more false momentum signals in chop." },
  { n: "02", name: "Momentum Pulse", desc: "RSI and MACD composite normalized to a single 0-100 scale. One number, one decision." },
  { n: "03", name: "Levels Engine", desc: "Daily, weekly, and pivot levels auto-plotted with breakout markers. Cleaner than manual support/resistance." },
  { n: "04", name: "Session Timer", desc: "IST opening-range highlight, US overlap zone, and expiry countdown for F&O. Never miss the high-liquidity windows." },
  { n: "05", name: "Volume Surge", desc: "Detects unusual volume relative to 20-bar average. Flags institutional flow the instant it hits." },
  { n: "06", name: "Volatility Lens", desc: "ATR-based envelope for stop-loss and target sizing. Stops adapt to current volatility, not yesterday's." },
  { n: "07", name: "Signal Ribbon", desc: "Composite of the other seven tools. Confirms entries only when regime, momentum, and volume align." },
  { n: "08", name: "Risk Guard", desc: "Position sizing suggestion based on account size and ATR. Keeps every trade inside your risk budget." },
];

const specs: Array<[string, string]> = [
  ["Language", "Pine Script v5"],
  ["Platform", "TradingView (any plan)"],
  ["Symbols", "NSE · BSE · US · Forex · Crypto"],
  ["Timeframes", "1m → 1W"],
  ["Alerts", "Built-in alertcondition()"],
  ["Delivery", "Email (.pine file + PDF)"],
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Golden Indicator"
        title={<>One Pine Script. Eight integrated tools.</>}
        lede="Built in Pine Script v5 for TradingView. Every tool shares the same bar data, the same chart, the same source of truth — signals never contradict each other."
      />

      <section className="bg-surface">
        <div className="container-wide py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((t) => (
              <div key={t.n} className="card-apple p-10">
                <div className="text-micro font-semibold text-blue-link">{t.n}</div>
                <h3 className="mt-4 h-tile">{t.name}</h3>
                <p className="mt-3 text-caption text-muted leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-page">
        <div className="container-wide py-20">
          <div className="card-white p-10 md:p-14">
            <h2 className="h-tile text-center">Technical specifications</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {specs.map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">{k}</div>
                  <div className="mt-2 h-card">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-wide py-16 text-center">
          <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
            Buy Golden Indicator — ₹2,499
          </Link>
        </div>
      </section>
    </>
  );
}
