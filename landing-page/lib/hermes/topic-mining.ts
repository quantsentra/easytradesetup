// Turns Reddit hot threads into SEO Task issue briefs. Pure data
// transformation — no network. Tested by feeding RedditPost[] in.
//
// Pipeline:
//   relevant Reddit posts
//   ↓ score with demandScore (lib/hermes/reddit.ts)
//   ↓ cluster by primary keyword theme
//   ↓ dedup against existing GitHub issue titles
//   ↓ build a seo-task.yml-shaped brief body per cluster
//
// Why cluster: 5 threads about "how to read trend" should produce ONE
// blog brief, not 5 near-identical issues.

import {
  type RedditPost,
  isRelevant,
  looksLikeQuestion,
  demandScore,
} from "./reddit";

// Cluster keys. Each maps a regex of post-title fragments to:
//   - the SEO keyword we're targeting
//   - the angle Hermes/Claude Code should take
// Order matters: first matching cluster wins (most specific first).
const CLUSTERS: Array<{
  key:           string;
  match:         RegExp;
  primaryKeyword: string;
  audienceTier:  "T1" | "T2" | "T3" | "T4";
  angle:         string;
  ctaPath:       string;
}> = [
  {
    key:            "regime-detection",
    match:          /\b(trend|range|regime|expansion|contraction|chop)\b/i,
    primaryKeyword: "how to identify market regime",
    audienceTier:   "T2",
    angle:          "Three tells that decide whether the market is trending or ranging — and why your indicator should classify regime BEFORE plotting signals.",
    ctaPath:        "/sample",
  },
  {
    key:            "signal-fatigue",
    match:          /\b(signal|telegram|tip|copy[ -]?trad)/i,
    primaryKeyword: "are paid trading signals worth it",
    audienceTier:   "T1",
    angle:          "The 4 numbers that decide your edge — none of which a signal seller can control. Educational, no competitor naming.",
    ctaPath:        "/sample",
  },
  {
    key:            "indicator-choice",
    match:          /\b(best|top|recommend|choose|pick).+(indicator|tool|setup)/i,
    primaryKeyword: "best tradingview indicator for intraday",
    audienceTier:   "T1",
    angle:          "Four questions that separate decision-grade indicators from colourful noise. Reference the regime / repaint / rules / pricing axes.",
    ctaPath:        "/product",
  },
  {
    key:            "risk-sizing",
    match:          /\b(risk|stop[ -]?loss|stoploss|position.size|lot.size|sizing)/i,
    primaryKeyword: "1 percent risk rule trading",
    audienceTier:   "T2",
    angle:          "Stop saying '1% risk' and start showing the math. Worked NIFTY example with the lot-sizing formula.",
    ctaPath:        "/product",
  },
  {
    key:            "supply-demand",
    match:          /\b(supply.demand|sd zone|s.d zone|order.block|liquidity|smc)/i,
    primaryKeyword: "supply demand zone tradingview",
    audienceTier:   "T2",
    angle:          "Most retail draws S/D zones wrong. 3 rules to fix it. Use historical NIFTY example with date range stated.",
    ctaPath:        "/sample",
  },
  {
    key:            "expiry-options",
    match:          /\b(expiry|weekly options|0dte|gamma|theta decay|premium decay)/i,
    primaryKeyword: "nifty weekly expiry options strategy",
    audienceTier:   "T1",
    angle:          "Why Thursday-afternoon NIFTY trades behave differently. Premium decay math + regime-aware setup selection.",
    ctaPath:        "/product",
  },
  {
    key:            "structure",
    match:          /\b(structure|bos|choch|higher.high|lower.low|swing.point)/i,
    primaryKeyword: "market structure trading explained",
    audienceTier:   "T2",
    angle:          "BOS / CHoCH / HH-HL in plain language. How structure reading replaces 5 indicators on your chart.",
    ctaPath:        "/sample",
  },
  {
    key:            "tradingview-craft",
    match:          /\b(tradingview|pine script|alert|multi.timeframe)/i,
    primaryKeyword: "tradingview pine script v5 tutorial",
    audienceTier:   "T2",
    angle:          "What changed in Pine v5 vs v4 and why your old indicators stopped working. Practical migration notes.",
    ctaPath:        "/docs/install",
  },
];

