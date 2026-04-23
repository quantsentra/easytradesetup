import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    n: "01",
    title: "Install",
    body: "Paste the Pine file into TradingView's Pine Editor. Save. 60 seconds, any plan, including free.",
  },
  {
    n: "02",
    title: "Read",
    body: "Regime, structure, levels, and volume render on one pane. No extra indicators, no extra dashboards.",
  },
  {
    n: "03",
    title: "Decide",
    body: "You own the decision. The tool shows the read; your risk, your entry, your call.",
  },
  {
    n: "04",
    title: "Trade",
    body: "Same chart, any market. NIFTY, SPX, Gold, BTC — the filter adapts to regime and session.",
  },
];

export default function TheLoop() {
  return (
    <section className="above-bg bg-bg-2">
      <div className="container-wide py-20 sm:py-24 md:py-28">
        <SectionHeader
          eyebrow="The loop"
          title={
            <>
              Install. Read. <span className="grad-text-2">Decide.</span> Trade.
            </>
          }
          lede="Four moves a day. No alerts blowing up your phone, no signal rooms, no Telegram nags."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="feat-card relative">
              <div
                className="stat-num text-[42px] text-acid leading-none"
                style={{ opacity: 0.45 }}
              >
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.55] text-ink-60">{s.body}</p>
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute top-[52px] -right-3 text-ink-40 text-lg"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
