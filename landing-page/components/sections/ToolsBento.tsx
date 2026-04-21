import SectionHeader from "@/components/ui/SectionHeader";

const tools = [
  {
    n: "01",
    name: "Trend Regime",
    desc: "Adaptive multi-MA filter that identifies bull, bear, and range regimes in real time.",
    span: "md:col-span-2 md:row-span-2",
  },
  { n: "02", name: "Momentum Pulse", desc: "RSI + MACD composite.", span: "md:col-span-1" },
  { n: "03", name: "Levels Engine", desc: "Auto S/R + pivots.", span: "md:col-span-1" },
  { n: "04", name: "Session Timer", desc: "IST opening-range + US overlap.", span: "md:col-span-2" },
  { n: "05", name: "Volume Surge", desc: "Unusual flow detector.", span: "md:col-span-1" },
  { n: "06", name: "Volatility Lens", desc: "ATR-sized stops.", span: "md:col-span-1" },
  { n: "07", name: "Signal Ribbon", desc: "Composite entry/exit.", span: "md:col-span-1" },
  { n: "08", name: "Risk Guard", desc: "Position sizing & invalidation.", span: "md:col-span-1" },
];

export default function ToolsBento() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHeader
        kicker="The 8 tools"
        title={<>Everything on <span className="italic text-gold">one</span> chart.</>}
        lede="Each tool runs natively inside the Pine Script. No separate subscriptions. No conflicting signals. One coherent view."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {tools.map((t) => (
          <div
            key={t.n}
            className={`group relative glass-card p-6 overflow-hidden hover:border-gold/40 transition-colors ${t.span}`}
          >
            <div className="absolute -top-4 -right-4 font-display text-[140px] leading-none text-gold/5 group-hover:text-gold/10 transition-colors select-none">
              {t.n}
            </div>
            <div className="relative h-full flex flex-col justify-between">
              <div className="label-kicker">Tool {t.n}</div>
              <div>
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 text-sm text-cream-muted leading-relaxed">{t.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
