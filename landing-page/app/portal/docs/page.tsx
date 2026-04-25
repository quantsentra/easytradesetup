import Link from "next/link";

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
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Strategy library.</h1>
          <div className="tz-topbar-sub">
            Read the rules. Copy the checklists. Each entry links the Pine logic to the trader-side decision.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((g) => (
          <section key={g.title} className="tz-card">
            <div className="tz-card-title mb-4">{g.title}</div>
            <ul className="flex flex-col">
              {g.items.map((it) => (
                <li key={it.slug}
                  style={{ borderTop: "1px solid var(--tz-border)" }}
                  className="first:border-t-0">
                  <Link
                    href={`/portal/docs/${it.slug}`}
                    className="block py-2.5 text-[14px] transition-colors hover:pl-1"
                    style={{ color: "var(--tz-ink)" }}
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
