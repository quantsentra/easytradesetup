import Link from "next/link";
import Price from "@/components/ui/Price";

const included = [
  "TradingView Pine Script v5",
  "8 integrated tools",
  "Any symbol, any timeframe",
  "Trade logic PDF (50+ pages)",
  "Real TradingView chart screenshots of setups",
  "Risk calculator (web tool)",
  "Daily market notes (India + global)",
  "Lifetime updates included",
];

export default function PricingTeaser() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <div className="card-white p-6 sm:p-10 md:p-16 max-w-[900px] mx-auto text-center">
          <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
            One price · One SKU
          </p>
          <h2 className="mt-3 sm:mt-4 h-hero">
            <Price variant="amount-once" />. Yours forever.
          </h2>
          <p className="mt-4 sm:mt-5 text-body-lg text-muted max-w-xl mx-auto">
            Pine script, Trade-logic PDF, Risk calculator, Daily market updates. Lifetime access.
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
              className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all w-full sm:w-auto"
            >
              <Price variant="cta" />
            </Link>
            <Link href="/pricing" className="link-apple chevron">
              See what&apos;s included
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-caption text-muted-faint">
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2 7l3 3 7-7" stroke="#2da44e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              One-time payment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2 7l3 3 7-7" stroke="#2da44e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Instant email delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2 7l3 3 7-7" stroke="#2da44e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Educational tool only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
