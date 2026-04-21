import SectionHeader from "@/components/ui/SectionHeader";

type Candle = { o: number; h: number; l: number; c: number };

const candles: Candle[] = [
  { o: 100, h: 104, l: 99,  c: 103 },
  { o: 103, h: 106, l: 101, c: 102 },
  { o: 102, h: 105, l: 98,  c: 99  },
  { o: 99,  h: 102, l: 96,  c: 101 },
  { o: 101, h: 104, l: 100, c: 103 },
  { o: 103, h: 108, l: 102, c: 107 },
  { o: 107, h: 110, l: 106, c: 109 },
  { o: 109, h: 112, l: 107, c: 108 },
  { o: 108, h: 111, l: 105, c: 106 },
  { o: 106, h: 109, l: 104, c: 108 },
  { o: 108, h: 113, l: 107, c: 112 },
  { o: 112, h: 116, l: 111, c: 115 },
  { o: 115, h: 118, l: 113, c: 114 },
  { o: 114, h: 117, l: 112, c: 116 },
];

const W = 600;
const H = 300;
const PL = 8;
const PR = 8;
const min = 94;
const max = 120;
const cw = (W - PL - PR) / candles.length;
const xFor = (i: number) => PL + i * cw + cw / 2;
const yFor = (p: number) => ((max - p) / (max - min)) * H;

function Candles() {
  return (
    <>
      {candles.map((c, i) => {
        const bull = c.c >= c.o;
        const color = bull ? "#2da44e" : "#d13438";
        const x = xFor(i);
        const bt = yFor(Math.max(c.o, c.c));
        const bh = Math.max(2, Math.abs(yFor(c.o) - yFor(c.c)));
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={yFor(c.h)} y2={yFor(c.l)} stroke={color} strokeWidth="1.2" />
            <rect x={x - cw * 0.35} y={bt} width={cw * 0.7} height={bh} fill={color} rx="0.5" />
          </g>
        );
      })}
    </>
  );
}

function NoisyChart() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" preserveAspectRatio="xMidYMid meet" aria-label="Messy chart with multiple overlapping indicators">
      {/* Noisy grid */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={0} x2={W} y1={(i / 10) * H} y2={(i / 10) * H} stroke="rgba(0,0,0,0.05)" />
      ))}

      {/* Fake RSI line */}
      <path d={`M 0 ${H * 0.2} Q ${W * 0.3} ${H * 0.4}, ${W * 0.5} ${H * 0.25} T ${W} ${H * 0.3}`} stroke="#a04eff" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Fake MACD */}
      <path d={`M 0 ${H * 0.55} Q ${W * 0.25} ${H * 0.7}, ${W * 0.5} ${H * 0.45} T ${W} ${H * 0.55}`} stroke="#ff6b6b" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Fake Stochastic */}
      <path d={`M 0 ${H * 0.7} Q ${W * 0.35} ${H * 0.3}, ${W * 0.6} ${H * 0.8} T ${W} ${H * 0.5}`} stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Fake Bollinger upper */}
      <path d={`M 0 ${yFor(108)} Q ${W * 0.3} ${yFor(112)}, ${W * 0.5} ${yFor(115)} T ${W} ${yFor(118)}`} stroke="#0071e3" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.6" />
      <path d={`M 0 ${yFor(100)} Q ${W * 0.3} ${yFor(103)}, ${W * 0.5} ${yFor(105)} T ${W} ${yFor(110)}`} stroke="#0071e3" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.6" />
      {/* Fake EMAs */}
      <path d={`M 0 ${yFor(102)} Q ${W * 0.4} ${yFor(107)}, ${W} ${yFor(114)}`} stroke="#2da44e" strokeWidth="1.3" fill="none" opacity="0.5" />
      <path d={`M 0 ${yFor(104)} Q ${W * 0.4} ${yFor(109)}, ${W} ${yFor(113)}`} stroke="#ff6b6b" strokeWidth="1.3" fill="none" opacity="0.5" />
      <path d={`M 0 ${yFor(103)} Q ${W * 0.4} ${yFor(108)}, ${W} ${yFor(112)}`} stroke="#a04eff" strokeWidth="1.3" fill="none" opacity="0.5" />
      <path d={`M 0 ${yFor(106)} Q ${W * 0.4} ${yFor(110)}, ${W} ${yFor(115)}`} stroke="#f59e0b" strokeWidth="1.3" fill="none" opacity="0.5" />

      <Candles />

      {/* Noise labels */}
      <g fontSize="8" fontFamily="ui-monospace, monospace" fill="rgba(0,0,0,0.5)">
        <text x={6}   y={14}  fill="#a04eff">RSI 14</text>
        <text x={60}  y={14}  fill="#ff6b6b">MACD(12,26,9)</text>
        <text x={160} y={14}  fill="#f59e0b">STOCH 14</text>
        <text x={230} y={14}  fill="#0071e3">BB 20,2</text>
        <text x={290} y={14}  fill="#2da44e">EMA 9</text>
        <text x={330} y={14}  fill="#ff6b6b">EMA 21</text>
        <text x={378} y={14}  fill="#a04eff">EMA 50</text>
        <text x={425} y={14}  fill="#f59e0b">EMA 200</text>
        <text x={480} y={14}  fill="#000">VWAP</text>
        <text x={515} y={14}  fill="#d13438">SUPERTREND</text>
      </g>
    </svg>
  );
}

