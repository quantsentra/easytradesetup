import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs = [
  {
    q: "Is this a signal service?",
    a: "No. Golden Indicator is a chart tool. You still decide when to enter and exit. The script helps you see regime, momentum, levels, and volume on one pane.",
  },
  {
    q: "Does it work on US stocks and crypto?",
    a: "Yes. It is symbol-agnostic. Tuned for NSE F&O, but runs cleanly on US equities, commodities, forex, and major crypto pairs.",
  },
  {
    q: "Is the source code open?",
    a: "The Pine Script is delivered as open source — you can inspect, modify, and adapt it to your style. Redistribution is not permitted.",
  },
  {
    q: "What if I have no TradingView experience?",
    a: "The install guide walks you through creating a free TradingView account and pasting the script. No coding required.",
  },
];

export default function FAQTeaser() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHeader kicker="Questions" title={<>The <span className="italic text-gold">straight</span> answers.</>} />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="group glass-card p-6 open:border-gold/40 transition-colors [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
              <span className="font-display text-xl">{f.q}</span>
              <span className="mt-1 text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-cream-muted leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/docs/faq" className="link-underline text-sm text-cream-muted hover:text-cream">
          Read full FAQ →
        </Link>
      </div>
    </section>
  );
}
