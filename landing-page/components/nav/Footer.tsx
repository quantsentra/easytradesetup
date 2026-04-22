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
      { href: "/research", label: "Research" },
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
      { href: "/docs/install",   label: "TradingView Install" },
      { href: "/docs/risk-calc", label: "Risk Calculator" },
      { href: "/docs/faq",       label: "FAQ" },
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
      <footer className="bg-page hairline-t mt-0">
      <div className="container-wide py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10 md:gap-8 text-caption">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link href="/" className="text-ink font-medium">
              EasyTradeSetup
            </Link>
            <p className="mt-3 text-muted-soft max-w-xs">
              One indicator. Eight tools. Every market.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-muted-faint font-semibold">{col.title}</div>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline-t mt-10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-micro text-muted-faint">
            © {new Date().getFullYear()} EasyTradeSetup. Built by traders, for traders — globally.
          </p>
          <p className="text-micro text-muted-faint max-w-2xl">
            Trading involves risk. Past performance does not guarantee future results. See the full{" "}
            <Link href="/legal/disclaimer" className="link-apple">
              trading disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
