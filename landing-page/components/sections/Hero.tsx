import Link from "next/link";

const signals = [
  { label: "Regime", value: "UP",    tone: "up" as const },
  { label: "Momentum", value: "68",  tone: "neutral" as const },
  { label: "Volume",   value: "HIGH", tone: "neutral" as const },
];

const stats = [
  { k: "8",      v: "Built-in tools" },
  { k: "Any",    v: "Symbol / TF" },
  { k: "₹2,499", v: "One-time" },
  { k: "∞",      v: "Lifetime" },
];

type Candle = { t: number; o: number; h: number; l: number; c: number };

const candles: Candle[] = [
  { t: 0,  o: 24650, h: 24685, l: 24630, c: 24660 },
  { t: 1,  o: 24660, h: 24695, l: 24640, c: 24672 },
  { t: 2,  o: 24672, h: 24700, l: 24655, c: 24668 },
  { t: 3,  o: 24668, h: 24680, l: 24620, c: 24630 },
  { t: 4,  o: 24630, h: 24650, l: 24605, c: 24645 },
  { t: 5,  o: 24645, h: 24710, l: 24640, c: 24702 },
  { t: 6,  o: 24702, h: 24740, l: 24695, c: 24730 },
  { t: 7,  o: 24730, h: 24758, l: 24720, c: 24722 },
  { t: 8,  o: 24722, h: 24735, l: 24695, c: 24710 },
  { t: 9,  o: 24710, h: 24760, l: 24708, c: 24755 },
  { t: 10, o: 24755, h: 24790, l: 24750, c: 24782 },
  { t: 11, o: 24782, h: 24820, l: 24775, c: 24815 },
  { t: 12, o: 24815, h: 24838, l: 24800, c: 24830 },
  { t: 13, o: 24830, h: 24865, l: 24820, c: 24858 },
  { t: 14, o: 24858, h: 24872, l: 24840, c: 24848 },
  { t: 15, o: 24848, h: 24880, l: 24842, c: 24872 },
];

const volumes = [32, 28, 25, 45, 30, 58, 62, 38, 42, 52, 68, 72, 48, 55, 40, 46];

const CHART_W = 800;
const CHART_H = 360;
const VOL_H = 70;
const PAD_L = 8;
const PAD_R = 60;
const priceMin = 24580;
const priceMax = 24900;
const candleW = (CHART_W - PAD_L - PAD_R) / candles.length;

const xFor = (i: number) => PAD_L + i * candleW + candleW / 2;
const yFor = (p: number) =>
  ((priceMax - p) / (priceMax - priceMin)) * CHART_H;

const lastClose = candles[candles.length - 1].c;
const firstClose = candles[0].c;
const change = (((lastClose - firstClose) / firstClose) * 100).toFixed(2);