function CleanChart() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" preserveAspectRatio="xMidYMid meet" aria-label="Clean chart showing Golden Indicator with one regime zone and one key level">
      <defs>
        <linearGradient id="cleanRegime" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2da44e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2da44e" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={0} x2={W} y1={(i / 5) * H} y2={(i / 5) * H} stroke="rgba(0,0,0,0.04)" strokeDasharray="2 3" />
      ))}

      {/* Single regime zone */}
      <rect x={0} y={yFor(112)} width={W} height={yFor(104) - yFor(112)} fill="url(#cleanRegime)" />
      <line x1={0} x2={W} y1={yFor(108)} y2={yFor(108)} stroke="#2da44e" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      <text x={10} y={yFor(108) - 4} fontSize="9" fill="#2da44e" fontWeight="600">REGIME · UP</text>

      {/* Single key level */}
      <line x1={0} x2={W} y1={yFor(117)} y2={yFor(117)} stroke="#0071e3" strokeWidth="1" opacity="0.6" />
      <text x={10} y={yFor(117) - 4} fontSize="9" fill="#0071e3" fontWeight="600">KEY LEVEL</text>

      <Candles />

      {/* BUY marker */}
      <g>
        <path d={`M ${xFor(5)} ${yFor(candles[5].l) + 14} L ${xFor(5) - 5} ${yFor(candles[5].l) + 22} L ${xFor(5) + 5} ${yFor(candles[5].l) + 22} Z`} fill="#2da44e" />
        <text x={xFor(5)} y={yFor(candles[5].l) + 34} textAnchor="middle" fontSize="8" fill="#2da44e" fontWeight="700">BUY</text>
      </g>
    </svg>
  );
}

export default function CleanVsNoisy() {
  return (
    <section className="bg-surface">
      <div className="container-wide py-16 sm:py-20 md:py-28">
        <SectionHeader
          eyebrow="The difference"
          title={<>The same chart. Two very different traders.</>}
          lede="The problem was never the market. It was everything you stacked on top of it."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <figure className="card-apple overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
              <span className="text-nano font-bold text-muted-soft uppercase tracking-widest">Before</span>
              <span className="text-nano text-muted-faint">10 indicators · 4 opinions · 1 chart</span>
            </div>
            <div className="p-3 sm:p-5 bg-[#fafafc]">
              <NoisyChart />
            </div>
            <figcaption className="px-5 py-4 text-caption text-muted leading-relaxed border-t border-rule">
              Conflicting signals. Lagging lines. Decisions made in doubt.
            </figcaption>
          </figure>

          <figure className="card-apple overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
              <span className="text-nano font-bold text-blue uppercase tracking-widest">After</span>
              <span className="text-nano text-muted-faint">1 indicator · 1 regime · 1 level</span>
            </div>
            <div className="p-3 sm:p-5 bg-surface">
              <CleanChart />
            </div>
            <figcaption className="px-5 py-4 text-caption text-muted leading-relaxed border-t border-rule">
              One regime. One level. One signal that earned the right to be on your chart.
            </figcaption>
          </figure>
        </div>

        <p className="mt-8 sm:mt-10 text-center text-caption text-muted-faint max-w-2xl mx-auto">
          Illustrative. The goal isn&apos;t more information — it&apos;s clearer thinking.
        </p>
      </div>
    </section>
  );
}
