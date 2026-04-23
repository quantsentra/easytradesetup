const markets = [
  "NIFTY 50",
  "BANK NIFTY",
  "SPX 500",
  "NASDAQ 100",
  "DOW JONES",
  "XAU / USD",
  "SILVER",
  "CRUDE OIL",
  "BTC / USD",
  "ETH / USD",
  "EUR / USD",
  "GBP / JPY",
  "NIFTY WEEKLY",
  "BANKNIFTY WEEKLY",
];

export default function MarketsMarquee() {
  return (
    <section className="above-bg relative py-6 sm:py-7">
      <div className="relative border-y border-rule bg-bg-2">
        <div className="container-wide flex items-stretch py-0">
          {/* Static label — solid bg, sits above track */}
          <div
            className="relative z-20 flex items-center gap-2 flex-shrink-0 pr-8 py-5 bg-bg-2"
            style={{
              boxShadow: "12px 0 18px -8px var(--c-bg-2)",
            }}
          >
            <span className="pulse-dot" aria-hidden />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-40 whitespace-nowrap">
              Reads any symbol on TradingView
            </span>
          </div>

          {/* Marquee track — overflow-hidden so it can't bleed */}
          <div className="relative flex-1 overflow-hidden py-5">
            <div className="marquee-track">
              {[...markets, ...markets].map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-[-0.01em] text-ink-60 whitespace-nowrap"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-ink-20"
                    aria-hidden
                  />
                  {m}
                </span>
              ))}
            </div>

            {/* Right-edge fade */}
            <div
              aria-hidden
              className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10"
              style={{
                background: "linear-gradient(-90deg, var(--c-bg-2), transparent)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
