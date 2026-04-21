import SectionHeader from "@/components/ui/SectionHeader";

const items = [
  {
    n: "01",
    name: "Golden Indicator",
    tag: "Pine Script v5",
    desc: "See where real buyers and sellers are active. One signal engine replaces a dozen cluttered indicators.",
  },
  {
    n: "02",
    name: "TradingView Chart Gallery",
    tag: "Real setups",
    desc: "Learn how professionals read the same chart you're looking at. Real markets, annotated.",
  },
  {
    n: "03",
    name: "Trade Logic PDF",
    tag: "50+ pages",
    desc: "Clear rules. No guessing. No confusion. Entries, exits, and the risk framework in plain language.",
  },
  {
    n: "04",
    name: "Risk Calculator",
    tag: "Web tool",
    desc: "Protect your capital before you chase profits. Position sizing in your own currency, built in.",
  },
  {
    n: "05",
    name: "Daily Market Notes",
    tag: "Email",
    desc: "Know what matters before the market opens. India plus global — SPX, Gold, BTC.",
  },
  {
    n: "06",
    name: "Lifetime Updates",
    tag: "Included",
    desc: "The system evolves as markets evolve. Every future revision delivered to you, free of charge.",
  },
];

export default function Bundle() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="What you get"
          title={<>Everything you need. Nothing you don&apos;t.</>}
          lede="No more switching indicators. No more conflicting signals. Just one system that shows you what actually matters."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((it) => (
            <div
              key={it.n}
              className="card-apple p-6 sm:p-8 md:p-10 flex flex-col transition-colors hover:bg-[#eeeef1]"
            >
              <div className="flex items-center justify-between">
                <div className="text-micro font-semibold text-blue-link tracking-wider">{it.n}</div>
                <div className="text-nano uppercase tracking-wider text-muted-faint">{it.tag}</div>
              </div>
              <h3 className="mt-3 sm:mt-4 h-card">{it.name}</h3>
              <p className="mt-2 sm:mt-3 text-caption text-muted leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 sm:mt-12 text-center text-caption text-muted-faint max-w-2xl mx-auto">
          Delivered as a sealed package. Installable in under a minute. Yours for life.
        </p>
      </div>
    </section>
  );
}
