import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Bundle from "@/components/sections/Bundle";

export const metadata: Metadata = {
  title: "Product — Golden Indicator",
  description:
    "Golden Indicator — a proprietary TradingView Pine Script with an integrated signal engine for NSE F&O and global markets. Pine + PDF + Risk Calculator + daily market updates. One-time ₹2,499.",
};

const promises = [
  {
    n: "01",
    title: "One integrated engine",
    body: "Regime, momentum, levels, volume, and risk — fused into a single proprietary signal. One chart. One source of truth.",
  },
  {
    n: "02",
    title: "Any symbol. Any timeframe.",
    body: "Tuned for NSE F&O, runs cleanly on US equities, commodities, forex, and major crypto. 1-minute to weekly. Your chart, your call.",
  },
  {
    n: "03",
    title: "Zero subscriptions",
    body: "Pay once. Keep the script forever. Lifetime updates included. No feature tiers, no renewal traps.",
  },
  {
    n: "04",
    title: "Delivered sealed",
    body: "Installable Pine file, trade-logic PDF, risk calculator, and daily market updates. Internal methodology proprietary.",
  },
];

const specs: Array<[string, string]> = [
  ["Language",   "Pine Script v5"],
  ["Platform",   "TradingView (any plan)"],
  ["Symbols",    "NSE · BSE · US · Forex · Crypto"],
  ["Timeframes", "1m → 1W"],
  ["Alerts",     "Built-in alertcondition()"],
  ["Delivery",   "Email (.pine file + PDF)"],
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Golden Indicator"
        title={<>One script. One proprietary engine.</>}
        lede="Engineered inside Pine Script v5 for TradingView. Every component shares the same bar data and the same chart — signals never contradict each other, and the methodology stays sealed."
      />

      <section className="bg-surface">
        <div className="container-wide py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {promises.map((p) => (
              <div key={p.n} className="card-apple p-6 sm:p-8 md:p-10">
                <div className="text-micro font-semibold text-blue-link tracking-wider">{p.n}</div>
                <h3 className="mt-3 sm:mt-4 h-tile">{p.title}</h3>
                <p className="mt-3 text-caption text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Bundle />

      <section className="bg-page">
        <div className="container-wide py-16 sm:py-20">
          <div className="card-white p-6 sm:p-10 md:p-14">
            <h2 className="h-tile text-center">Technical specifications</h2>
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
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
        <div className="container-wide py-14 sm:py-16 text-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all"
          >
            Buy Golden Indicator — ₹2,499
          </Link>
        </div>
      </section>
    </>
  );
}
