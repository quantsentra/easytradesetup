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
      <div className="container-x py-20 md:py-28">
        <SectionHeader eyebrow="Questions" title={<>The straight answers.</>} />

        <div className="mt-12 card-apple p-2 md:p-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group border-b border-rule last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5">
                <span className="text-body text-ink font-medium">{f.q}</span>
                <span className="text-blue-link text-[20px] leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-6 text-caption text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/docs/faq" className="link-apple chevron">
            Read full FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
