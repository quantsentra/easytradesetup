import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Bundle from "@/components/sections/Bundle";
import Price from "@/components/ui/Price";
import ReservationNotice from "@/components/ui/ReservationNotice";
import { ProductJsonLd, SoftwareApplicationJsonLd, PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Golden Indicator — TradingView Pine v5 for any market",
  description:
    "Golden Indicator fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL), and supply / demand into one non-repainting Pine v5 script. NIFTY, SPX, XAU, BTC.",
  keywords: [
    "TradingView Pine v5 indicator",
    "no repaint indicator",
    "market structure indicator",
    "NIFTY 50 indicator",
    "BANKNIFTY indicator",
    "price action indicator",
    "supply and demand indicator",
  ],
  alternates: { canonical: "/product" },
  openGraph: {
    title: "Golden Indicator — one pane, every market",
    description: "Structure, regime, levels, supply / demand — fused on one chart.",
    url: "https://easytradesetup.com/product",
    type: "website",
  },
};

const promises = [
  {
    title: "One integrated engine",
    body: "Regime, momentum, levels, volume, and risk — fused into a single proprietary signal layer. One chart, one read.",
  },
  {
    title: "Any symbol. Any timeframe.",
    body: "Runs cleanly on NSE F&O, US equities, commodities, forex, and major crypto. From 1-minute to weekly.",
  },
  {
    title: "Zero subscriptions",
    body: "Pay once. Keep the script forever. Lifetime updates included. No feature tiers, no renewal traps.",
  },
  {
    title: "Delivered sealed",
    body: "Pine file, Trade Logic PDF, risk calculator, and daily market notes — by email within seconds.",
  },
];

const specs: Array<[string, string]> = [
  ["Language",   "Pine Script v5"],
  ["Platform",   "TradingView · any plan"],
  ["Symbols",    "NSE · US · Forex · Crypto · Commodities"],
  ["Timeframes", "1m → 1W"],
  ["Alerts",     "Built-in alertcondition()"],
  ["Delivery",   "Email · .pine + PDF"],
];

export default function ProductPage() {
  return (
    <>
      <ProductJsonLd />
      <SoftwareApplicationJsonLd />
      <PageBreadcrumbs name="Product" path="/product" />
      <PageHeader
        eyebrow="Golden Indicator"
        title={<>One script. <span className="grad-text-2">One decision layer.</span></>}
        lede="Built inside Pine Script v5 for TradingView. Every component shares the same bar data and the same chart — signals never contradict each other."
      />

      <section className="above-bg">
        <div className="container-wide py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {promises.map((p) => (
              <div key={p.title} className="glass-card-soft p-6 sm:p-8">
                <h3 className="h-card">{p.title}</h3>
                <p className="mt-3 text-caption text-ink-60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Bundle />

      <section className="above-bg">
        <div className="container-wide py-14 sm:py-20">
          <div className="glass-card p-8 sm:p-10 md:p-14">
            <h2 className="h-tile text-center">Technical specs</h2>
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {specs.map(([k, v]) => (
                <div key={k} className="text-center">
                  <dt className="text-micro font-semibold text-ink-40 uppercase tracking-wider">{k}</dt>
                  <dd className="mt-2 text-body text-ink font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-14 sm:py-16 text-center">
          <ReservationNotice />
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/checkout" className="btn btn-primary btn-lg">
              Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/sample" className="btn btn-outline btn-lg">
              Read a free chapter
            </Link>
          </div>
          <p className="mt-4 text-nano font-mono uppercase tracking-widest text-ink-40">
            One-time · Lifetime updates · 7-day refund
          </p>
        </div>
      </section>
    </>
  );
}
