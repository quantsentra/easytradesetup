import Link from "next/link";

const faqs: Array<[string, string]> = [
  [
    "Does this work on any TradingView plan?",
    "Yes. The Pine Script v5 indicator runs on every TradingView tier, including the free plan.",
  ],
  [
    "Is this a signal service?",
    "No. Golden Indicator is a chart tool. You decide when to enter and exit. The script helps you see regime, momentum, levels, and volume on one pane.",
  ],
  [
    "Does it work on US stocks and crypto?",
    "Yes. Symbol-agnostic. Tuned for NSE F&O but runs cleanly on US equities, commodities, forex, and major crypto pairs.",
  ],
  [
    "Is the source code open?",
    "The Pine Script is delivered as open source — you can inspect and modify it. Redistribution is not permitted.",
  ],
  [
    "What if I have no TradingView experience?",
    "The install guide walks you through creating a free TradingView account and pasting the script. No coding required.",
  ],
  [
    "How does the refund work?",
    "Email us within 7 days of purchase for a full refund. No questions asked.",
  ],
];

export default function FAQTeaser() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16 items-start">
          <div>
            <div className="eye mb-4">
              <span className="eye-dot" aria-hidden />Frequent questions
            </div>
            <h2 className="h-section">
              Questions before you <span className="grad-text-2">buy.</span>
            </h2>
            <p className="mt-5 body-muted">
              Still need more?{" "}
              <Link href="/contact" className="link-apple">
                Email us
              </Link>{" "}
              — we reply within 24 hours from a human.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {faqs.map(([q, a], i) => (
              <details
                key={i}
                className="group glass-card-soft transition-colors hover:border-rule-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-5">
                  <span className="text-[15px] font-medium text-ink">{q}</span>
                  <span
                    aria-hidden
                    className="w-6 h-6 inline-flex items-center justify-center rounded-full border border-rule-2 text-ink-60 text-base transition-all group-open:text-white group-open:rotate-45 flex-none"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 sm:px-6 pb-5 text-caption text-ink-60 leading-relaxed">
                  {a}
                </p>
              </details>
            ))}

            <div className="mt-4">
              <Link href="/docs/faq" className="link-apple chevron text-caption">
                Read the full FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
