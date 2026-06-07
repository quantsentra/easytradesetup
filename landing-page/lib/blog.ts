// Single source of truth for blog posts. Append a row when shipping a
// new article. Used by:
//   - app/(marketing)/blog/page.tsx        — index page
//   - app/sitemap.ts                       — sitemap entries
//   - tests/e2e/pages.spec.ts              — smoke tests
//
// Article TSX lives at: app/(marketing)/blog/<slug>/page.tsx
// Brand-voice + rules:  /docs/seo/brand-voice.md, /docs/seo/publishing-rules.md
//
// Why TSX per article instead of markdown: keeps brand styling tight,
// no extra runtime deps (gray-matter / remark), zero parser bugs,
// JSON-LD rendered once per page with correct nonce. Hermes drafts
// markdown to /content/blog/ as paper trail; Claude Code converts to TSX.

export type BlogPost = {
  slug:            string;
  title:           string;
  metaTitle:       string;        // ≤60 char
  metaDescription: string;        // ≤155 char
  excerpt:         string;        // 1–2 sentences for index page card
  hook:            string;        // shorter teaser line
  primaryKeyword:  string;
  secondaryKeywords: string[];
  audienceTier:    "T1" | "T2" | "T3" | "T4";
  pillar:          1 | 2 | 3 | 4 | 5 | 6;
  datePublished:   string;        // YYYY-MM-DD
  dateModified?:   string;        // YYYY-MM-DD
  readMinutes:     number;
  // Hero image — pick the most recent file from the matching folder
  // under /public/blog-images/{indian|us|crypto-forex|gold|generic}/.
  // See landing-page/public/blog-images/README.md for naming + selection
  // rules. Path is relative to /public — e.g. "/blog-images/indian/NIFTY-baseline.png".
  heroImage:       string;
  heroAlt:         string;
};

