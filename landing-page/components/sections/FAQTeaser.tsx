import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs = [
  {
    q: "Is this a signal service?",
    a: "No. Golden Indicator is a chart tool. You decide when to enter and exit. The script helps you see regime, momentum, levels, and volume on one pane.",
  },
  {
    q: "Does it work on US stocks and crypto?",
    a: "Yes. Symbol-agnostic. Tuned for NSE F&O but runs cleanly on US equities, commodities, forex, and major crypto pairs.",
  },
  {
    q: "Is the source code open?",
    a: "The Pine Script is delivered as open source — you can inspect and modify it. Redistribution is not permitted.",
  },
  {
    q: "What if I have no TradingView experience?",
    a: "The install guide walks you through creating a free TradingView account and pasting the script. No coding required.",
  },
];

export default function FAQTeaser() {
  return (
    <section className="bg-surface">
      <div className="container-x py-16 sm:py-20 md:py-28">
        <SectionHeader eyebrow="Questions" title={<>The straight answers.</>} />

        <div className="mt-10 sm:mt-12 card-apple p-2 md:p-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group border-b border-rule last:border-b-0 [&>summary]:list-none [&_summary::-webkit-details-marker]:hidden [&_summary::marker]:content-['']"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer px-4 sm:px-6 py-4 sm:py-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue">
                <span className="text-body text-ink font-medium">{f.q}</span>
                <span
                  aria-hidden
                  className="text-blue-link text-[20px] leading-none transition-transform group-open:rotate-45 flex-none"
                >
                  +
                </span>
              </summary>
              <p className="px-4 sm:px-6 pb-5 sm:pb-6 text-caption text-muted leading-relaxed">{f.a}</p>
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
