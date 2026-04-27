import Link from "next/link";
import Price from "@/components/ui/Price";
import PaymentLogos from "@/components/ui/PaymentLogos";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

const included = [
  "Works across TradingView symbols and timeframes",
  "Bar-close logic — no repaint, no flicker",
  "Equities, F&O, forex, crypto, commodities",
  "Lifetime updates — no subscription, ever",
  "Trade Logic PDF + risk calculator included",
  "Pine v5 — runs on the free TradingView plan",
];

export default function PricingTeaser() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <div className="relative max-w-[900px] mx-auto grad-border rounded-[24px] p-6 sm:p-10 md:p-14 text-center overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 40% at 80% 0%, rgba(139,92,246,.2), transparent 70%)",
            }}
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: "rgba(143, 204, 42, 0.10)",
                border: "1px solid rgba(143, 204, 42, 0.35)",
              }}
            >
              <span className="pulse-dot" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-acid">
                {OFFER_LABEL} · {OFFER_TAGLINE}
              </span>
            </div>

            <h2 className="mt-6 h-hero">
              <Price variant="strike-offer" />
            </h2>
            <p className="mt-4 body-muted max-w-xl mx-auto">
              Launch price — 67% off retail, always. One payment, lifetime access. No
              monthly billing, no locked tiers, no recurring charges.
            </p>
            <p className="mt-3 text-caption text-ink-60 max-w-xl mx-auto">
              Designed to reduce chart clutter, improve preparation, and support a more
              disciplined trading process.
            </p>

            <ul className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-xl mx-auto text-left">
              {included.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-caption text-ink">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] flex-none" aria-hidden>
                    <path
                      d="M2 7l3 3 7-7"
                      stroke="#22D3EE"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              <Link href="/checkout" className="btn btn-acid btn-lg w-full sm:w-auto">
                Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg w-full sm:w-auto">
                See full pricing
              </Link>
            </div>

            <p className="mt-5 text-nano font-mono uppercase tracking-widest text-ink-40">
              One-time payment · Instant delivery · Lifetime access · Support tickets, 24h reply
            </p>

            <div className="mt-10 pt-8 hairline-t">
              <PaymentLogos />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
