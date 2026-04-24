import SectionHeader from "@/components/ui/SectionHeader";

type Capability = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const capabilities: Capability[] = [
  {
    title: "Market Structure",
    desc: "Higher highs, higher lows, lower highs, lower lows. Break-of-structure and possible trend shifts — annotated in real time.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 17l4-6 4 4 4-8 4 6 2-2" />
      </svg>
    ),
  },
  {
    title: "Trend Regime",
    desc: "Is the market trending, ranging, bullish, bearish, or losing momentum? One-glance classification, bar-close confirmed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l5 3" />
      </svg>
    ),
  },
  {
    title: "Key Levels",
    desc: "Previous day / week highs and lows, session levels, and historical reaction areas — plotted automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    title: "Supply & Demand",
    desc: "Zones where institutional buying or selling pressure previously entered the market. Colour-coded, filtered by age.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="6" rx="1" />
        <rect x="3" y="13" width="18" height="6" rx="1" />
      </svg>
    ),
  },
  {
    title: "Pullback Context",
    desc: "Avoid chasing extended moves. Wait for the indicator to flag cleaner re-entry into structure before you commit.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12l4 4 4-8 4 4 6-6" />
        <path d="M17 6l4 0 0 4" />
      </svg>
    ),
  },
  {
    title: "Risk Awareness",
    desc: "Included risk framework and calculator help you size positions with discipline, not feel. Defined stops, defined size.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function WhatItShows() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="What it shows"
          title={
            <>
              What Golden Indicator <span className="grad-text-2">helps you see.</span>
            </>
          }
          lede="Six decision-support layers on one pane — each built to answer a specific question about the chart in front of you."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {capabilities.map((c) => (
            <article key={c.title} className="feat-card">
              <div
                className="w-11 h-11 rounded-lg grid place-items-center"
                style={{
                  background: "rgba(34, 211, 238, 0.14)",
                  color: "#22D3EE",
                }}
                aria-hidden
              >
                {c.icon}
              </div>
              <h3 className="mt-5 font-display text-[19px] font-semibold tracking-[-0.015em] text-ink">
                {c.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-ink-60">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
