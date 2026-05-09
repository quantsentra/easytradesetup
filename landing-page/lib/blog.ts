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
