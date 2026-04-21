import SectionHeader from "@/components/ui/SectionHeader";

const tools = [
  { n: "01", name: "Trend Regime", desc: "Adaptive multi-MA filter. Identifies bull, bear, and range regimes in real time." },
  { n: "02", name: "Momentum Pulse", desc: "RSI + MACD composite normalized to one 0-100 number." },
  { n: "03", name: "Levels Engine", desc: "Auto daily, weekly, and pivot levels with breakout markers." },
  { n: "04", name: "Session Timer", desc: "IST opening range, US overlap, expiry countdown — auto-marked." },
  { n: "05", name: "Volume Surge", desc: "Unusual volume detector against 20-bar average." },
  { n: "06", name: "Volatility Lens", desc: "ATR-based envelope for stop-loss and target sizing." },
  { n: "07", name: "Signal Ribbon", desc: "Composite confirmation across regime, momentum, and volume." },
  { n: "08", name: "Risk Guard", desc: "Position sizing based on account size and current ATR." },
];

export default function ToolsBento() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-20 md:py-28">
        <SectionHeader
          eyebrow="The 8 tools"
          title={<>Everything on one chart.</>}
          lede="Each tool runs natively inside the Pine Script. No separate subscriptions. No conflicting signals. One coherent view."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <div
              key={t.n}
              className="card-apple p-8 flex flex-col min-h-[220px]"
            >
              <div className="text-micro font-semibold text-blue-link">{t.n}</div>
              <h3 className="mt-4 h-card">{t.name}</h3>
              <p className="mt-2 text-caption text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
