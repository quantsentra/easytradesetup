import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Bundle from "@/components/sections/Bundle";
import Price from "@/components/ui/Price";
import { ProductJsonLd, SoftwareApplicationJsonLd, PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Golden Indicator + Course — TradingView Pine v5 for any market",
  description:
    "Golden Indicator fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL), and supply / demand into one non-repainting Pine v5 script. Plus an interactive 11-lesson course + knowledge quiz inside your portal. NIFTY, SPX, XAU, BTC.",
  keywords: [
    "TradingView Pine v5 indicator",
    "TradingView indicator with course",
    "no repaint indicator",
    "market structure indicator",
    "indicator with quiz",
    "NIFTY 50 indicator",
    "BANKNIFTY indicator",
    "price action indicator",
    "supply and demand indicator",
  ],
  alternates: { canonical: "/product" },
  openGraph: {
    title: "Golden Indicator + Course — one pane, every market",
    description: "Indicator + interactive course + knowledge quiz. Structure, regime, levels, supply / demand — fused on one chart, taught in your portal.",
    url: "https://www.easytradesetup.com/product",
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
    title: "You're not left alone",
    body: "Interactive 11-lesson course + knowledge quiz inside your portal. Master every line, zone, color, and signal before you risk capital. Mobile-friendly.",
  },
  {
    title: "Delivered to your portal",
    body: "Indicator source, course, quiz, risk calculator, and daily market notes — all live in your portal. Sign-in link emailed within seconds of payment.",
  },
];

const specs: Array<[string, string]> = [
  ["Language",   "Pine Script v5"],
  ["Platform",   "TradingView · any plan"],
  ["Symbols",    "NSE · US · Forex · Crypto · Commodities"],
  ["Timeframes", "1m → 1W"],
  ["Alerts",     "Built-in alertcondition()"],
  ["Education",  "11-lesson course + quiz"],
  ["Delivery",   "Portal access · emailed instantly"],
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
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/checkout" className="btn btn-primary btn-lg">
              Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/sample" className="btn btn-outline btn-lg">
              See a free setup
            </Link>
          </div>
          <p className="mt-4 text-nano font-mono uppercase tracking-widest text-ink-40">
            One-time · Lifetime updates · Support tickets, 24h reply
          </p>
        </div>
      </section>
    </>
  );
}
