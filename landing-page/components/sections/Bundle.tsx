import SectionHeader from "@/components/ui/SectionHeader";

type Item = {
  n: string;
  name: string;
  desc: string;
  tag: "included" | "new" | "soon";
  tagLabel: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    n: "01",
    name: "Golden Indicator",
    tag: "included",
    tagLabel: "Pine Script v5",
    desc: "TradingView Pine v5 indicator covering structure, levels, trend regime, supply / demand, and pullback context.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19V7m5 12v-6m5 6V10m5 9V5" />
      </svg>
    ),
  },
  {
    n: "02",
    name: "Trade Logic PDF",
    tag: "included",
    tagLabel: "50+ pages",
    desc: "A practical trading playbook — entries, exits, invalidation, risk, and trade planning. Rules you can read once and apply the next morning.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2Z" />
        <path d="M9 9h7M9 13h5" />
      </svg>
    ),
  },
  {
    n: "03",
    name: "Risk Calculator",
    tag: "new",
    tagLabel: "New",
    desc: "Position sizing and R-multiple tracker. Protect capital before chasing P&L.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    n: "04",
    name: "Install Guide",
    tag: "included",
    tagLabel: "Step-by-step",
    desc: "TradingView setup guide with screenshots. Works on the free TradingView plan. Indicator running in under 90 seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    n: "05",
    name: "Lifetime Updates",
    tag: "included",
    tagLabel: "No subscription",
    desc: "Future improvements included — no monthly billing, no re-purchase. Your access grows with the product.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
  },
  {
    n: "06",
    name: "Founder Support",
    tag: "included",
    tagLabel: "Email",
    desc: "Direct email support for installation and product questions. Reply within 24 hours, from the founder.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

export default function Bundle() {
  return (
    <section className="above-bg">
      <div className="container-wide py-20 sm:py-24 md:py-28">
        <SectionHeader
          eyebrow="What you get"
          title={
            <>
              Six components. <span className="grad-text-2">One clean workflow.</span>
            </>
          }
          lede={
            <>
              The indicator, the playbook, the risk tool, the setup guide, lifetime updates,
              and founder-direct support — bundled for one payment. No upsells, no feature
              tiers, no hunting across twelve scripts for the one piece that actually works.
            </>
          }
        />

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((it) => (
            <article key={it.n} className="feat-card">
              <div className="flex items-start justify-between">
                <div className="stat-num text-[32px] text-acid leading-none">{it.n}</div>
                <div
                  className="w-11 h-11 rounded-lg grid place-items-center flex-shrink-0"
                  style={{
                    background: "rgba(143, 204, 42, 0.14)",
                    color: "#8FCC2A",
                  }}
                  aria-hidden
                >
                  {it.icon}
                </div>
              </div>

              <h3 className="mt-10 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {it.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span
                  className={
                    it.tag === "new"
                      ? "chip chip-new"
                      : it.tag === "soon"
                      ? "chip chip-soon"
                      : "chip"
                  }
                >
                  {it.tagLabel}
                </span>
              </div>

              <p className="mt-4 text-[14px] leading-[1.55] text-ink-60 flex-1">{it.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[13px] text-ink-60">
          <span className="inline-flex items-center gap-2">
            <span className="text-acid">✓</span>Lifetime updates included
          </span>
          <Dot />
          <span className="inline-flex items-center gap-2">
            <span className="text-acid">✓</span>Delivered by email
          </span>
          <Dot />
          <span className="inline-flex items-center gap-2">
            <span className="text-acid">✓</span>Installable in under 60 seconds
          </span>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="w-1 h-1 rounded-full bg-ink-40" aria-hidden />;
}
