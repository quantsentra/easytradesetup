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
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function allPostsSorted(): BlogPost[] {
  return [...POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}
