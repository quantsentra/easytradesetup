import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Setup guides, risk calculator usage, and frequently asked questions.",
};

const sections = [
  { href: "/docs/install", title: "TradingView install", desc: "Paste the Pine Script and save it to your account in 90 seconds." },
  { href: "/docs/risk-calc", title: "Risk calculator", desc: "Size positions based on account size, ATR, and R-multiple targets." },
  { href: "/docs/faq", title: "FAQ", desc: "Everything you wanted to ask before buying." },
];

export default function DocsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title={<>Everything you need. <span className="italic text-gold">Nothing you don&apos;t.</span></>}
        lede="Short guides. No filler. Written by the same person who built the script."
      />
      <section className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group glass-card p-8 hover:border-gold/50 transition-colors"
            >
              <h2 className="font-display text-2xl group-hover:text-gold transition-colors">{s.title}</h2>
              <p className="mt-3 text-sm text-cream-muted leading-relaxed">{s.desc}</p>
              <div className="mt-6 text-xs font-mono text-gold">Read →</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