export default function Hero() {
  return (
    <section className="relative bg-page overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% 0%, rgba(0,113,227,0.08), transparent 60%)",
        }}
      />

      <div className="container-wide relative pt-12 sm:pt-16 md:pt-24 pb-10 sm:pb-14 md:pb-20 text-center">
        <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator
        </p>

        <h1 className="mt-3 sm:mt-4 h-hero max-w-[20ch] sm:max-w-3xl mx-auto">
          One indicator. Eight tools.<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Every market.
        </h1>

        <p className="mt-4 sm:mt-5 text-body-lg text-muted max-w-xl mx-auto px-2 sm:px-0">
          A proprietary TradingView Pine Script engineered for NSE F&amp;O,
          and just as sharp on global markets.
        </p>

        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 text-body">
          <Link
            href="/checkout"
            className="order-1 sm:order-2 inline-flex items-center justify-center rounded-lg bg-blue text-white px-5 py-2 text-body font-normal hover:brightness-110 transition-all w-full sm:w-auto"
          >
            Buy ₹2,499
          </Link>
          <Link
            href="/product"
            className="order-2 sm:order-1 link-apple chevron"
          >
            Learn more
          </Link>
        </div>

        <p className="mt-3 text-caption text-muted-faint">
          7-day refund · One-time payment · Not SEBI-registered advice
        </p>

        <div className="mt-10 sm:mt-14 md:mt-20 relative mx-auto max-w-[880px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.18), transparent 70%)",
            }}
          />

          <figure className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-surface shadow-card">
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-rule">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-nano sm:text-micro text-muted-faint truncate px-3 font-mono">
                NIFTY 50 · 15m · Golden Indicator
              </div>
              <div className="w-8 sm:w-12" aria-hidden />
            </div>

            <div className="relative bg-surface-alt">
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H + VOL_H + 20}`}
                role="img"
                aria-label={`Illustrative NIFTY 50 15-minute chart showing ${change}% intraday move with Golden Indicator signal overlay`}
                className="w-full h-auto block"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="zoneFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="regimeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2da44e" stopOpacity="0.07" />
                    <stop offset="100%" stopColor="#2da44e" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const y = (i / 5) * CHART_H;
                  const price = priceMax - (i / 5) * (priceMax - priceMin);
                  return (
                    <g key={i}>
                      <line
                        x1={0}
                        x2={CHART_W - PAD_R}
                        y1={y}
                        y2={y}
                        stroke="rgba(0,0,0,0.05)"
                        strokeDasharray="2 3"
                      />
                      <text
                        x={CHART_W - 4}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="rgba(0,0,0,0.4)"
                        fontFamily="ui-monospace, SFMono-Regular, monospace"
                      >
                        {price.toFixed(0)}
                      </text>
                    </g>
                  );
                })}

                <rect
                  x={0}
                  y={yFor(24800)}
                  width={CHART_W - PAD_R}
                  height={yFor(24740) - yFor(24800)}
                  fill="url(#regimeFill)"
                />
                <line
                  x1={0}
                  x2={CHART_W - PAD_R}
                  y1={yFor(24770)}
                  y2={yFor(24770)}
                  stroke="#2da44e"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <text
                  x={10}
                  y={yFor(24770) - 4}
                  fontSize="9"
                  fill="#2da44e"
                  fontWeight="600"
                >
                  REGIME MID
                </text>

                <rect
                  x={0}
                  y={yFor(24880)}
                  width={CHART_W - PAD_R}
                  height={4}
                  fill="url(#zoneFill)"
                />
                <line
                  x1={0}
                  x2={CHART_W - PAD_R}
                  y1={yFor(24880)}
                  y2={yFor(24880)}
                  stroke="#0071e3"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text
                  x={10}
                  y={yFor(24880) - 4}
                  fontSize="9"
                  fill="#0071e3"
                  fontWeight="600"
                >
                  KEY LEVEL · 24,880
                </text>

                {candles.map((c, i) => {
                  const bull = c.c >= c.o;
                  const color = bull ? "#2da44e" : "#d13438";
                  const x = xFor(i);
                  const bodyTop = yFor(Math.max(c.o, c.c));
                  const bodyH = Math.max(2, Math.abs(yFor(c.o) - yFor(c.c)));
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        x2={x}
                        y1={yFor(c.h)}
                        y2={yFor(c.l)}
                        stroke={color}
                        strokeWidth="1.2"
                      />
                      <rect
                        x={x - candleW * 0.35}
                        y={bodyTop}
                        width={candleW * 0.7}
                        height={bodyH}
                        fill={color}
                        rx="0.5"
                      />
                    </g>
                  );
                })}

                {/* Entry signal at candle 5 breakout */}
                <g>
                  <path
                    d={`M ${xFor(5)} ${yFor(candles[5].l) + 20} L ${xFor(5) - 6} ${yFor(candles[5].l) + 30} L ${xFor(5) + 6} ${yFor(candles[5].l) + 30} Z`}
                    fill="#2da44e"
                  />
                  <text
                    x={xFor(5)}
                    y={yFor(candles[5].l) + 43}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#2da44e"
                    fontWeight="700"
                  >
                    BUY
                  </text>
                </g>

                {/* Continuation marker */}
                <circle
                  cx={xFor(10)}
                  cy={yFor(candles[10].c)}
                  r="4"
                  fill="#0071e3"
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                {/* Current price pulse on last candle */}
                <circle
                  cx={xFor(candles.length - 1)}
                  cy={yFor(lastClose)}
                  r="4"
                  fill="#0071e3"
                />
                <circle
                  cx={xFor(candles.length - 1)}
                  cy={yFor(lastClose)}
                  r="10"
                  fill="#0071e3"
                  fillOpacity="0.2"
                >
                  <animate attributeName="r" values="4;14;4" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Last price label */}
                <g transform={`translate(${CHART_W - PAD_R + 2}, ${yFor(lastClose) - 8})`}>
                  <rect width="56" height="16" rx="3" fill="#0071e3" />
                  <text
                    x="28"
                    y="11"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="700"
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {lastClose.toLocaleString("en-IN")}
                  </text>
                </g>

                {/* Volume panel */}
                <g transform={`translate(0, ${CHART_H + 16})`}>
                  <text
                    x={10}
                    y={10}
                    fontSize="9"
                    fill="rgba(0,0,0,0.4)"
                    fontWeight="600"
                  >
                    VOLUME
                  </text>
                  {volumes.map((v, i) => {
                    const bull = candles[i].c >= candles[i].o;
                    const color = bull ? "#2da44e" : "#d13438";
                    const h = (v / 80) * (VOL_H - 10);
                    return (
                      <rect
                        key={i}
                        x={xFor(i) - candleW * 0.35}
                        y={VOL_H - h}
                        width={candleW * 0.7}
                        height={h}
                        fill={color}
                        opacity="0.55"
                      />
                    );
                  })}
                </g>
              </svg>

              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 text-nano sm:text-micro">
                {signals.map((s) => (
                  <span
                    key={s.label}
                    className="bg-surface/95 backdrop-blur px-2 py-1 rounded-md text-ink border border-rule shadow-soft"
                  >
                    {s.label} ·{" "}
                    <span
                      className={
                        s.tone === "up"
                          ? "text-[#2da44e] font-semibold"
                          : "font-semibold"
                      }
                    >
                      {s.value}
                    </span>
                  </span>
                ))}
              </div>

              <div className="absolute top-3 right-3 sm:top-4 sm:right-16 flex items-center gap-1.5 bg-surface/95 backdrop-blur px-2 py-1 rounded-md border border-rule shadow-soft text-nano sm:text-micro">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-pulse" />
                <span className="text-[#2da44e] font-semibold">+{change}%</span>
                <span className="text-muted-faint">· 15m</span>
              </div>
            </div>

            <figcaption className="sr-only">
              Illustrative Golden Indicator readout on a NIFTY 50 15-minute chart. Not a trade recommendation.
            </figcaption>
          </figure>

          <p className="mt-3 text-micro text-muted-faint">
            Illustrative. Not a live feed. Not a trade recommendation.
          </p>
        </div>

        <dl className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule rounded-2xl overflow-hidden border border-rule max-w-2xl mx-auto">
          {stats.map(({ k, v }) => (
            <div key={v} className="bg-page px-3 sm:px-4 py-4 text-center">
              <dt className="sr-only">{v}</dt>
              <dd>
                <span className="block text-display-tile font-semibold text-ink">{k}</span>
                <span className="block mt-0.5 text-caption text-muted-faint">{v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
