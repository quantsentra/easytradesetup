"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Quote = {
  code: "nifty" | "gold" | "us30";
  ticker: string;
  label: string;
  sub: string;
  marketName: string;
  region: "IN" | "GLOBAL" | "US";
  currency: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  marketState: "REGULAR" | "PRE" | "POST" | "CLOSED" | "UNKNOWN";
  isLive: boolean;
  lastUpdate: number;
  series: number[];
  source: "yahoo" | "stooq" | "fallback";
  ok: true;
};

const ROTATE_MS = 5000;
const REFRESH_MS = 30_000;

// Fallback shapes shown before /api/quotes resolves on first paint.
function makeFallback(
  code: Quote["code"],
  ticker: string,
  label: string,
  sub: string,
  marketName: string,
  region: Quote["region"],
  currency: string,
  price: number,
  prevClose: number,
  series: number[],
): Quote {
  const change = price - prevClose;
  return {
    code, ticker, label, sub, marketName, region, currency,
    price, prevClose, change,
    changePct: prevClose ? (change / prevClose) * 100 : 0,
    marketState: "UNKNOWN", isLive: false,
    lastUpdate: Math.floor(Date.now() / 1000),
    series, source: "fallback", ok: true,
  };
}

const FALLBACK: Quote[] = [
  makeFallback("nifty", "^NSEI", "NIFTY 50",   "NSE · India",       "NSE",   "IN",     "INR", 23897.95, 24173.05, [24173, 24130, 24080, 24050, 24010, 23980, 23945, 23920, 23900, 23898]),
  makeFallback("gold",  "GC=F",  "GOLD · GC",   "COMEX · Futures",   "COMEX", "GLOBAL", "USD", 4740.9,   4715.6,   [4715, 4720, 4710, 4725, 4732, 4728, 4735, 4738, 4742, 4740]),
  makeFallback("us30",  "^DJI",  "US 30 · DOW", "Dow Jones · NYSE",  "NYSE",  "US",     "USD", 49230.7,  49085.8,  [49085, 49120, 49150, 49180, 49200, 49215, 49228, 49232, 49230, 49231]),
];

function isIndianTimezone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
  } catch {
    return false;
  }
}

