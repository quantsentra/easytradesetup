"use client";
import { useEffect, useState } from "react";

type Candle = { o: number; h: number; l: number; c: number };

type Market = {
  symbol: string;
  timeframe: string;
  priceMin: number;
  priceMax: number;
  candles: Candle[];
  volumes: number[];
  regimeLo: number;
  regimeHi: number;
  regimeMid: number;
  keyLevel: number;
  keyLevelLabel: string;
  locale: string;
  priceLabel?: string;
};

const NIFTY: Market = {
  symbol: "NIFTY 50",
  timeframe: "15m",
  priceMin: 24580,
  priceMax: 24900,
  candles: [
    { o: 24650, h: 24685, l: 24630, c: 24660 },
    { o: 24660, h: 24695, l: 24640, c: 24672 },
    { o: 24672, h: 24700, l: 24655, c: 24668 },
    { o: 24668, h: 24680, l: 24620, c: 24630 },
    { o: 24630, h: 24650, l: 24605, c: 24645 },
    { o: 24645, h: 24710, l: 24640, c: 24702 },
    { o: 24702, h: 24740, l: 24695, c: 24730 },
    { o: 24730, h: 24758, l: 24720, c: 24722 },
    { o: 24722, h: 24735, l: 24695, c: 24710 },
    { o: 24710, h: 24760, l: 24708, c: 24755 },
    { o: 24755, h: 24790, l: 24750, c: 24782 },
    { o: 24782, h: 24820, l: 24775, c: 24815 },
    { o: 24815, h: 24838, l: 24800, c: 24830 },
    { o: 24830, h: 24865, l: 24820, c: 24858 },
    { o: 24858, h: 24872, l: 24840, c: 24848 },
    { o: 24848, h: 24880, l: 24842, c: 24872 },
  ],
  volumes: [32, 28, 25, 45, 30, 58, 62, 38, 42, 52, 68, 72, 48, 55, 40, 46],
  regimeLo: 24740,
  regimeHi: 24800,
  regimeMid: 24770,
  keyLevel: 24880,
  keyLevelLabel: "KEY LEVEL · 24,880",
  locale: "en-IN",
};

const GOLD: Market = {
  symbol: "XAU / USD",
  timeframe: "1h",
  priceMin: 2395,
  priceMax: 2480,
  candles: [
    { o: 2410, h: 2418, l: 2404, c: 2412 },
    { o: 2412, h: 2420, l: 2406, c: 2408 },
    { o: 2408, h: 2415, l: 2400, c: 2413 },
    { o: 2413, h: 2422, l: 2410, c: 2419 },
    { o: 2419, h: 2424, l: 2412, c: 2416 },
    { o: 2416, h: 2432, l: 2415, c: 2430 },
    { o: 2430, h: 2440, l: 2428, c: 2438 },
    { o: 2438, h: 2444, l: 2432, c: 2435 },
    { o: 2435, h: 2442, l: 2430, c: 2440 },
    { o: 2440, h: 2450, l: 2438, c: 2448 },
    { o: 2448, h: 2456, l: 2446, c: 2454 },
    { o: 2454, h: 2462, l: 2450, c: 2460 },
    { o: 2460, h: 2465, l: 2455, c: 2458 },
    { o: 2458, h: 2468, l: 2454, c: 2465 },
    { o: 2465, h: 2470, l: 2460, c: 2463 },
    { o: 2463, h: 2472, l: 2458, c: 2468 },
  ],
  volumes: [28, 32, 36, 40, 30, 52, 60, 42, 38, 55, 65, 70, 50, 58, 44, 52],
  regimeLo: 2435,
  regimeHi: 2450,
  regimeMid: 2442,
  keyLevel: 2470,
  keyLevelLabel: "KEY LEVEL · 2,470",
  locale: "en-US",
};

function detectIndia(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
    const lang = typeof navigator !== "undefined" ? navigator.language || "" : "";
    if (lang.endsWith("-IN") || lang === "hi") return true;
  } catch {
    /* ignored */
  }
  return false;
}

const CHART_W = 800;
const CHART_H = 360;
const VOL_H = 70;
const PAD_L = 8;
const PAD_R = 60;

