import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Case studies — Educational walk-throughs",
  description:
    "Educational case studies demonstrating how Golden Indicator reads regime, structure, and levels on real historical charts. Hypothetical outcomes. Not a record of trading performance.",
  alternates: { canonical: "/case-studies" },
};

type Case = {
  slug: string;
  market: string;
  timeframe: string;
  date: string;
  title: string;
  setup: string;
  read: Array<{ label: string; note: string }>;
  hypothetical: {
    entry: string;
    stop: string;
    target: string;
    outcome: string;
    r: string;
  };
};

const cases: Case[] = [
  {
    slug: "nifty-orb-2026-04-18",
    market: "NIFTY Futures",
    timeframe: "5-minute",
    date: "2026-04-18",
    title: "Opening range breakout — clean momentum day",
    setup:
      "Nifty formed a tight 35-point opening range in the first 15 minutes. Regime filter showed bullish structural bias above the previous day's midpoint. At 09:50 IST a 5-min close outside OR high confirmed the break.",
    read: [
      { label: "Regime", note: "Bullish confirmed — Golden Indicator regime line sloping up, price above mid-line" },
      { label: "Structure", note: "Higher-high / higher-low sequence through the morning session" },
      { label: "Levels", note: "Opening range high at 24,738 — breakout anchor for the day" },
      { label: "Volume", note: "Breakout bar printed 1.8× the 20-bar average — institutional confirmation" },
    ],
    hypothetical: {
      entry: "24,745 (open of bar after OR high break)",
      stop: "24,695 (OR low — 50 points below entry)",
      target: "24,830 (OR width 35 pts × projection, plus partial 0.7× scale-out)",
      outcome: "Target hit at 12:42 IST with 1.7× reward-to-risk on the full position",
      r: "+1.7R",
    },
  },
  {
    slug: "xau-mean-revert-2026-04-12",
    market: "XAU / USD (Gold)",
    timeframe: "1-hour",
    date: "2026-04-12",
    title: "Mean reversion in a range regime",
    setup:
      "Gold drifted inside a $30 range for 22 hours. Regime filter read NEUTRAL (no directional bias). Price tagged the outer band of the volatility envelope with momentum reading at 28 — classic mean-reversion long signal.",
    read: [
      { label: "Regime", note: "Neutral — ranging market. Trend-following setups disabled." },
      { label: "Volatility", note: "Outer band tagged at $2,378 — statistically stretched" },
      { label: "Momentum", note: "Reading 28 — oversold in a range context" },
      { label: "Rejection", note: "Lower wick printed on tag bar, closing back inside band" },
    ],
    hypothetical: {
      entry: "$2,381 (on close of rejection bar)",
      stop: "$2,373 ($1.5 ATR below entry band)",
      target: "$2,394 (midline of volatility envelope)",
      outcome: "Target reached 6 hours later at $2,395. Scale-out at midline, trail exited at $2,397",
      r: "+1.6R",
    },
  },
  {
    slug: "btc-momentum-2026-04-03",
    market: "BTC / USD",
    timeframe: "4-hour",
    date: "2026-04-03",
    title: "Momentum continuation after regime flip",
    setup:
      "BTC regime flipped from NEUTRAL to BULLISH after a 4-hour close above $68,400. Signal ribbon confirmed 2 bars later on a retest of the breakout level, with volume surge on the continuation bar.",
    read: [
      { label: "Regime", note: "Bullish flip confirmed — regime line sloped up, price above" },
      { label: "Structure", note: "Prior lower-high swept, new higher-high formed" },
      { label: "Signal", note: "Ribbon aligned after retest hold — entry trigger" },
      { label: "Volume", note: "Continuation bar 1.5× average — bulls defended the retest" },
    ],
    hypothetical: {
      entry: "$68,950 (on signal confirmation bar close)",
      stop: "$67,800 (below retest low, 1× ATR buffer)",
      target: "$71,200 (prior swing high, conservative target)",
      outcome: "Partial at +1R ($70,100), trail stopped at $70,550",
      r: "+1.4R (combined)",
    },
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title={<>How the indicator reads the chart.</>}
        lede="Educational walk-throughs on real historical charts. These are not trade recommendations or a record of live performance — they show how the setup logic applies when the filters align."
      />

      <section className="bg-surface">
        <div className="container-x py-14 sm:py-20 space-y-8">
          {/* Disclaimer callout */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-caption leading-relaxed text-amber-200">
            <strong className="font-semibold">Educational, not performance.</strong> Each
            case below is a post-hoc walk-through on a historical chart — not a log of
            live trades, not a guarantee of future outcomes. Hypothetical entries, stops,
            targets, and reward-to-risk numbers illustrate how the setup logic applies
            when every filter aligns. Past patterns do not repeat cleanly in the future.
            Read the full{" "}
            <Link href="/legal/disclaimer" className="underline">trading disclaimer</Link>.
          </div>

          {cases.map((c, i) => (
            <article key={c.slug} className="card-apple p-6 sm:p-8 md:p-10">
              <header className="flex flex-wrap items-center gap-3">
                <span className="text-micro font-mono text-muted-faint tabular-nums">
                  Case {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt border border-rule px-2.5 py-0.5 text-nano font-semibold text-ink uppercase tracking-widest">
                  {c.market}
                </span>
                <span className="text-nano text-muted-faint font-mono">
                  {c.timeframe} · {c.date}
                </span>
              </header>

              <h2 className="mt-5 h-tile">{c.title}</h2>
              <p className="mt-3 text-body text-muted leading-relaxed">{c.setup}</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                    What the indicator showed
                  </div>
                  <ul className="mt-4 space-y-3">
                    {c.read.map((r) => (
                      <li key={r.label} className="text-caption">
                        <div className="text-ink font-medium">{r.label}</div>
                        <div className="mt-0.5 text-muted leading-relaxed">{r.note}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-white p-6 sm:p-8 self-start">
                  <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">
                    Hypothetical trade logic
                  </div>
                  <dl className="mt-5 space-y-3 text-caption">
                    {[
                      ["Entry", c.hypothetical.entry],
                      ["Stop", c.hypothetical.stop],
                      ["Target", c.hypothetical.target],
                      ["Outcome", c.hypothetical.outcome],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[90px_1fr] gap-3">
                        <dt className="text-muted-faint uppercase tracking-wider text-nano font-semibold">
                          {k}
                        </dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[90px_1fr] gap-3 pt-3 hairline-t">
                      <dt className="text-muted-faint uppercase tracking-wider text-nano font-semibold">
                        R multiple
                      </dt>
                      <dd className="text-up font-semibold tabular-nums">
                        {c.hypothetical.r}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          ))}

          <div className="mt-8 card-white p-8 md:p-10 text-center">
            <h2 className="h-card">Want the full framework?</h2>
            <p className="mt-2 text-body text-muted">
              Every case above uses rules documented in the Trade Logic PDF that ships
              with Golden Indicator.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sample"
                className="inline-flex items-center justify-center rounded-lg bg-ink text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all"
              >
                Read the sample chapter
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all"
              >
                Reserve the bundle
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
