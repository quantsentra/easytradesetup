import Link from "next/link";

const included = [
  "TradingView Pine Script v5",
  "8 integrated tools",
  "Any symbol, any timeframe",
  "Trade logic PDF (50+ pages)",
  "Risk calculator (Google Sheets)",
  "Daily pre-market updates",
  "Lifetime updates included",
];

export default function PricingTeaser() {
  return (
    <section className="bg-page">
      <div className="container-wide py-20 md:py-28">
        <div className="card-white p-10 md:p-16 max-w-[900px] mx-auto text-center">
          <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
            One price · One SKU
          </p>
          <h2 className="mt-4 h-hero">
            ₹2,499 once. Yours forever.
          </h2>
          <p className="mt-5 text-body-lg text-muted max-w-xl mx-auto">
            Pine script, Trade-logic PDF, Risk calculator, Daily market updates. Lifetime access.
          </p>

          <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 max-w-xl mx-auto text-left">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-caption text-ink">
                <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] flex-none" aria-hidden>
                  <path d="M2 7l3 3 7-7" stroke="#0071e3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
              Buy ₹2,499
            </Link>
            <Link href="/pricing" className="link-apple chevron">
              See what&apos;s included
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
