import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Setup guides, risk calculator usage, and frequently asked questions.",
};

const sections = [
  { href: "/docs/install",   title: "TradingView install", desc: "Paste the Pine Script and save it to your account in 90 seconds." },
  { href: "/docs/risk-calc", title: "Risk calculator",     desc: "Size positions based on account size, ATR, and R-multiple targets." },
  { href: "/docs/faq",       title: "FAQ",                 desc: "Everything you wanted to ask before buying." },
  { href: "/docs/changelog", title: "Changelog",           desc: "Every release of Golden Indicator, dated and documented." },
];

export default function DocsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Docs"
        title={<>Everything you need. Nothing you don&apos;t.</>}
        lede="Short guides. No filler. Written by the person who built the script."
      />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="card-apple p-6 sm:p-8 md:p-10 hover:bg-surface-alt transition-colors"
              >
                <h2 className="h-tile">{s.title}</h2>
                <p className="mt-3 text-caption text-muted leading-relaxed">{s.desc}</p>
                <div className="mt-6 link-apple chevron text-caption">Read</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
