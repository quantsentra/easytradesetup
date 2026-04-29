import { fetchLiveQuotes, formatPrice, formatChange, type LiveQuote } from "@/lib/market-data";
import { resolveHomeMarket } from "@/lib/geo";

// Static symbols that ride along without live quotes — the ticker still
// signals "we read any market", even without paid indices / forex data.
// Two orderings so the visitor's home market shows up first in the marquee.
const STATIC_IN_FIRST = [
  "NIFTY 50",
  "BANK NIFTY",
  "NIFTY WEEKLY",
  "SPX 500",
  "NASDAQ 100",
  "DOW JONES",
  "XAU / USD",
  "SILVER",
  "CRUDE OIL",
  "EUR / USD",
  "GBP / JPY",
];
const STATIC_GLOBAL_FIRST = [
  "SPX 500",
  "NASDAQ 100",
  "DOW JONES",
  "XAU / USD",
  "SILVER",
  "CRUDE OIL",
  "EUR / USD",
  "GBP / JPY",
  "NIFTY 50",
  "BANK NIFTY",
  "NIFTY WEEKLY",
];

export default async function MarketsMarquee() {
  const [live, market] = await Promise.all([fetchLiveQuotes(), resolveHomeMarket()]);
  const staticSymbols = market === "in" ? STATIC_IN_FIRST : STATIC_GLOBAL_FIRST;

  return (
    <section aria-label="Markets ticker" className="relative">
      <div className="relative border-b border-rule bg-bg-2">
        <div className="container-wide flex items-stretch">
          {/* Static label — sits above scrolling track */}
          <div
            className="relative z-20 flex items-center gap-2 flex-shrink-0 pr-6 py-3 bg-bg-2"
            style={{ boxShadow: "12px 0 18px -8px var(--c-bg-2)" }}
          >
            <span className="pulse-dot" aria-hidden />
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-40 whitespace-nowrap">
              {live.length > 0 ? "Live markets" : "Reads any symbol on TradingView"}
            </span>
          </div>

          {/* Marquee track */}
          <div className="relative flex-1 overflow-hidden py-3">
            <div className="marquee-track">
              {[...Array(2)].flatMap((_, dup) => [
                ...live.map((q) => <LiveTick key={`live-${q.symbol}-${dup}`} q={q} />),
                ...staticSymbols.map((s) => <StaticTick key={`st-${s}-${dup}`} symbol={s} />),
              ])}
            </div>
            <div
              aria-hidden
              className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
              style={{ background: "linear-gradient(-90deg, var(--c-bg-2), transparent)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveTick({ q }: { q: LiveQuote }) {
  const up = q.changePct >= 0;
  return (
    <span className="flex items-center gap-2 font-display text-[14px] font-semibold tracking-[-0.01em] text-ink whitespace-nowrap">
      <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-acid"
        style={{ background: "rgba(143, 204, 42, 0.14)", border: "1px solid rgba(143, 204, 42, 0.35)" }}>
        LIVE
      </span>
      <span>{q.symbol}</span>
      <span className="font-mono text-[13px] tabular-nums text-ink-60">
        {formatPrice(q.price)}
      </span>
      <span
        className={`font-mono text-[11.5px] font-bold tabular-nums ${up ? "text-up" : "text-dn"}`}
        style={{ color: up ? "#22C55E" : "#EF4444" }}
      >
        {up ? "▲" : "▼"} {formatChange(q.changePct)}
      </span>
    </span>
  );
}

function StaticTick({ symbol }: { symbol: string }) {
  return (
    <span className="flex items-center gap-2 font-display text-[14px] font-semibold tracking-[-0.01em] text-ink-60 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-20" aria-hidden />
      {symbol}
    </span>
  );
}
