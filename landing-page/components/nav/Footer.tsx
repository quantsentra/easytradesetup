import Link from "next/link";
import RiskDisclosure from "@/components/ui/RiskDisclosure";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Golden Indicator" },
      { href: "/strategy", label: "Strategy Library" },
      { href: "/pricing", label: "Pricing" },
      { href: "/updates", label: "Market Updates" },
      { href: "/compare", label: "Compare" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/sample", label: "Free Sample" },
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
      { href: "/docs/changelog", label: "Changelog" },
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
    <>
      <RiskDisclosure />
      <footer className="relative z-10 bg-bg-2 border-t border-rule mt-0">
        <div className="container-wide py-12 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10 md:gap-8">
            <div className="col-span-2 sm:col-span-3 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #2B7BFF, #22D3EE)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,.12), 0 4px 12px rgba(43,123,255,.35)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 13l4 4 10-11" />
                  </svg>
                </span>
                <span className="font-display text-[15px] font-semibold text-ink">
                  EasyTradeSetup
                </span>
              </Link>
              <p className="mt-4 text-caption text-ink-40 max-w-xs leading-relaxed">
                One sealed TradingView indicator. Any symbol. Any timeframe. One-time payment, lifetime access.
              </p>
            </div>

            {cols.map((col) => (
              <div key={col.title}>
                <h5 className="text-caption font-semibold text-ink mb-4">{col.title}</h5>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-caption text-ink-40 hover:text-ink transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="hairline-t mt-12 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-nano text-ink-40 font-mono uppercase">
              © {new Date().getFullYear()} EasyTradeSetup · All rights reserved
            </p>
            <p className="text-nano text-ink-40 font-mono uppercase max-w-2xl">
              Not investment advice · Trading involves risk · You decide every trade
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
