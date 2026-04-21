import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Product — Golden Indicator",
  description: "The 8 integrated tools inside Golden Indicator — trend regime, momentum, levels, session timer, volume surge, volatility, signal ribbon, risk guard.",
};

const tools = [
  { n: "01", name: "Trend Regime", desc: "Adaptive multi-MA filter that distinguishes trending from ranging markets. No more false momentum signals in chop." },
  { n: "02", name: "Momentum Pulse", desc: "RSI + MACD composite normalized to a single 0-100 scale. One number, one decision." },
  { n: "03", name: "Levels Engine", desc: "Daily, weekly, and pivot levels auto-plotted with breakout/rejection markers. Cleaner than manual support/resistance." },
  { n: "04", name: "Session Timer", desc: "IST opening-range highlight, US overlap zone, and expiry countdown for F&O. Never miss the high-liquidity windows." },
  { n: "05", name: "Volume Surge", desc: "Detects unusual volume relative to 20-bar average. Flags institutional flow the instant it hits." },
  { n: "06", name: "Volatility Lens", desc: "ATR-based envelope for stop-loss and target sizing. Your stops adapt to current market volatility, not yesterday's." },
  { n: "07", name: "Signal Ribbon", desc: "Composite of the other seven tools. Confirms entries only when regime, momentum, and volume align." },
  { n: "08", name: "Risk Guard", desc: "Position sizing suggestion based on account size and ATR. Keeps every trade inside your risk budget." },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Golden Indicator"
        title={<>One Pine Script. <span className="italic text-gold">Eight</span> integrated tools.</>}
        lede="Built in Pine Script v5 for TradingView. Every tool shares the same bar data, the same chart, the same source of truth — so signals never contradict each other."
      />

      <section className="container-x py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-border border border-ink-border rounded-2xl overflow-hidden">
          {tools.map((t) => (
            <div key={t.n} className="bg-ink-soft p-8 md:p-10">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-5xl text-gold/50">{t.n}</span>
                <span className="h-px flex-1 bg-ink-border" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{t.name}</h3>
              <p className="mt-3 text-cream-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <div className="glass-card p-10 md:p-14 gold-border">
          <div className="label-kicker">Technical specs</div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["Language", "Pine Script v5"],
              ["Platform", "TradingView (any plan)"],
              ["Symbols", "NSE · BSE · US · Forex · Crypto"],
              ["Timeframes", "1m → 1W"],
              ["Alerts", "Built-in alertcondition()"],
              ["Delivery", "Email (.pine file + PDF)"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="label-kicker">{k}</div>
                <div className="mt-2 font-display text-xl">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <Button variant="gold" size="lg" href="/checkout">
          Get Golden Indicator — ₹2,499 →
        </Button>
      </section>
    </>
  );
}
