import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Price from "@/components/ui/Price";
import { ProductJsonLd, PageBreadcrumbs } from "@/components/seo/JsonLd";

/**
 * Programmatic SEO — long-tail landing pages for each major market.
 * Targets queries like "nifty 50 indicator tradingview" / "banknifty
 * intraday indicator" / "spx 500 pine script". One template, six pages,
 * six chunks of organic surface area for free.
 */

type MarketKey = "nifty" | "banknifty" | "spx" | "nasdaq" | "gold" | "btc";

type Market = {
  key: MarketKey;
  shortLabel: string;       // "NIFTY 50"
  longLabel: string;        // "NIFTY 50 / N50 / NSE:NIFTY"
  region: "India" | "US" | "Global" | "Crypto";
  intraTimeframes: string;
  setupHighlights: string[];
  searchTerm: string;       // primary keyword
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    sub: string;
  };
  whyParas: string[];
};

const MARKETS: Record<MarketKey, Market> = {
  nifty: {
    key: "nifty",
    shortLabel: "NIFTY 50",
    longLabel: "NIFTY 50 · NSE:NIFTY",
    region: "India",
    intraTimeframes: "5m / 15m for opening-range and pullback plays · 1H for swing",
    setupHighlights: [
      "Opening Range Breakout (ORB) with regime + volume confirmation",
      "Trend pullback into PDH / PDL / PWH / PWL",
      "Expiry-week gamma fade on Thursday afternoon",
      "VWAP reclaim + structural break for second-leg continuation",
    ],
    searchTerm: "NIFTY 50 indicator TradingView",
    metaTitle: "NIFTY 50 Indicator for TradingView · Golden Indicator (Pine v5)",
    metaDescription:
      "Non-repainting NIFTY 50 indicator for TradingView. Market structure, regime bias, opening-range breakout, PDH / PDL levels, supply / demand zones. Tuned for NSE intraday + weekly expiry. One-time $49 / ₹4,599. Lifetime updates.",
    keywords: [
      "NIFTY 50 indicator TradingView",
      "best NIFTY indicator",
      "NIFTY Pine Script",
      "NIFTY intraday indicator no repaint",
      "NIFTY weekly expiry indicator",
      "NSE indicator TradingView",
      "ORB indicator NIFTY",
      "Indian retail trader indicator",
    ],
    hero: {
      eyebrow: "NIFTY 50 · NSE",
      title: "TradingView indicator built for NIFTY 50 traders.",
      sub: "Opening-range breakouts, PDH / PDL trades, expiry-week fades — one bar-close engine. Works on the free TradingView plan.",
    },
    whyParas: [
      "NIFTY moves in three modes most days: opening-range expansion, midday drift, and last-hour expiry positioning. Generic Pine scripts treat all three the same. Golden Indicator classifies the regime first and only then plots structural levels — so you stop fading drift and stop fighting expansion.",
      "PDH / PDL / PWH / PWL are auto-drawn for every NIFTY chart you load. Supply and demand zones are tagged at the swing points where buyers or sellers reacted last. Every signal is calculated on bar close — what you saw at 9:18:59 will still be there at 15:30.",
    ],
  },
  banknifty: {
    key: "banknifty",
    shortLabel: "BANKNIFTY",
    longLabel: "BANKNIFTY · NSE:BANKNIFTY",
    region: "India",
    intraTimeframes: "3m / 5m / 15m for intraday · 1H for swing",
    setupHighlights: [
      "Expiry-day gamma fade on Thursday post-13:30",
      "Bank earnings flow — momentum break with regime confirmation",
      "PDH / PDL re-claim on the second 5m candle after open",
      "Range-day mean-revert at upper / lower volatility band",
    ],
    searchTerm: "BANKNIFTY indicator TradingView",
    metaTitle: "BANKNIFTY Indicator for TradingView · Pine v5 · Expiry-aware",
    metaDescription:
      "BANKNIFTY indicator for TradingView Pine v5. Expiry-day gamma fade setup, PDH / PDL levels, structure-based pullback entries, weekly options bias. Non-repainting, bar-close only. One-time $49 / ₹4,599.",
    keywords: [
      "BANKNIFTY indicator TradingView",
      "BANKNIFTY intraday indicator",
      "BANKNIFTY expiry strategy",
      "BANKNIFTY Pine Script",
      "Bank Nifty options indicator",
      "BANKNIFTY gamma fade",
    ],
    hero: {
      eyebrow: "BANKNIFTY · NSE",
      title: "TradingView indicator for BANKNIFTY expiry traders.",
      sub: "Gamma fades, PDH / PDL retests, second-candle reclaim plays. The setup logic that actually fits Bank Nifty volatility.",
    },
    whyParas: [
      "BANKNIFTY isn't NIFTY with bigger candles. It's a different beast: weekly expiry, 4 large stock weights, US bank-flow correlation in the morning. Indicators that work on NIFTY get mauled here unless they handle the volatility differently.",
      "Golden Indicator classifies the day type before plotting anything. Range day vs trend day vs expiry day each gets a different setup playbook in the bundled Trade Logic PDF. The risk calculator sizes BANKNIFTY positions in lots, not points — so you don't blow up on a 200-point reversal.",
    ],
  },
  spx: {
    key: "spx",
    shortLabel: "SPX 500",
    longLabel: "S&P 500 · SPX",
    region: "US",
    intraTimeframes: "5m / 15m for ES futures · 1H / 4H for cash session swing",
    setupHighlights: [
      "Asia hand-off bias — overnight range break or fade",
      "Trend pullback into 4H key level (50 / 200 EMA, prior day high / low)",
      "Cash open VWAP reclaim + regime confirmation",
      "FOMC-day fade at 2pm ET extreme",
    ],
    searchTerm: "SPX 500 TradingView indicator",
    metaTitle: "SPX 500 Indicator for TradingView · Pine v5 · S&P 500 / ES futures",
    metaDescription:
      "S&P 500 indicator for TradingView Pine v5. Cash session + ES futures support, 4H trend pullback setup, VWAP reclaim, FOMC fade. Non-repainting, bar-close only. One-time $49.",
    keywords: [
      "SPX 500 TradingView indicator",
      "S&P 500 indicator no repaint",
      "ES futures indicator",
      "S&P 500 Pine Script",
      "SPY indicator TradingView",
      "FOMC trading indicator",
    ],
    hero: {
      eyebrow: "S&P 500 / ES",
      title: "TradingView indicator for SPX 500 traders.",
      sub: "Trend pullbacks, VWAP reclaims, FOMC-day fades. Same Pine v5 engine as the NIFTY version — different volatility scaling, same logic.",
    },
    whyParas: [
      "SPX trends are slower than NIFTY but cleaner. The 4H structure tends to stay valid for days. Golden Indicator's regime filter catches that and avoids the chop-day fakeouts that eat retail equity.",
      "Works equally well on SPY, ES futures, and the cash SPX index. Volatility scaling adapts automatically — you don't tune anything per chart.",
    ],
  },
  nasdaq: {
    key: "nasdaq",
    shortLabel: "NASDAQ 100",
    longLabel: "NASDAQ 100 · NDX / NQ",
    region: "US",
    intraTimeframes: "5m / 15m for NQ futures · 1H / 4H for swing",
    setupHighlights: [
      "Tech earnings week breakout — regime + volume",
      "QQQ trend pullback into 4H key level",
      "London-NY overlap reversal at session high / low",
      "Late-Friday squeeze fade on lower-volatility days",
    ],
    searchTerm: "NASDAQ 100 indicator TradingView",
    metaTitle: "NASDAQ 100 Indicator for TradingView · Pine v5 · QQQ / NQ",
    metaDescription:
      "NASDAQ 100 indicator for TradingView Pine v5. Earnings-week breakouts, QQQ trend pullback, NQ futures support. Non-repainting, bar-close only. One-time $49.",
    keywords: [
      "NASDAQ 100 indicator TradingView",
      "QQQ indicator no repaint",
      "NQ futures Pine Script",
      "NASDAQ Pine Script indicator",
      "tech earnings indicator",
    ],
    hero: {
      eyebrow: "NASDAQ 100 / NQ",
      title: "TradingView indicator for NASDAQ 100 traders.",
      sub: "Earnings-week breakouts, QQQ pullback plays, NQ futures intraday. Bar-close logic, no repaint, no tier upsells.",
    },
    whyParas: [
      "NASDAQ moves on earnings flow more than any other major index. Generic indicators wash out on earnings-week gaps. Golden Indicator's regime filter spots the gap-and-go vs gap-and-fade type before you press the button.",
      "Same Pine file works on NQ futures, QQQ, and the NDX cash index. The supply / demand zones lift cleanly across timeframes since they're anchored to swing highs and lows, not to a fixed lookback.",
    ],
  },
  gold: {
    key: "gold",
    shortLabel: "Gold (XAU/USD)",
    longLabel: "Gold · XAUUSD · GC=F",
    region: "Global",
    intraTimeframes: "15m / 1H for London / NY sessions · 4H for swing",
    setupHighlights: [
      "London open breakout with structure + regime confirmation",
      "DXY-correlation fade at extreme",
      "4H trend pullback into PWH / PWL level",
      "FOMC-day spike fade at the 2pm ET reaction",
    ],
    searchTerm: "Gold indicator TradingView XAU USD",
    metaTitle: "Gold (XAU/USD) Indicator for TradingView · Pine v5",
    metaDescription:
      "Gold / XAU USD indicator for TradingView Pine v5. London-session breakouts, 4H trend pullback, DXY-correlation fade. Works on spot, GC futures, GLD ETF. One-time $49.",
    keywords: [
      "gold indicator TradingView",
      "XAU USD indicator no repaint",
      "GC futures Pine Script",
      "GLD trading indicator",
      "gold breakout indicator",
      "London session gold strategy",
    ],
    hero: {
      eyebrow: "Gold · XAU/USD",
      title: "TradingView indicator for Gold traders.",
      sub: "London-open breakouts, DXY-correlation fades, 4H trend pullbacks — bar-close only, no signal service.",
    },
    whyParas: [
      "Gold's character changes by session: Asia drift, London expansion, NY overlap volatility, late-day reversion. Most indicators ignore session structure and bleed during the wrong half of the day. Golden Indicator's regime classifier tracks it.",
      "Equally clean on spot XAU/USD, COMEX GC futures, and the GLD ETF. The same supply / demand zones plot across all three since they're price-action-anchored, not feed-anchored.",
    ],
  },
  btc: {
    key: "btc",
    shortLabel: "Bitcoin (BTC/USD)",
    longLabel: "Bitcoin · BTC/USD",
    region: "Crypto",
    intraTimeframes: "4H for swing · 1H for active intraday · daily for position",
    setupHighlights: [
      "Range-break with structural higher-high / lower-low confirmation",
      "Funding-rate fade at extreme open interest",
      "4H supply / demand zone retest after impulse",
      "Weekly key level (PWH / PWL) reclaim play",
    ],
    searchTerm: "BTC indicator TradingView Pine",
    metaTitle: "Bitcoin Indicator for TradingView · BTC/USD · Pine v5",
    metaDescription:
      "Bitcoin / BTC USD indicator for TradingView Pine v5. Range breaks, supply / demand retests, weekly level reclaim. 24/7 market support, bar-close only. One-time $49.",
    keywords: [
      "BTC TradingView indicator",
      "Bitcoin Pine Script no repaint",
      "BTC USD indicator",
      "crypto Pine Script indicator",
      "BTC structural break indicator",
      "Bitcoin supply demand indicator",
    ],
    hero: {
      eyebrow: "Bitcoin · BTC/USD",
      title: "TradingView indicator for Bitcoin traders.",
      sub: "Range breaks, supply / demand retests, weekly level reclaim. 24/7 market — bar-close only, no FOMO entries.",
    },
    whyParas: [
      "BTC ranges and trends in cycles measured in days, not minutes. Trying to scalp it on a 1m chart with retail tools is the fastest way to give back gains. Golden Indicator's 4H setup is built around how BTC actually moves.",
      "The funding-rate context isn't built in (you'll need an exchange feed for that), but the structural break + regime filter does most of the heavy lifting. Use the bundled risk calculator to size every BTC trade in fractional units, not lots.",
    ],
  },
};

