"use client";

import Link from "next/link";
import { useState } from "react";

type Market = "India" | "US" | "Gold" | "BTC" | "Forex";
const markets: Market[] = ["India", "US", "Gold", "BTC", "Forex"];

type Symbol = {
  code: string;
  name: string;
  bias: string;
  lastUpdate: string;
  marketView: string;
  observations: string[];
  favorites: number;
};

type DayFeed = {
  date: string;
  label: string;
  symbols: Symbol[];
};

const feed: Record<Market, DayFeed[]> = {
  India: [
    {
      date: "2026-04-21",
      label: "Today, April 21, 2026",
      symbols: [
        {
          code: "NIFTY 50",
          name: "India Index",
          bias: "Bullish Structural",
          lastUpdate: "2h ago",
          marketView:
            "Structural trend remains firmly bullish above 24,600. Price establishing a high-volume base at the psychological 24,800 level. Volatility expansion expected toward 25,100 if daily close sustains above yesterday's high. FII positioning net positive three sessions running.",
          observations: [
            "Option chain shows heavy put writing at 24,700 strike — solid short-term floor.",
            "IT sector decoupling from NASDAQ weakness, showing independent strength.",
            "VIX India compressed to 12.4 — low-vol regime supports trend continuation.",
          ],
          favorites: 248,
        },
        {
          code: "RELIANCE.NS",
          name: "Reliance Ind.",
          bias: "Neutral",
          lastUpdate: "3h ago",
          marketView:
            "Sideways consolidation between 2,900 and 2,980 continues. Waiting for volume confirmation before directional call. Q4 earnings catalyst Friday — positioning cautious.",
          observations: [
            "50-day MA flattening — momentum fading ahead of results.",
            "Pre-earnings IV elevated; options premium rich vs historical baseline.",
          ],
          favorites: 112,
        },
        {
          code: "BANKNIFTY",
          name: "Banking Index",
          bias: "Bullish",
          lastUpdate: "2h ago",
          marketView:
            "Relative strength outperforms broader Nifty. Sustained close above 54,000 opens path to 54,800. Private bank basket leading; PSU banks catching up.",
          observations: [
            "HDFC Bank + ICICI Bank contributing 60% of index gains.",
            "FII long build-up in index futures for 3 sessions straight.",
          ],
          favorites: 187,
        },
        {
          code: "HDFCBANK.NS",
          name: "HDFC Bank",
          bias: "Bullish",
          lastUpdate: "4h ago",
          marketView:
            "Cleanly broken consolidation. Next resistance at 1,740, support retest zone 1,700. Momentum healthy, volume confirms.",
          observations: [
            "Delivery volume above 20-day average for 3 sessions.",
            "Mutual fund accumulation visible in bulk deals.",
          ],
          favorites: 94,
        },
      ],
    },
    {
      date: "2026-04-18",
      label: "Friday, April 18, 2026",
      symbols: [
        {
          code: "NIFTY 50",
          name: "India Index",
          bias: "Bullish",
          lastUpdate: "3d ago",
          marketView:
            "Weekly expiry closed above max-pain at 24,700. Short-covering accelerated in last 90 minutes. Strong setup into next week's monthly F&O expiry.",
          observations: [
            "Breadth positive — 34 of 50 constituents closed green.",
            "Volume 18% above 20-day average on close.",
            "USD/INR stable at 83.4; no FX headwind.",
          ],
          favorites: 321,
        },
        {
          code: "BANKNIFTY",
          name: "Banking Index",
          bias: "Bullish",
          lastUpdate: "3d ago",
          marketView:
            "Led broader market on expiry. Closed at 53,980, just below key 54,000 round. Options writers rolling calls higher — directional bias up.",
          observations: [
            "PSU bank rally added 180 points to index.",
            "Short rollover cost lowest in 4 weeks.",
          ],
          favorites: 164,
        },
      ],
    },
    {
      date: "2026-04-16",
      label: "Wednesday, April 16, 2026",
      symbols: [
        {
          code: "NIFTY 50",
          name: "India Index",
          bias: "Range",
          lastUpdate: "5d ago",
          marketView:
            "Mid-week consolidation between 24,520 and 24,680. Mean reversion strategy preferred over momentum. Avoid breakout entries until volume confirms.",
          observations: [
            "Range-bound session; 13 of last 15 bars inside prior range.",
            "Advance-decline flat at 1:1.",
          ],
          favorites: 89,
        },
      ],
    },
    {
      date: "2026-04-14",
      label: "Monday, April 14, 2026",
      symbols: [
        {
          code: "NIFTY 50",
          name: "India Index",
          bias: "Bullish",
          lastUpdate: "1w ago",
          marketView:
            "Gap-up open on positive global cues. Held above 24,500 through session — bulls defended key level. Next resistance 24,700.",
          observations: [
            "Asian markets green; Nikkei +1.2%, Hang Seng +0.9%.",
            "Crude held below $78 — positive for fuel importers.",
          ],
          favorites: 142,
        },
      ],
    },
  ],
  US: [
    {
      date: "2026-04-18",
      label: "Friday, April 18, 2026",
      symbols: [
        {
          code: "SPX",
          name: "S&P 500",
          bias: "Neutral",
          lastUpdate: "3d ago",
          marketView:
            "Choppy tape ahead of earnings season. Index pinned near 5,180 weekly pivot. Regional banks weighing on breadth.",
          observations: [
            "VIX bumped to 16.2 — mild risk-off signal.",
            "Tech leadership narrowing to top 7 names.",
          ],
          favorites: 67,
        },
      ],
    },
  ],
  Gold: [
    {
      date: "2026-04-18",
      label: "Friday, April 18, 2026",
      symbols: [
        {
          code: "XAU/USD",
          name: "Gold Spot",
          bias: "Bullish",
          lastUpdate: "3d ago",
          marketView:
            "Breaking out of multi-week consolidation above $2,420. Next resistance $2,460. DXY weakness + geopolitical bid both supportive.",
          observations: [
            "Central bank buying persists — net positive flows Q1.",
            "Silver lagging — gold/silver ratio at 82.",
          ],
          favorites: 54,
        },
      ],
    },
  ],
  BTC: [
    {
      date: "2026-04-18",
      label: "Friday, April 18, 2026",
      symbols: [
        {
          code: "BTC/USD",
          name: "Bitcoin",
          bias: "Range",
          lastUpdate: "3d ago",
          marketView:
            "Consolidating between $63k and $68k post-halving. No directional bias until breakout. Funding rates neutral.",
          observations: [
            "Spot ETF flows flat for 5 sessions.",
            "Dominance stable at 53%.",
          ],
          favorites: 43,
        },
      ],
    },
  ],
  Forex: [],
};

