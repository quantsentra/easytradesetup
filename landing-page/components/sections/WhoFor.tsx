import SectionHeader from "@/components/ui/SectionHeader";

type Lane = {
  tag: string;
  title: string;
  who: string;
  outcome: string;
  markets: string;
};

const lanes: Lane[] = [
  {
    tag: "Intraday",
    title: "Scalpers & day traders",
    who: "You trade 5-min or 15-min on NIFTY, BankNifty, or SPX futures and want cleaner reads after the open.",
    outcome: "Opening-range bias, regime shifts, and volatility zones — drawn before you enter.",
    markets: "NIFTY · BANKNIFTY · SPX · NASDAQ",
  },
  {
    tag: "Swing",
    title: "Swing & positional traders",
    who: "You hold for days to weeks on equities, gold, or crypto and want fewer false breakouts.",
    outcome: "Structural regime filter stops you from buying into distribution or fading a trend.",
    markets: "Equities · XAU · BTC · ETH",
  },
  {
    tag: "Options",
    title: "Options & expiry players",
    who: "You sell or buy NSE weekly options and need direction plus volatility context.",
    outcome: "Expiry-gamma awareness, range tagging, and session timing built into the script.",
    markets: "NIFTY weekly · BankNifty weekly",
  },
];

export default function WhoFor() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="Who this is for"
          title={<>Three traders. <span className="grad-text-2">One tool.</span></>}
          lede="Golden Indicator adapts to how you trade. Pick the lane that looks most like yours."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {lanes.map((l) => (
            <article
              key={l.tag}
              className="glass-card-soft p-6 sm:p-8 flex flex-col transition-all duration-200 hover:border-rule-3 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-nano font-bold uppercase tracking-widest text-cyan">
                  {l.tag}
                </span>
                <span className="font-mono text-nano uppercase tracking-widest text-ink-40 truncate">
                  {l.markets}
                </span>
              </div>
              <h3 className="mt-4 h-card">{l.title}</h3>
              <p className="mt-3 text-caption text-ink-60 leading-relaxed">{l.who}</p>
              <div className="mt-5 pt-5 hairline-t">
                <div className="text-micro font-semibold text-blue-soft uppercase tracking-wider">
                  What it gives you
                </div>
                <p className="mt-2 text-caption text-ink leading-relaxed">{l.outcome}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40 max-w-2xl mx-auto">
          Symbol-agnostic · Works on any TradingView chart · Free tier supported
        </p>
      </div>
    </section>
  );
}
