import Link from "next/link";
import Price from "@/components/ui/Price";
import PaymentLogos from "@/components/ui/PaymentLogos";
import ReservationNotice from "@/components/ui/ReservationNotice";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

const included = [
  "Works on stocks, forex, crypto, commodities, and indices",
  "No recurring fees",
  "Instant access",
  "Lifetime updates included",
  "Clear setup guide included",
  "Built for TradingView users",
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
                background: "rgba(43, 123, 255, 0.12)",
                border: "1px solid rgba(43, 123, 255, 0.30)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue motion-safe:animate-pulse"
                aria-hidden
              />
              <span className="text-nano font-bold text-blue-soft uppercase tracking-widest">
                {OFFER_LABEL} · {OFFER_TAGLINE}
              </span>
            </div>

            <h2 className="mt-6 h-hero">
              <Price variant="strike-offer" />
            </h2>
            <p className="mt-4 body-muted max-w-xl mx-auto">
              Inaugural launch price — over 60% off retail. One payment, yours for life.
            </p>
            <p className="mt-3 text-caption text-ink-60 max-w-xl mx-auto">
              Less than 2 months of a LuxAlgo subscription. One avoided bad trade covers it 10× over.
            </p>

            <div className="mt-6 flex justify-center">
              <ReservationNotice />
            </div>

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
              <Link href="/checkout" className="btn btn-primary btn-lg w-full sm:w-auto">
                Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-lg w-full sm:w-auto">
                See full pricing
              </Link>
            </div>

            <p className="mt-5 text-nano font-mono uppercase tracking-widest text-ink-40">
              One-time payment · Instant delivery · Lifetime access · 7-day refund
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