function Icon({ d, size = 16, className = "" }: { d: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  chart: "M3 3v18h18 M7 15l4-4 3 3 5-6",
  chevronRight: "M9 18l6-6-6-6",
  chevronLeft: "M15 18l-9-6 9-6",
  chevronLeftArrow: "M19 12H5 M12 19l-7-7 7-7",
  chevronRightArrow: "M5 12h14 M12 5l7 7-7 7",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13",
  bookmark: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20z M12 6v6l4 2",
  monitoring: "M3 3v18h18 M7 13l3-3 4 4 7-7",
  waterfall: "M4 20V10 M9 20V4 M14 20v-7 M19 20v-12",
  doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 13h6 M9 17h6",
  insights: "M12 2a10 10 0 1010 10 M12 2v10l7 7",
  checklist: "M3 6l2 2 4-4 M3 12l2 2 4-4 M3 18l2 2 4-4 M13 6h8 M13 12h8 M13 18h8",
};

export default function UpdatesPage() {
  const [activeMarket, setActiveMarket] = useState<Market>("India");

  const days = feed[activeMarket];

  return (
    <>
      <section className="bg-page">
        <div className="container-wide pt-12 sm:pt-16 pb-8">
          <nav className="flex items-center gap-1.5 text-muted-faint text-nano uppercase tracking-widest">
            <span>Markets</span>
            <Icon d={ICONS.chevronRight} size={12} />
            <span className="text-blue-link font-semibold">Public Research Feed</span>
          </nav>

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="h-hero">Institutional Research</h1>
              <p className="mt-2 text-body-lg text-muted max-w-2xl">
                Professional market structure and daily execution notes. Verified public record.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-rule shadow-soft self-start md:self-center">
              <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
              <span className="text-nano font-bold text-ink uppercase tracking-widest">
                Portal Live
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-page">
        <div className="container-wide pb-6">
          <div
            role="tablist"
            aria-label="Market filter"
            className="bg-surface-active/50 p-1 rounded-2xl inline-flex w-full md:w-auto overflow-x-auto no-scrollbar"
          >
            {markets.map((m) => {
              const active = m === activeMarket;
              return (
                <button
                  key={m}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveMarket(m)}
                  className={`flex-1 md:flex-none px-6 sm:px-8 py-2.5 rounded-xl font-bold text-caption whitespace-nowrap transition-all ${
                    active
                      ? "bg-surface text-ink shadow-soft"
                      : "text-muted-soft hover:text-ink"
                  }`}
                >
                  {m} Market
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-page">
        <div className="container-wide pb-20">
          {days.length === 0 ? (
            <div className="card-white p-10 text-center">
              <p className="text-body text-muted">
                {activeMarket} market feed coming soon. Join the newsletter to be notified when it goes live.
              </p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {days.map((day) => (
                <DayCard key={day.date} day={day} />
              ))}

              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-3 sm:gap-6"
              >
                <button
                  disabled
                  className="px-4 py-2 bg-surface border border-rule rounded-xl text-muted-faint font-bold text-caption shadow-soft flex items-center gap-2 disabled:opacity-50"
                >
                  <Icon d={ICONS.chevronLeftArrow} size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-caption transition-all ${
                        n === 1
                          ? "bg-blue text-white shadow-soft"
                          : "text-muted-soft hover:text-ink"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-muted-faint mx-1 text-caption font-bold">…</span>
                  <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-muted-soft hover:text-ink font-bold text-caption transition-all">
                    12
                  </button>
                </div>

                <button className="px-4 py-2 bg-surface border border-rule rounded-xl text-ink font-bold text-caption shadow-soft flex items-center gap-2 hover:bg-page transition-all">
                  <span className="hidden sm:inline">Next</span>
                  <Icon d={ICONS.chevronRightArrow} size={16} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DayCard({ day }: { day: DayFeed }) {
  const [activeSymbol, setActiveSymbol] = useState(0);
  const symbol = day.symbols[activeSymbol];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <h2 className="h-tile">{day.label}</h2>
        <div className="h-px flex-1 bg-rule" />
      </div>

      <article className="bg-surface rounded-[22px] border border-rule shadow-soft overflow-hidden">
        <div className="px-5 sm:px-8 pt-6 border-b border-rule">
          <div
            role="tablist"
            aria-label="Symbol selector"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4"
          >
            {day.symbols.map((s, i) => {
              const active = i === activeSymbol;
              return (
                <button
                  key={s.code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveSymbol(i)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-caption flex flex-col items-start gap-0.5 transition-all ${
                    active
                      ? "bg-blue text-white shadow-soft"
                      : "bg-page text-muted-soft hover:text-ink border border-rule"
                  }`}
                >
                  <span className="text-nano opacity-80 uppercase tracking-tight">{s.code}</span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 sm:px-8 py-5 flex items-center justify-between bg-page/50 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center flex-shrink-0">
              <Icon d={ICONS.waterfall} size={20} className="text-blue" />
            </div>
            <div className="min-w-0">
              <h3 className="text-body font-bold text-ink truncate">{symbol.code}</h3>
              <span className="text-nano font-bold text-muted-faint uppercase tracking-widest mt-0.5 block">
                Institutional View · {symbol.lastUpdate}
              </span>
            </div>
          </div>
          <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#e7f7ee] text-[#0a7a3a] text-nano font-bold uppercase tracking-widest border border-[#cdebd8]">
            {symbol.bias}
          </span>
        </div>

        <div className="bg-page/40 border-b border-rule">
          <div className="flex overflow-x-auto snap-x no-scrollbar px-5 sm:px-8 py-6 gap-4 sm:gap-6">
            <CarouselSlide
              label="Pre-Market Analysis"
              iconD={ICONS.monitoring}
              headline="08:45 AM IST"
              sub="Delivered pre-open"
            />
            <CarouselSlide
              label="Post-Market Execution"
              iconD={ICONS.doc}
              headline="After 3:30 PM IST"
              sub="Session recap + next-day bias"
            />
            <CarouselSlide
              label="Open Interest Flow"
              iconD={ICONS.waterfall}
              headline="Intraday updates"
              sub="Option-chain shifts flagged"
            />
          </div>
        </div>

        <div className="px-5 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div>
            <h4 className="text-micro font-bold text-blue uppercase tracking-widest mb-3 flex items-center gap-2">
              <Icon d={ICONS.insights} size={14} />
              Market View
            </h4>
            <p className="text-body text-ink leading-relaxed">{symbol.marketView}</p>
          </div>
          <div>
            <h4 className="text-micro font-bold text-muted-soft uppercase tracking-widest mb-3 flex items-center gap-2">
              <Icon d={ICONS.checklist} size={14} />
              Critical Observations
            </h4>
            <ul className="space-y-3">
              {symbol.observations.map((o, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-blue mt-2 flex-shrink-0" />
                  <p className="text-caption text-muted leading-relaxed">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-5 sm:px-8 py-4 bg-page/60 border-t border-rule flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-muted-soft hover:text-blue transition-colors">
              <Icon d={ICONS.heart} size={16} />
              <span className="text-caption font-bold">{symbol.favorites}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-soft hover:text-blue transition-colors">
              <Icon d={ICONS.share} size={16} />
              <span className="text-caption font-bold">Share</span>
            </button>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/checkout"
              className="text-nano font-bold text-blue uppercase tracking-widest underline decoration-2 underline-offset-4 hover:no-underline"
            >
              Terminal View
            </Link>
            <button
              aria-label="Bookmark"
              className="text-muted-faint hover:text-ink transition-colors"
            >
              <Icon d={ICONS.bookmark} size={18} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

function CarouselSlide({
  label,
  iconD,
  headline,
  sub,
}: {
  label: string;
  iconD: string;
  headline: string;
  sub: string;
}) {
  return (
    <div className="flex-shrink-0 w-[85%] sm:w-[55%] md:w-[45%] snap-center space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-nano font-bold text-ink uppercase tracking-widest">{label}</span>
        <Icon d={iconD} size={14} className="text-muted-faint" />
      </div>
      <div className="aspect-video bg-surface rounded-2xl border border-rule overflow-hidden flex flex-col items-center justify-center text-center px-4 shadow-soft">
        <Icon d={iconD} size={28} className="text-blue/30 mb-2" />
        <p className="text-nano font-bold text-ink uppercase tracking-widest mb-0.5">
          {headline}
        </p>
        <p className="text-nano text-muted-soft">{sub}</p>
      </div>
    </div>
  );
}