function formatPrice(n: number, currency: string): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatLastSync(unix: number): string {
  const d = new Date(unix * 1000);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function HeroSlider() {
  const [quotes, setQuotes] = useState<Quote[]>(FALLBACK);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reorder once on mount: India timezone -> NIFTY first.
  // Otherwise keep the source order (NIFTY -> GOLD -> US30).
  useEffect(() => {
    if (!isIndianTimezone()) {
      setQuotes((q) => {
        // Already nifty-first; no-op for symmetry.
        return q;
      });
    }
  }, []);

  // Fetch quotes + refresh every 30s.
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/quotes", { cache: "no-store" });
        if (!alive) return;
        if (!res.ok) return;
        const json = await res.json();
        const next: Quote[] = Array.isArray(json?.quotes) ? json.quotes : [];
        if (next.length) {
          // Preserve home-region ordering chosen on mount: source order is
          // already nifty-first which suits IST. For non-IST we surface
          // US30 first so US visitors recognise the index immediately.
          const inIst = isIndianTimezone();
          const sorted = inIst
            ? next
            : [...next].sort((a, b) => regionRank(a.code) - regionRank(b.code));
          setQuotes(sorted);
        }
      } catch {
        /* swallow */
      }
    }
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // Auto-rotate every ROTATE_MS while not paused / not reduced-motion.
  useEffect(() => {
    if (paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % quotes.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, quotes.length]);

  const q = quotes[active];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: "-40px",
          background: "radial-gradient(circle, rgba(34,211,238,0.30), transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="term-frame relative">
        {/* Header */}
        <div className="term-head">
          <div className="term-lights" aria-hidden>
            <span className="r" />
            <span className="y" />
            <span className="g" />
          </div>
          <span className="font-mono text-[10.5px] sm:text-[11px] font-medium uppercase tracking-widest text-ink-40">
            {q.label} · 15m
          </span>
          <span className={`ml-auto chip ${q.isLive ? "chip-acid chip-live" : "chip"}`}>
            {q.isLive ? "LIVE" : `LAST SYNC ${formatLastSync(q.lastUpdate)}`}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 sm:gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
          <span className="stat-num text-[28px] sm:text-[42px] text-ink tabular-nums">
            {formatPrice(q.price, q.currency)}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] sm:text-[12px] font-bold tabular-nums"
            style={{
              background:
                q.change >= 0 ? "rgba(34, 197, 94, 0.12)" : "rgba(217, 59, 59, 0.12)",
              color: q.change >= 0 ? "#22C55E" : "#d93b3b",
            }}
          >
            {q.change >= 0 ? "▲" : "▼"} {q.change >= 0 ? "+" : ""}
            {q.changePct.toFixed(2)}%
          </span>
        </div>

        {/* Chart */}
        <div className="relative px-4 sm:px-5 pb-4 sm:pb-5">
          <span
            className="absolute top-1.5 right-5 sm:top-2 sm:right-7 chip"
            style={{
              background:
                q.change >= 0 ? "rgba(34, 197, 94, 0.12)" : "rgba(217, 59, 59, 0.12)",
              color: q.change >= 0 ? "#22C55E" : "#d93b3b",
              borderColor:
                q.change >= 0 ? "rgba(34, 197, 94, 0.35)" : "rgba(217, 59, 59, 0.35)",
            }}
            aria-hidden
          >
            {q.change >= 0 ? "UPTREND" : "DOWNTREND"}
          </span>

          <SparkSvg series={q.series} positive={q.change >= 0} />

          {/* Slide dots + meta */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2" role="tablist" aria-label="Market preview">
              {quotes.map((qq, i) => (
                <button
                  key={qq.code}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-selected={i === active}
                  aria-label={`Show ${qq.label}`}
                  className="hero-dot"
                  data-active={i === active ? "true" : undefined}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-widest text-ink-40">
              {q.sub}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile-only mini badge row — replaces floating badge on phones */}
      <div className="sm:hidden mt-3 flex items-center justify-center gap-3 font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-acid" aria-hidden />
          Bar-close only
        </span>
        <span className="text-ink-20">·</span>
        <span>No repaint</span>
      </div>

      <p className="mt-3 sm:mt-4 text-center font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
        Live chart preview · Yahoo Finance feed · Not a recommendation
      </p>

      {/* Floating "bar-close only" badge — desktop only */}
      <div
        className="hidden sm:flex absolute -bottom-3 -right-3 lg:-right-5 items-center gap-3 px-3.5 py-2 rounded-xl bg-panel border border-rule-2 z-10"
        style={{ boxShadow: "var(--c-shadow-term)" }}
      >
        <div
          className="w-8 h-8 rounded-full grid place-items-center"
          style={{ background: "rgba(43,123,255,0.16)", color: "#2B7BFF" }}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-ink">Real-time preview</div>
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">
            Auto-rotates · 5s
          </div>
        </div>
      </div>
    </div>
  );
}

function regionRank(code: "nifty" | "gold" | "us30") {
  // Non-IST users: US30 first, then GOLD, then NIFTY.
  return code === "us30" ? 0 : code === "gold" ? 1 : 2;
}

function SparkSvg({ series, positive }: { series: number[]; positive: boolean }) {
  const path = useMemo(() => {
    if (!series.length) return staticPath;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const W = 800, H = 320;
    const step = W / Math.max(series.length - 1, 1);
    const points = series.map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 40) - 20;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return points.join(" ");
  }, [series]);

  // Closed area path (line + drop to bottom corners)
  const areaPath = useMemo(() => {
    if (!series.length) return staticAreaPath;
    return `${path} L800,320 L0,320 Z`;
  }, [path, series.length]);

  const stroke = positive ? "url(#hero-line-pos)" : "url(#hero-line-neg)";

  return (
    <svg
      viewBox="0 0 800 320"
      preserveAspectRatio="none"
      className="w-full h-auto"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-area-pos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22D3EE" stopOpacity="0.45" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-area-neg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d93b3b" stopOpacity="0.30" />
          <stop offset="1" stopColor="#d93b3b" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-line-pos" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2B7BFF" />
          <stop offset="0.55" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#F0C05A" />
        </linearGradient>
        <linearGradient id="hero-line-neg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2B7BFF" />
          <stop offset="0.55" stopColor="#d93b3b" />
          <stop offset="1" stopColor="#f0c05a" />
        </linearGradient>
      </defs>
      <line x1="0" y1="187" x2="800" y2="187" stroke="#2B7BFF" strokeOpacity=".25" strokeDasharray="4 6" strokeWidth="1.5" />
      <line x1="0" y1="107" x2="800" y2="107" stroke="#F0C05A" strokeOpacity=".25" strokeDasharray="4 6" strokeWidth="1.5" />
      <path d={areaPath} fill={positive ? "url(#hero-area-pos)" : "url(#hero-area-neg)"} />
      <path d={path} stroke={stroke} strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Pre-rendered shape used before quotes load (mirrors the old static chart).
const staticPath =
  "M0,240 L40,213 L80,227 L120,187 L160,200 L200,160 L240,173 L280,133 L320,147 L360,120 L400,160 L440,93 L480,107 L520,80 L560,100 L600,67 L640,87 L680,60 L720,53 L760,73 L800,40";
const staticAreaPath = `${staticPath} L800,320 L0,320 Z`;
