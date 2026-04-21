import SectionHeader from "@/components/ui/SectionHeader";

const items = [
  {
    n: "01",
    name: "Golden Indicator",
    tag: "Pine Script v5",
    desc: "Proprietary signal engine. Drops into any TradingView chart. Works on any symbol, any timeframe — NIFTY, SPX, Gold, BTC, EUR/USD, any stock.",
  },
  {
    n: "02",
    name: "TradingView Chart Gallery",
    tag: "Real setups",
    desc: "Screenshots of the indicator on live charts across markets — NIFTY, Gold, SPX, crypto, forex. See it before you buy it.",
  },
  {
    n: "03",
    name: "Trade Logic PDF",
    tag: "50+ pages",
    desc: "Entry rules, exit rules, real chart examples, and the risk framework behind every signal.",
  },
  {
    n: "04",
    name: "Risk Calculator",
    tag: "Web tool",
    desc: "Position-sizing calculator using your account size and current volatility. Works in INR, USD, EUR, or any currency. Free lifetime access.",
  },
  {
    n: "05",
    name: "Daily Market Notes",
    tag: "Email",
    desc: "Pre-market bias and post-close recap. India plus global (SPX, Gold, BTC). Delivered every trading day. Free forever.",
  },
  {
    n: "06",
    name: "Lifetime updates",
    tag: "Included",
    desc: "Every future revision of the script delivered free. No paid v2. No tier upgrades. Buy once, keep forever.",
  },
];

export default function Bundle() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="What you get"
          title={<>The complete bundle.</>}
          lede="Proprietary signal engine plus everything you need to run it. No guesswork. No setup headaches."
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
          Internal methodology proprietary. Signal logic not disclosed. Bundle delivered as a
          sealed package — install, run, trade.
        </p>
      </div>
    </section>
  );
}
