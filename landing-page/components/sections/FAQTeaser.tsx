import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs: Array<[string, string]> = [
  [
    "Is this a signal service?",
    "No. Golden Indicator is a chart tool that helps you read regime, momentum, and key levels. You decide every trade.",
  ],
  [
    "Does it work on all TradingView-compatible markets?",
    "Yes — any symbol available on TradingView. NSE F&O, US equities, commodities, forex, and major crypto pairs all supported out of the box.",
  ],
  [
    "Do I need prior trading experience?",
    "Helpful, but not required. The included guide walks through the rules step by step. You can be up and reading a chart in under an hour.",
  ],
  [
    "Is the source code included?",
    "Yes. The Pine Script is delivered open-source so you can inspect and adapt it to your own chart. Redistribution is not permitted.",
  ],
  [
    "Is this a subscription?",
    "No. One-time payment. No auto-renewals, no hidden fees, no tiered upgrades. You own the product for life.",
  ],
  [
    "How do I access the files after purchase?",
    "Everything — indicator, PDF, risk calculator link, and market-notes subscription — arrives in your inbox within seconds of payment.",
  ],
];

export default function FAQTeaser() {
  return (
    <section className="bg-surface">
      <div className="container-x py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="Questions"
          title={<>Straight answers.</>}
        />

        <div className="mt-10 sm:mt-12 card-apple p-2 md:p-3">
          {faqs.map(([q, a], i) => (
            <details
              key={i}
              className="group border-b border-rule last:border-b-0 [&>summary]:list-none [&_summary::-webkit-details-marker]:hidden [&_summary::marker]:content-['']"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer px-4 sm:px-6 py-4 sm:py-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue">
                <span className="text-body text-ink font-medium">{q}</span>
                <span
                  aria-hidden
                  className="text-blue-link text-[20px] leading-none transition-transform group-open:rotate-45 flex-none"
                >
                  +
                </span>
              </summary>
              <p className="px-4 sm:px-6 pb-5 sm:pb-6 text-caption text-muted leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link href="/docs/faq" className="link-apple chevron">
            Read full FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