export type Cluster = {
  key:            string;
  primaryKeyword: string;
  audienceTier:   "T1" | "T2" | "T3" | "T4";
  angle:          string;
  ctaPath:        string;
  threads:        RedditPost[];      // best 1–3 sources
  totalDemand:    number;
};

export function clusterPosts(posts: RedditPost[]): Cluster[] {
  const buckets = new Map<string, Cluster>();

  for (const p of posts) {
    if (!isRelevant(p)) continue;
    if (!looksLikeQuestion(p)) continue;

    const t = p.title;
    const c = CLUSTERS.find((c) => c.match.test(t));
    if (!c) continue;

    const existing = buckets.get(c.key);
    if (existing) {
      existing.threads.push(p);
      existing.totalDemand += demandScore(p);
    } else {
      buckets.set(c.key, {
        key:            c.key,
        primaryKeyword: c.primaryKeyword,
        audienceTier:   c.audienceTier,
        angle:          c.angle,
        ctaPath:        c.ctaPath,
        threads:        [p],
        totalDemand:    demandScore(p),
      });
    }
  }

  // For each cluster keep the top-3 threads by individual demand.
  for (const cl of buckets.values()) {
    cl.threads.sort((a, b) => demandScore(b) - demandScore(a));
    cl.threads = cl.threads.slice(0, 3);
  }

  return Array.from(buckets.values()).sort((a, b) => b.totalDemand - a.totalDemand);
}

// Drop clusters whose primaryKeyword overlaps with an already-open or
// already-closed issue. Keeps the queue from re-seeding the same topic
// every refill.
export function dedupAgainstIssues(
  clusters: Cluster[],
  existingIssueTitles: string[],
): Cluster[] {
  const haystack = existingIssueTitles.join(" | ").toLowerCase();
  return clusters.filter((c) => {
    const needle = c.primaryKeyword.toLowerCase();
    // Match any 4 consecutive words of the keyword phrase against existing
    // issues. Liberal-enough to catch reasonable rewrites.
    const words = needle.split(/\s+/).filter((w) => w.length > 3);
    if (words.length < 2) return !haystack.includes(needle);
    const probe = words.slice(0, Math.min(4, words.length)).join(" ");
    return !haystack.includes(probe);
  });
}

export function briefBodyFor(c: Cluster): string {
  const sources = c.threads.map((t, i) =>
    `${i + 1}. **${t.title.replace(/\n/g, " ").trim()}**\n` +
    `   r/${t.subreddit} · ${t.score} upvotes · ${t.num_comments} comments\n` +
    `   https://www.reddit.com${t.permalink}`,
  ).join("\n\n");

  return `## Demand signal

This brief was opened by the daily Hermes refill scrape because the topic showed real Reddit demand this week:

${sources}

Combined demand score: ${c.totalDemand.toFixed(0)}

## Brief

Draft a blog article targeting **\`${c.primaryKeyword}\`** for audience ${c.audienceTier}.

### Angle

${c.angle}

### Constraints

- Follow \`/docs/seo/brand-voice.md\` — no banned terms (guaranteed, secret, 100%, no loss)
- Inline risk callout in any section that names a setup or P&L hypothetical
- Footer disclaimer block
- Do NOT name specific competitor brands
- 1,000–1,800 words
- Reference the live first article at \`/blog/best-indicator-for-nifty-options\` for tone/structure

### Internal links (≥3)

- ${c.ctaPath}
- /product
- /sample
- /pricing
- /compare

### Soft CTA

"See the sample → ${c.ctaPath}"

### Acceptance

- [ ] Article TSX at \`landing-page/app/(marketing)/blog/<slug>/page.tsx\`
- [ ] Append to \`landing-page/lib/blog.ts\`
- [ ] Paper-trail markdown at \`/content/blog/<slug>.md\`
- [ ] Smoke test row in \`landing-page/tests/e2e/pages.spec.ts\`
- [ ] \`npm run build\` passes
- [ ] Direct push to main acceptable per current sales-priority shipping mode

---

_Filed by daily Hermes refill scrape — human review before merge._`;
}

export function titleFor(c: Cluster): string {
  return `[SEO] Blog brief: ${c.primaryKeyword}`;
}