export default function ChartMockup() {
  const [market, setMarket] = useState<Market>(GOLD);

  useEffect(() => {
    if (detectIndia()) setMarket(NIFTY);
  }, []);

  const { symbol, timeframe, priceMin, priceMax, candles, volumes, regimeHi, regimeLo, regimeMid, keyLevel, keyLevelLabel, locale } = market;
  const candleW = (CHART_W - PAD_L - PAD_R) / candles.length;
  const xFor = (i: number) => PAD_L + i * candleW + candleW / 2;
  const yFor = (p: number) => ((priceMax - p) / (priceMax - priceMin)) * CHART_H;

  const lastClose = candles[candles.length - 1].c;
  const firstClose = candles[0].c;
  const change = (((lastClose - firstClose) / firstClose) * 100).toFixed(2);
  const priceStr = lastClose.toLocaleString(locale, {
    maximumFractionDigits: lastClose < 10000 ? 2 : 0,
    minimumFractionDigits: lastClose < 10000 ? 2 : 0,
  });

  return (
    <figure className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-surface shadow-card">
      <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-rule">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-nano sm:text-micro text-muted-faint truncate px-3 font-mono">
          {symbol} · {timeframe} · Golden Indicator
        </div>
        <div className="w-8 sm:w-12" aria-hidden />
      </div>

      <div className="relative bg-surface-alt">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H + VOL_H + 20}`}
          role="img"
          aria-label={`Illustrative ${symbol} ${timeframe} chart showing ${change}% move with Golden Indicator overlay`}
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
                <line x1={0} x2={CHART_W - PAD_R} y1={y} y2={y} stroke="rgba(0,0,0,0.05)" strokeDasharray="2 3" />
                <text
                  x={CHART_W - 4}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(0,0,0,0.4)"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {price.toLocaleString(locale, {
                    maximumFractionDigits: price < 10000 ? 0 : 0,
                  })}
                </text>
              </g>
            );
          })}

          <rect
            x={0}
            y={yFor(regimeHi)}
            width={CHART_W - PAD_R}
            height={yFor(regimeLo) - yFor(regimeHi)}
            fill="url(#regimeFill)"
          />
          <line
            x1={0}
            x2={CHART_W - PAD_R}
            y1={yFor(regimeMid)}
            y2={yFor(regimeMid)}
            stroke="#2da44e"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x={10} y={yFor(regimeMid) - 4} fontSize="9" fill="#2da44e" fontWeight="600">
            REGIME MID
          </text>

          <rect x={0} y={yFor(keyLevel)} width={CHART_W - PAD_R} height={4} fill="url(#zoneFill)" />
          <line
            x1={0}
            x2={CHART_W - PAD_R}
            y1={yFor(keyLevel)}
            y2={yFor(keyLevel)}
            stroke="#0071e3"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x={10} y={yFor(keyLevel) - 4} fontSize="9" fill="#0071e3" fontWeight="600">
            {keyLevelLabel}
          </text>

          {candles.map((c, i) => {
            const bull = c.c >= c.o;
            const color = bull ? "#2da44e" : "#d13438";
            const x = xFor(i);
            const bodyTop = yFor(Math.max(c.o, c.c));
            const bodyH = Math.max(2, Math.abs(yFor(c.o) - yFor(c.c)));
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={yFor(c.h)} y2={yFor(c.l)} stroke={color} strokeWidth="1.2" />
                <rect x={x - candleW * 0.35} y={bodyTop} width={candleW * 0.7} height={bodyH} fill={color} rx="0.5" />
              </g>
            );
          })}

          <g>
            <path
              d={`M ${xFor(5)} ${yFor(candles[5].l) + 20} L ${xFor(5) - 6} ${yFor(candles[5].l) + 30} L ${xFor(5) + 6} ${yFor(candles[5].l) + 30} Z`}
              fill="#2da44e"
            />
            <text x={xFor(5)} y={yFor(candles[5].l) + 43} textAnchor="middle" fontSize="9" fill="#2da44e" fontWeight="700">
              BUY
            </text>
          </g>

          <circle cx={xFor(10)} cy={yFor(candles[10].c)} r="4" fill="#0071e3" stroke="#fff" strokeWidth="1.5" />

          <circle cx={xFor(candles.length - 1)} cy={yFor(lastClose)} r="4" fill="#0071e3" />
          <circle cx={xFor(candles.length - 1)} cy={yFor(lastClose)} r="10" fill="#0071e3" fillOpacity="0.2">
            <animate attributeName="r" values="4;14;4" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
          </circle>

          <g transform={`translate(${CHART_W - PAD_R + 2}, ${yFor(lastClose) - 8})`}>
            <rect width="60" height="16" rx="3" fill="#0071e3" />
            <text
              x="30"
              y="11"
              textAnchor="middle"
              fontSize="10"
              fill="#fff"
              fontWeight="700"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
            >
              {priceStr}
            </text>
          </g>

          <g transform={`translate(0, ${CHART_H + 16})`}>
            <text x={10} y={10} fontSize="9" fill="rgba(0,0,0,0.4)" fontWeight="600">
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
          {[
            { label: "Regime",   value: "UP",   tone: "up" as const },
            { label: "Momentum", value: "68",   tone: "neutral" as const },
            { label: "Volume",   value: "HIGH", tone: "neutral" as const },
          ].map((s) => (
            <span
              key={s.label}
              className="bg-surface/95 backdrop-blur px-2 py-1 rounded-md text-ink border border-rule shadow-soft"
            >
              {s.label} ·{" "}
              <span className={s.tone === "up" ? "text-[#2da44e] font-semibold" : "font-semibold"}>{s.value}</span>
            </span>
          ))}
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-16 flex items-center gap-1.5 bg-surface/95 backdrop-blur px-2 py-1 rounded-md border border-rule shadow-soft text-nano sm:text-micro">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-pulse" />
          <span className="text-[#2da44e] font-semibold">+{change}%</span>
          <span className="text-muted-faint">· {timeframe}</span>
        </div>
      </div>

      <figcaption className="sr-only">
        Illustrative Golden Indicator readout on a {symbol} {timeframe} chart. Not a trade recommendation.
      </figcaption>
    </figure>
  );
}