export const POSTS: BlogPost[] = [
  {
    slug:              "best-tradingview-indicators",
    title:             "Best TradingView Indicators — Four Tests Before You Add Anything to Your Chart",
    metaTitle:         "Best TradingView Indicators · Four Tests · EasyTradeSetup",
    metaDescription:   "The TradingView marketplace has thousands of indicators. Four tests decide which ones belong on your chart — and which ones just add noise.",
    excerpt:           "The TradingView marketplace has over 100,000 published scripts — most of them adding clutter rather than clarity. Four tests filter any indicator down to whether it earns a spot on a decision-grade chart.",
    hook:              "Thousands of TradingView indicators. Four tests decide which ones earn a spot on your chart.",
    primaryKeyword:    "best tradingview indicators",
    secondaryKeywords: [
      "tradingview indicator review",
      "which tradingview indicators to use",
      "regime indicator tradingview",
      "no repaint tradingview indicator",
      "decision-grade tradingview indicator",
    ],
    audienceTier:      "T1",
    pillar:            2,
    datePublished:     "2026-06-07",
    readMinutes:       9,
    heroImage:         "/blog-images/us/US30_2026-05-09_11-03-06.png",
    heroAlt:           "Golden Indicator on a US30 chart — regime classification, structural levels, and key zones layered on price without signal clutter",
  },
  {
    slug:              "trading-tools-lifetime-licence",
    title:             "Trading Tools With a Lifetime Licence — The No-Monthly-Fee Shortlist",
    metaTitle:         "Trading Tools With a Lifetime Licence · EasyTradeSetup",
    metaDescription:   "Most chart tools charge monthly forever. A shortlist of trading tools with genuine lifetime licences, what they include, and four tests to buy right.",
    excerpt:           "The word 'lifetime' in trading software means at least four different things, and only one is the deal you think you are getting. The shortlist is short; the four tests are fast.",
    hook:              "Most tools that call themselves 'lifetime' are annual plans in disguise. Four tests that separate ownership from subscription repackaged.",
    primaryKeyword:    "what trading tools have a lifetime licence with no monthly fee",
    secondaryKeywords: [
      "lifetime trading indicator no monthly fee",
      "trading tools one time purchase",
      "no subscription trading indicator",
      "best one time trading indicator",
      "ownership vs subscription indicator",
    ],
    audienceTier:      "T1",
    pillar:            2,
    datePublished:     "2026-06-06",
    readMinutes:       9,
    heroImage:         "/blog-images/us/US30_2026-05-09_11-03-29.png",
    heroAlt:           "Golden Indicator on a US30 chart — regime classification, structural levels, and key zones in a single bar-close view",
  },
  {
    slug:              "position-sizing-trading",
    title:             "Position Sizing in Trading — The R-Multiple Method for Consistent Risk",
    metaTitle:         "Position Sizing in Trading · R-Multiple · EasyTradeSetup",
    metaDescription:   "Position sizing is the one variable you control. R-multiple framework in three steps — stop placement, risk amount, size calculation. Educational.",
    excerpt:           "Most traders optimise entries. Position sizing is the variable that actually decides whether they survive losing streaks. The R-multiple framework converts 'how much?' from a feeling into a three-step formula.",
    hook:              "The one trading variable you actually control. Get it wrong and a good strategy still wipes you out.",
    primaryKeyword:    "position sizing trading",
    secondaryKeywords: [
      "r multiple trading",
      "risk management day trading",
      "how to size a trade",
      "trading risk per trade",
      "atr stop loss trading",
    ],
    audienceTier:      "T2",
    pillar:            4,
    datePublished:     "2026-06-05",
    readMinutes:       9,
    heroImage:         "/blog-images/indian/BANKNIFTY_2026-05-09_10-57-50.png",
    heroAlt:           "Golden Indicator on a BANKNIFTY chart — swing highs and lows marked at structural levels, used as stop reference points for position sizing",
  },
  {
    slug:              "how-to-draw-supply-demand-zones",
    title:             "How to Draw Supply and Demand Zones — The Three-Part Structure Every Valid Zone Needs",
    metaTitle:         "How to Draw Supply and Demand Zones · EasyTradeSetup",
    metaDescription:   "Supply and demand zones are drawn at the base consolidation before the impulse, not the reversal tip. Three-part IBI structure, boundary rules, freshness grading. Educational.",
    excerpt:           "Most traders draw S&D zones at the wrong candle. The zone is the base consolidation before the impulse, not the reversal tip. IBI structure, boundary placement, freshness grading, and regime alignment — four steps to draw zones that hold.",
    hook:              "The zone is not the reversal tip. It is the base before the impulse. Get that right and the levels stop moving.",
    primaryKeyword:    "how to draw supply demand zones",
    secondaryKeywords: [
      "supply demand zones tradingview",
      "supply and demand zones trading",
      "supply demand zone indicator",
      "identify supply demand zones",
      "supply demand zones strategy",
    ],
    audienceTier:      "T2",
    pillar:            3,
    datePublished:     "2026-06-04",
    readMinutes:       10,
    heroImage:         "/blog-images/indian/BANKNIFTY_2026-05-09_10-57-23.png",
    heroAlt:           "Golden Indicator on a BANKNIFTY chart — supply and demand zones auto-tagged at reactive structural levels",
  },
  {
    slug:              "trading-course-for-beginners",
    title:             "Trading Course for Beginners — Five Concepts Before You Look at a Signal",
    metaTitle:         "Trading Course for Beginners · Five Concepts First",
    metaDescription:   "Most trading courses skip market context. Five foundational concepts that decide whether any signal is worth taking. Educational.",
    excerpt:           "Most beginner trading courses teach entries. None teach context — the regime, structure, and key levels that decide whether the entry belongs on the chart.",
    hook:              "Five concepts before you look at a signal. Context is the course no one teaches.",
    primaryKeyword:    "trading course for beginners",
    secondaryKeywords: [
      "trading course for beginners uk",
      "learn to trade indicators",
      "how to start trading",
      "trading for beginners",
      "understand trading indicators",
    ],
    audienceTier:      "T3",
    pillar:            4,
    datePublished:     "2026-06-03",
    readMinutes:       10,
    heroImage:         "/blog-images/indian/NIFTY_2026-05-09_10-56-17.png",
    heroAlt:           "Golden Indicator on a NIFTY chart — regime classification and structural levels visible at a glance for beginner traders",
  },
  {
    slug:              "trading-tools-one-time-payment",
    title:             "Trading Tools One-Time Payment — The Owner's Checklist",
    metaTitle:         "Trading Tools One-Time Payment vs Subscription · EasyTradeSetup",
    metaDescription:   "Subscription indicators charge you every month forever. Five questions that decide whether a one-time trading tool is worth more than its sticker. Educational.",
    excerpt:           "A subscription at $40/month costs over $1,400 across three years. Five questions separate the one-time licences worth owning from the ones that recreate subscription risk under a different name.",
    hook:              "Five questions before you buy any trading tool. The sticker price is the easiest part.",
    primaryKeyword:    "trading tools one time payment",
    secondaryKeywords: [
      "lifetime trading indicator no monthly fee",
      "no subscription trading indicator",
      "tradingview indicator one time purchase",
      "pine script one time licence",
      "best trading tools one time payment",
    ],
    audienceTier:      "T1",
    pillar:            2,
    datePublished:     "2026-06-02",
    readMinutes:       9,
    heroImage:         "/blog-images/us/US30_2026-05-09_11-02-41.png",
    heroAlt:           "Golden Indicator on a US30 chart — decision-grade regime and structure context, no subscription required",
  },
  {
    slug:              "luxalgo-alternative",
    title:             "LuxAlgo Alternative — Stop Renting Your Indicator (4 Questions)",
    metaTitle:         "LuxAlgo Alternative · One-Time vs Subscription · EasyTradeSetup",
    metaDescription:   "A subscription means you pay forever. Four honest questions to compare a LuxAlgo-style subscription against a one-time, editable, no-repaint indicator. Educational.",
    excerpt:           "A monthly subscription charges you for as long as you trade. Four questions — cost, editability, repaint, and what it actually decides — that compare a subscription indicator against an owned one-time licence.",
    hook:              "Stop renting your indicator. Four questions decide a subscription vs a one-time licence.",
    primaryKeyword:    "luxalgo alternative",
    secondaryKeywords: [
      "one-time payment trading indicator",
      "lifetime licence indicator no monthly fee",
      "luxalgo vs",
      "tradingview indicator no subscription",
      "no repaint indicator alternative",
    ],
    audienceTier:      "T1",
    pillar:            2,
    datePublished:     "2026-06-01",
    readMinutes:       8,
    heroImage:         "/blog-images/generic/decision-grade-baseline.png",
    heroAlt:           "Golden Indicator decision layer — regime, structure, and key levels on a chart, owned outright rather than rented by subscription",
  },
  {
    slug:              "best-indicator-for-nifty-options",
    title:             "Best Indicator for NIFTY Options — 4 Questions That Decide It",
    metaTitle:         "Best Indicator for NIFTY Options · EasyTradeSetup",
    metaDescription:   "Most NIFTY indicators are signals dressed up as analysis. Four questions that separate a decision-grade tool from noise. Educational, not advice.",
    excerpt:           "Most NIFTY indicators paint signals on every bar and call it analysis. Four questions to separate a decision-grade tool from a colourful liability.",
    hook:              "Four questions that decide whether your NIFTY indicator earns its place on your chart.",
    primaryKeyword:    "best indicator for nifty options",
    secondaryKeywords: [
      "nifty intraday indicator",
      "tradingview indicator nifty",
      "nifty options strategy indicator",
      "no repaint indicator nifty",
      "banknifty indicator",
    ],
    audienceTier:      "T1",
    pillar:            1,
    datePublished:     "2026-05-09",
    readMinutes:       8,
    heroImage:         "/blog-images/indian/NIFTY_2026-05-09_10-56-54.png",
    heroAlt:           "Golden Indicator on a NIFTY 50 chart — regime, structure, and key levels overlaid on price",
  },
  {
    slug:              "are-paid-trading-signals-worth-it",
    title:             "Are Paid Trading Signals Worth It? Run These 4 Numbers First.",
    metaTitle:         "Are Paid Trading Signals Worth It? · EasyTradeSetup",
    metaDescription:   "Four numbers decide your edge — none of which a signal seller can control for you. Honest math on paid trading signals. Educational, not advice.",
    excerpt:           "Signals optimise the seller's economics, not yours. Four numbers that decide every trader's edge — and why none of them belong on someone else's screen.",
    hook:              "Four numbers decide your edge. None of them are on a signal seller's screen.",
    primaryKeyword:    "are paid trading signals worth it",
    secondaryKeywords: [
      "paid trading signals review",
      "trading signal scam",
      "telegram trading signals",
      "copy trading worth it",
      "stop following signals",
    ],
    audienceTier:      "T1",
    pillar:            2,
    datePublished:     "2026-05-09",
    readMinutes:       9,
    heroImage:         "/blog-images/indian/BANKNIFTY_2026-05-09_10-59-08.png",
    heroAlt:           "Golden Indicator on a BANKNIFTY chart — structural levels and regime classification visible without any external buy/sell signal",
  },
  {
    slug:              "how-to-trade-spx-overnight-gaps",
    title:             "How to Trade SPX Overnight Gaps — Three Regimes, Three Plays",
    metaTitle:         "SPX Overnight Gap Trading · Three Regimes · EasyTradeSetup",
    metaDescription:   "Most overnight gaps on SPX resolve in one of three ways. Three tells that classify the gap before 9:45 ET — and the play that fits each. Educational, not advice.",
    excerpt:           "Most overnight gaps on SPX behave one of three ways — gap-and-go, gap-fill, or gap-trap. Three tells classify the regime before the first 15 minutes are done.",
    hook:              "Read the gap before the open. The play follows the regime, not the headline.",
    primaryKeyword:    "spx overnight gap trading",
    secondaryKeywords: [
      "s&p 500 gap fill strategy",
      "es futures overnight gap",
      "nasdaq gap and go",
      "spx pre-market analysis",
      "us market open trading",
    ],
    audienceTier:      "T2",
    pillar:            3,
    datePublished:     "2026-05-12",
    readMinutes:       9,
    heroImage:         "/blog-images/us/US30_2026-05-09_11-04-30.png",
    heroAlt:           "Golden Indicator on a US index chart — overnight session, pre-market range, and structural levels marked before the cash open",
  },
  {
    slug:              "trend-vs-range-trading",
    title:             "Trend vs Range Trading — the Decision Behind Every Other Decision",
    metaTitle:         "Trend vs Range Trading · Read the Regime First",
    metaDescription:   "Most retail traders misread the regime — and lose money on the wrong setup. Three tells that decide whether the market is trending or ranging. Educational.",
    excerpt:           "Same chart, three regimes — and every setup behaves differently in each. Three tells that classify the regime, plus why sizing breaks when the regime read is wrong.",
    hook:              "The single decision that decides every other decision in a trade.",
    primaryKeyword:    "trend vs range trading",
    secondaryKeywords: [
      "how to identify market regime",
      "trending vs ranging market",
      "trend following vs mean reversion",
      "market structure indicator",
      "regime classification trading",
    ],
    audienceTier:      "T2",
    pillar:            3,
    datePublished:     "2026-05-12",
    readMinutes:       9,
    heroImage:         "/blog-images/indian/NIFTY_2026-05-09_10-56-36.png",
    heroAlt:           "Golden Indicator on a NIFTY chart — regime classification, structural levels, and supply/demand zones in a single bar-close view",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allPostsSorted(): BlogPost[] {
  return [...POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}
