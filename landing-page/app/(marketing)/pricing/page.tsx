import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Price from "@/components/ui/Price";
import PaymentLogos from "@/components/ui/PaymentLogos";
import { ProductJsonLd, PageBreadcrumbs } from "@/components/seo/JsonLd";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — indicator + course + quiz, one-time, lifetime",
  description:
    "Golden Indicator + interactive course + knowledge quiz: $49 / ₹4,599 (retail $149 / ₹13,999) — 67% off, always. One-time payment, lifetime updates, no recurring fees. Master every signal before you trade.",
  keywords: [
    "TradingView indicator price",
    "Pine Script one-time payment",
    "no subscription trading indicator",
    "Golden Indicator pricing",
    "trading indicator with course",
    "indicator with quiz included",
    "Pine Script course bundle price",
  ],
  alternates: { canonical: "/pricing" },
};

const included = [
  { title: "Golden Indicator · Pine v5", desc: "Open source. Inspect and modify for personal use." },
  { title: "Indicator Course + Quiz", desc: "11 interactive lessons + knowledge quiz inside the portal. Mobile-friendly. Master every signal before you trade." },
  { title: "Risk Calculator", desc: "Position sizing and R-multiple tracker." },
  { title: "Daily Market Notes", desc: "Pre-market bias — NIFTY, SPX, Gold, BTC." },
  { title: "Lifetime Updates", desc: "Every future revision of the script, free." },
  { title: "Founder email support", desc: "Replies within 24 hours." },
];

const notIncluded = [
  "Trading signals or tips",
  "Guaranteed returns",
  "Managed account service",
  "Daily buy/sell alerts",
];

export default function PricingPage() {
  return (
    <>
      <ProductJsonLd />
      <PageBreadcrumbs name="Pricing" path="/pricing" />
      <PageHeader
        eyebrow="Pricing"
        title={<>One price. <span className="grad-text-2">Forever.</span></>}
        lede="Indicator + interactive course + knowledge quiz. No tiers, no upsells, no subscription. Buy once, own forever — and learn every signal before you trade."
      />

      <section className="above-bg">
        <div className="container-wide py-14 md:py-20">
          <div className="glass-card p-8 sm:p-10 md:p-16 max-w-[880px] mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: "rgba(43, 123, 255, 0.12)",
                border: "1px solid rgba(43, 123, 255, 0.30)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue motion-safe:animate-pulse" aria-hidden />
              <span className="text-nano font-bold text-blue-soft uppercase tracking-widest">
                {OFFER_LABEL} · {OFFER_TAGLINE}
              </span>
            </div>

            <p className="mt-5 text-caption text-ink-40">
              Retail{" "}
              <span className="line-through decoration-ink-40/60">
                <Price variant="retail" />
              </span>
            </p>
            <div className="mt-3">
              <span className="font-display font-semibold text-[56px] sm:text-[80px] md:text-[96px] leading-none text-ink grad-text not-italic">
                <Price variant="amount" />
              </span>
            </div>
            <p className="mt-2 text-caption text-ink-40">One-time · Taxes included</p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link href="/checkout" className="btn btn-primary btn-lg">
                Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/sample" className="btn btn-outline btn-lg">
                Read free chapter
              </Link>
            </div>
            <p className="mt-5 text-nano font-mono uppercase tracking-widest text-ink-40">
              Instant delivery · Lifetime access · Support tickets, 24h reply
            </p>

            <div className="mt-10 pt-6 hairline-t">
              <PaymentLogos />
            </div>
          </div>
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <div className="glass-card-soft p-8">
              <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
                You get
              </div>
              <ul className="mt-5 space-y-4">
                {included.map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[6px] flex-none" aria-hidden>
                      <path d="M2 7l3 3 7-7" stroke="#22D3EE" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <div className="text-body text-ink font-medium">{f.title}</div>
                      <div className="text-caption text-ink-60">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card-soft p-8">
              <div className="text-micro font-semibold text-ink-40 uppercase tracking-wider">
                Not included
              </div>
              <ul className="mt-5 space-y-3">
                {notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-body text-ink-60">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[7px] flex-none" aria-hidden>
                      <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-caption text-ink-40">
                EasyTradeSetup sells tooling and education. We do not sell calls.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