const ALL_KEYS = Object.keys(MARKETS) as MarketKey[];

export function generateStaticParams() {
  return ALL_KEYS.map((market) => ({ market }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const m = MARKETS[market as MarketKey];
  if (!m) return { title: "Indicator" };
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    keywords: m.keywords,
    alternates: { canonical: `/indicator/${m.key}` },
    openGraph: {
      title: m.metaTitle,
      description: m.metaDescription,
      url: `https://www.easytradesetup.com/indicator/${m.key}`,
      type: "website",
    },
  };
}

export default async function IndicatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const m = MARKETS[market as MarketKey];
  if (!m) notFound();

  return (
    <>
      <ProductJsonLd />
      <PageBreadcrumbs name={m.shortLabel} path={`/indicator/${m.key}`} />

      <section className="above-bg">
        <div className="container-wide pt-12 sm:pt-16 md:pt-20 pb-10">
          <div className="max-w-[760px]">
            <span className="eye">
              <span className="eye-dot" aria-hidden />
              {m.hero.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-[40px] sm:text-[52px] lg:text-[60px] font-semibold leading-[1.04] tracking-[-0.025em] text-ink">
              {m.hero.title}
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17px] leading-[1.55] text-ink-60 max-w-[620px]">
              {m.hero.sub}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/checkout" className="btn btn-acid btn-lg">
                Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center justify-center gap-1.5 text-[14px] font-medium text-ink-60 hover:text-ink transition-colors px-2 py-2"
              >
                View free sample <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14">
            <div>
              <h2 className="h-section">
                Why a generic Pine script breaks on{" "}
                <span className="grad-text-2">{m.shortLabel}</span>.
              </h2>
              {m.whyParas.map((para, i) => (
                <p key={i} className="mt-5 text-[15.5px] leading-[1.65] text-ink-60">{para}</p>
              ))}
              <p className="mt-5 text-[14.5px] leading-[1.6] text-ink-40">
                <strong style={{ color: "var(--c-ink-60)" }}>Note:</strong> educational only.
                Not investment advice. Past chart behaviour is illustrative, not a forecast.
                You decide every trade.
              </p>
            </div>

            <aside className="glass-card-soft p-6 sm:p-8 self-start">
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
                Setup highlights · {m.shortLabel}
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {m.setupHighlights.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-[14px] text-ink leading-[1.5]">
                    <span
                      aria-hidden
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 grid place-items-center"
                      style={{
                        background: "rgba(43,123,255,0.16)",
                        color: "#2B7BFF",
                        border: "1px solid rgba(43,123,255,0.35)",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-rule">
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40 mb-2">
                  Best timeframes
                </div>
                <p className="text-[13px] text-ink-60 leading-[1.5]">{m.intraTimeframes}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-12 sm:py-16">
          <div className="glass-card p-8 sm:p-10 text-center">
            <h2 className="h-tile">
              Built for {m.shortLabel}. <span className="grad-text-2">Same script, every market.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-caption text-ink-60 leading-relaxed">
              You buy the indicator once. It runs on every market in this list — switch the chart,
              the levels redraw, the regime resets, the playbook holds.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {ALL_KEYS.filter((k) => k !== m.key).map((k) => (
                <Link
                  key={k}
                  href={`/indicator/${k}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rule-2 text-[12.5px] text-ink-60 hover:text-ink hover:border-rule-3 transition-colors"
                >
                  {MARKETS[k].shortLabel}
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/checkout" className="btn btn-primary btn-lg">
                Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/compare" className="btn btn-outline btn-lg">
                See how it compares
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
