import Link from "next/link";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Golden Indicator" },
      { href: "/strategy", label: "Strategy Library" },
      { href: "/pricing", label: "Pricing" },
      { href: "/updates", label: "Market Updates" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/install", label: "TradingView Install" },
      { href: "/docs/risk-calc", label: "Risk Calculator" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/refund", label: "Refund Policy" },
      { href: "/legal/disclaimer", label: "Trading Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-ink-border">
      <div className="container-x py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold-gradient">
                <span className="absolute inset-0.5 rounded-full bg-ink" />
                <span className="relative font-display text-gold text-base leading-none">E</span>
              </span>
              <span className="font-display text-lg">
                Easy<span className="italic text-gold">Trade</span>Setup
              </span>
            </Link>
            <p className="mt-4 text-sm text-cream-dim max-w-xs leading-relaxed">
              One indicator. Eight tools. Every market.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="label-kicker">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-cream-muted hover:text-cream transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline mt-16 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-cream-dim font-mono">
            © {new Date().getFullYear()} EasyTradeSetup. Built in India.
          </p>
          <p className="text-xs text-cream-dim max-w-2xl">
            Trading in securities involves risk. Past performance does not guarantee future results.
            See full <Link href="/legal/disclaimer" className="text-cream underline underline-offset-2">trading disclaimer</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
