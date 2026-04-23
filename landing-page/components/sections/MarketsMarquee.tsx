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
    <section className="above-bg relative overflow-hidden py-6 sm:py-7">
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 z-20 w-24 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #05070F, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 z-20 w-24 pointer-events-none"
        style={{
          background: "linear-gradient(-90deg, #05070F, transparent)",
        }}
      />

      <div
        className="relative"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          background: "#080C1A",
        }}
      >
        <div className="container-wide flex items-center gap-10 py-5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="pulse-dot" aria-hidden />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-40 whitespace-nowrap">
              Reads any symbol on TradingView
            </span>
          </div>

          <div className="marquee-track flex-1">
            {[...markets, ...markets].map((m, i) => (
              <span
                key={`${m}-${i}`}
                className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-[-0.01em] text-ink-60 whitespace-nowrap"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "rgba(237, 241, 250, 0.18)" }}
                  aria-hidden
                />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
