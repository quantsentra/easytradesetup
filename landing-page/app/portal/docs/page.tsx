import Link from "next/link";

// Phase-1 docs are authored in MDX in the repo. Sidebar is hardcoded here
// so we can ship v1 without a CMS. Swap in Fumadocs file-based routing
// in the next iteration.
const groups = [
  {
    title: "Getting started",
    items: [
      { slug: "install",        label: "Install on TradingView" },
      { slug: "regime-filter",  label: "How the regime filter works" },
      { slug: "reading-levels", label: "Reading key levels (PDH / PDL / PWH / PWL)" },
    ],
  },
  {
    title: "Setups",
    items: [
      { slug: "opening-range-breakout", label: "Opening Range Breakout · NIFTY" },
      { slug: "trend-pullback",         label: "Trend pullback · SPX / XAU" },
      { slug: "expiry-gamma-fade",      label: "Expiry gamma fade · BANKNIFTY" },
      { slug: "breakout-trap",          label: "Breakout trap · BTC / ETH" },
    ],
  },
  {
    title: "Risk framework",
    items: [
      { slug: "position-sizing",  label: "Position sizing" },
      { slug: "stop-placement",   label: "Stop placement — structure vs ATR" },
      { slug: "daily-loss-limit", label: "Daily loss limits + cool-down rules" },
      { slug: "risk-calculator",  label: "Risk calculator — how to use it" },
    ],
  },
];

export default function PortalDocsIndex() {
  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Strategies · library
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Everything the indicator is thinking.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Read the rules. Copy the checklists. Open a chart. Each entry links the Pine logic to the
        trader-side decision — no mystery, no hidden sauce.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((g) => (
          <section key={g.title} className="glass-card-soft p-6">
            <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
              {g.title}
            </div>
            <ul className="mt-4 flex flex-col gap-2.5">
              {g.items.map((it) => (
                <li key={it.slug}>
                  <Link
                    href={`/portal/docs/${it.slug}`}
                    className="text-[14px] text-ink hover:text-cyan transition-colors"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
