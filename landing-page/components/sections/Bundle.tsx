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
    desc: "One signal engine replacing a dozen cluttered indicators. Bar-close only — no repaint, no mid-bar flicker.",
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
    desc: "Entries, exits, risk framework — in plain language. Rules you can read once and apply the next morning.",
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
    desc: "Position sizing and R-multiple tracker tuned to your account currency. Protect capital before chasing P&L.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    n: "04",
    name: "Daily Market Notes",
    tag: "soon",
    tagLabel: "Coming Soon",
    desc: "Pre-market bias: NIFTY, SPX, Gold, BTC. Levels, gamma, session timing. Delivered before the open.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
];

export default function Bundle() {
  return (
    <section className="above-bg">
      <div className="container-wide py-20 sm:py-24 md:py-28">
        <SectionHeader
          eyebrow="The kit"
          title={
            <>
              Four instruments. <span className="grad-text-2">One sealed workflow.</span>
            </>
          }
          lede={
            <>
              Regime, structure, entry, and pullback logic fused into a single non-repainting
              engine. No upsells, no feature tiers, no hunting across twelve scripts for the
              one piece that actually works.
            </>
          }
        />

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
