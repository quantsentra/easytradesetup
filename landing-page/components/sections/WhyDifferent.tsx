import SectionHeader from "@/components/ui/SectionHeader";

const layers = [
  { label: "Structure",      desc: "HH / HL / BOS / CHoCH — reads the chart the way a technical analyst does." },
  { label: "Trend context",  desc: "Trending, ranging, or losing momentum — classified per bar close." },
  { label: "Key levels",     desc: "PDH / PDL / PWH / PWL and session levels — plotted, not hunted." },
  { label: "Supply / demand",desc: "Reaction zones where size previously entered the book." },
  { label: "Pullback logic", desc: "Flags cleaner re-entries so you're not chasing extended moves." },
  { label: "Risk process",   desc: "Stop-placement and sizing guidance — capital-first, not chart-first." },
];

export default function WhyDifferent() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="Why it's different"
          title={
            <>
              Not another buy / sell indicator.{" "}
              <span className="grad-text-2">A full chart-reading system.</span>
            </>
          }
          lede="Most indicators show one thing — a moving average, an oscillator, a signal arrow. Golden Indicator is built as a complete decision-support layer, so you're reading the full chart condition, not depending on one signal."
        />

        <div className="mt-10 sm:mt-14 max-w-[840px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layers.map((l, i) => (
            <div
              key={l.label}
              className="glass-card-soft p-5 flex items-start gap-4"
            >
              <span
                className="stat-num text-[22px] leading-none text-cyan"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="font-display text-[16px] font-semibold text-ink">
                  {l.label}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-60">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40 max-w-2xl mx-auto">
          Six layers · One pane · One read · Your decision
        </p>
      </div>
    </section>
  );
}
