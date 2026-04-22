import Link from "next/link";
import Price from "@/components/ui/Price";
import PaymentLogos from "@/components/ui/PaymentLogos";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

const included = [
  "Works on stocks, forex, crypto, commodities, and indices",
  "No recurring fees",
  "Instant access",
  "Lifetime updates included",
  "Clear guide included",
  "Built for TradingView users",
];

export default function PricingTeaser() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <div className="card-white p-6 sm:p-10 md:p-16 max-w-[900px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue/10 border border-blue/20 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" aria-hidden />
            <span className="text-nano font-bold text-blue-link uppercase tracking-widest">
              {OFFER_LABEL} · {OFFER_TAGLINE}
            </span>
          </div>

          <h2 className="mt-4 sm:mt-5 h-hero">
            <Price variant="strike-offer" />
          </h2>
          <p className="mt-3 sm:mt-4 text-body-lg text-muted max-w-xl mx-auto">
            Inaugural launch price — over 60% off retail. One payment, yours for life.
          </p>

          <ul className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-xl mx-auto text-left">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-caption text-ink">
                <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] flex-none" aria-hidden>
                  <path d="M2 7l3 3 7-7" stroke="#0071e3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all w-full sm:w-auto"
            >
              <Price variant="cta" />
            </Link>
            <Link href="/pricing" className="link-apple chevron">
              See what&apos;s included
            </Link>
          </div>

          <p className="mt-5 text-caption text-muted-faint">
            One-time payment · Instant delivery · Lifetime access · 7-day refund
          </p>

          <div className="mt-8 pt-8 hairline-t">
            <PaymentLogos />
          </div>
        </div>
      </div>
    </section>
  );
}
