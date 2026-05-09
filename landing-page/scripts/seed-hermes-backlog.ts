// One-shot: seeds Hermes Agent's GitHub issue backlog with 5 high-priority
// SEO briefs pulled from /docs/seo/keyword-bank.md clusters A + B + C + D + E.
//
// Run once after Hermes is wired up:
//   cd landing-page
//   GITHUB_TOKEN=<your-fine-grained-pat> npx tsx scripts/seed-hermes-backlog.ts
//
// Idempotent: checks for an existing issue with the same title before
// creating, so re-runs are safe (no duplicates).

const REPO = "quantsentra/easytradesetup";
const API  = "https://api.github.com";

type Brief = {
  title:           string;
  primary_keyword: string;
  intent:          string;
  audience_tier:   string;
  internal_links:  string[];
  cta:             string;
  disclaimer:      "inline+footer" | "footer-only" | "none";
  rationale:       string;
  body:            string;
};

const BACKLOG: Brief[] = [
  {
    title:           "Blog brief: best indicator for nifty options",
    primary_keyword: "best indicator for nifty options",
    intent:          "commercial",
    audience_tier:   "T1 — NSE F&O retail, weekly expiry",
    internal_links:  ["/product", "/sample", "/compare", "/docs/faq"],
    cta:             "See the sample → /sample",
    disclaimer:      "inline+footer",
    rationale:       "keyword-bank.md cluster A. ~1.9k IN searches/mo. SERP top 3 are subscription products — gap for one-time-pay angle. We have the credibility from Trade Logic PDF setup library.",
    body:
`## Brief

Draft a blog article targeting "best indicator for nifty options" — Cluster A from \`/docs/seo/keyword-bank.md\`. T1 audience: active NSE F&O retail traders running NIFTY weekly expiries.

## Angle

4 questions that separate a decision-grade indicator from noise:
1. Does it tell you the regime, or just paint signals on every bar?
2. Does it stay sealed and consistent, or repaint?
3. Does it ship with rules + math, or just colours?
4. Does it cost you a subscription forever, or pay once?

Frame Golden Indicator as the answer without overselling. Reference one example from the Trade Logic PDF if useful (educational, not a recommendation).

## Constraints

- Follow \`/docs/seo/brand-voice.md\` — no "guaranteed", "secret", "100%", emojis in body
- Inline risk callout in any section that names a setup or P&L hypothetical
- Footer disclaimer block mandatory
- Do NOT name specific competitor brands — internal-only positioning lives in \`/docs/seo/competitor-watchlist.md\`
- 1,200–1,800 words

## Internal links (≥3 of these)

- /product
- /sample
- /compare
- /docs/faq

## Soft CTA

"See the sample → /sample"

## Acceptance

- [ ] Draft committed to \`/content/blog/best-indicator-for-nifty-options.md\` per \`_TEMPLATE-blog-article.md\` frontmatter schema
- [ ] PR opened, this issue linked
- [ ] Pre-merge checklist in \`/docs/seo/publishing-rules.md\` ticked
- [ ] Human approval before merge`,
  },
  {
    title:           "Blog brief: are paid trading signals worth it",
    primary_keyword: "are paid trading signals worth it",
    intent:          "informational + mid-funnel",
    audience_tier:   "T1 — retail traders signal-fatigued",
    internal_links:  ["/product", "/sample", "/compare", "/legal/disclaimer"],
    cta:             "Skim the sample → /sample",
    disclaimer:      "inline+footer",
    rationale:       "keyword-bank.md cluster B. Low-difficulty, ~720 searches/mo global. Mid-funnel — readers who've been burned by signals are warm to a one-time-pay tool. Strong objection-handling for /checkout.",
    body:
`## Brief

Draft a blog article targeting "are paid trading signals worth it" — Cluster B from \`/docs/seo/keyword-bank.md\`. Audience: retail traders mid-burn-out from telegram channels and copy-trading services.

## Angle

The 4 numbers that decide your edge — none of which a signal-seller can control for you:
1. Win rate
2. Avg R per trade
3. Sample size
4. Drawdown tolerance

Show that signals optimise the seller's economics, not the buyer's. Educational framing, no competitor naming.

## Constraints

- Soft tone — readers are tired, not stupid. No moralising.
- Inline risk callout where math is shown (expectancy formula etc)
- No specific stock or strike examples
- No "guaranteed" / "100% accuracy" anywhere — this is exactly the topic where banned terms creep in by accident
- 1,000–1,500 words

## Internal links

- /product
- /sample
- /compare
- /legal/disclaimer

## Soft CTA

"Skim the sample → /sample"

## Acceptance

- [ ] Draft committed to \`/content/blog/are-paid-trading-signals-worth-it.md\`
- [ ] PR opened, this issue linked
- [ ] Pre-merge checklist ticked
- [ ] Human approval before merge`,
  },
  {
    title:           "Blog brief: trend vs range trading",
    primary_keyword: "trend vs range trading",
    intent:          "informational",
    audience_tier:   "T2 — swing/positional, top-funnel",
    internal_links:  ["/product", "/sample", "/docs/faq", "/docs/install"],
    cta:             "See the sample → /sample",
    disclaimer:      "inline+footer",
    rationale:       "keyword-bank.md cluster C. ~1.3k searches/mo global, low difficulty. Top-funnel for T2. Lays the groundwork for product framing as a 'regime detector first, signals second'.",
    body:
`## Brief

Draft a blog article targeting "trend vs range trading" — Cluster C from \`/docs/seo/keyword-bank.md\`. T2 audience: swing/positional traders, equities + commodities, India + global.

## Angle

The single decision that decides every other one. Walk through:
- How most retail traders misread the regime (treating range as trend, vice versa)
- 2–3 tells that tip the regime (HH/HL stack, ATR contraction, volume profile)
- Why this matters for sizing — same setup, different regime = different stop, different R:R
- Tooling — what good regime-detection looks like in an indicator (foreshadow Golden Indicator, don't pitch hard)

## Constraints

- Use a historical example, state the date range explicitly
- Inline risk callout where stop placement is discussed
- 1,400–2,000 words (this one carries weight, give it room)

## Internal links

- /product
- /sample
- /docs/faq
- /docs/install

## Soft CTA

"See the sample → /sample"

## Acceptance

- [ ] Draft committed to \`/content/blog/trend-vs-range-trading.md\`
- [ ] PR opened, this issue linked
- [ ] Pre-merge checklist ticked
- [ ] Human approval before merge`,
  },
  {
    title:           "Blog brief: 1 percent risk rule trading (NIFTY math)",
    primary_keyword: "1 percent risk rule trading",
    intent:          "informational + how-to",
    audience_tier:   "T2/T4 — risk math, evergreen",
    internal_links:  ["/product", "/pricing", "/docs/faq"],
    cta:             "See the bundle → /product",
    disclaimer:      "footer-only",
    rationale:       "keyword-bank.md cluster D. ~1.6k searches/mo global. Evergreen, low-difficulty, math-heavy = builds authority. Bridges to the Risk Calculator inside /product.",
    body:
`## Brief

Draft a blog article targeting "1 percent risk rule trading" with a NIFTY-specific worked example — Cluster D from \`/docs/seo/keyword-bank.md\`. T2/T4 audience.

## Angle

Stop saying "risk 1%" and start showing the maths.

- ₹10,000 account, 1% rule = ₹100 max risk per trade
- NIFTY weekly option lot size 75. Premium ₹X. Stop ₹Y.
- How many lots? Most retail gets this wrong by 5×.
- Build the formula step-by-step, no algebra hand-waving.
- Tie to the Risk Calculator inside the bundle.

## Constraints

- This piece can be heavier on numbers — that's the point
- Footer disclaimer is fine (no setup/P&L hypothetical)
- No specific stock recommendation
- 900–1,400 words

## Internal links

- /product
- /pricing
- /docs/faq

## Soft CTA

"See the bundle → /product"

## Acceptance

- [ ] Draft committed to \`/content/blog/one-percent-risk-rule-nifty.md\`
- [ ] PR opened, this issue linked
- [ ] Pre-merge checklist ticked
- [ ] Human approval before merge`,
  },
  {
    title:           "Blog brief: tradingview free vs pro — what you actually need",
    primary_keyword: "tradingview free vs pro",
    intent:          "comparison",
    audience_tier:   "T2/T3 — TradingView craft, comparison-stage",
    internal_links:  ["/product", "/sample", "/docs/install", "/compare"],
    cta:             "Skim the sample → /sample",
    disclaimer:      "footer-only",
    rationale:       "keyword-bank.md cluster E. ~4.8k searches/mo global, high difficulty BUT high commercial intent. Comparison-stage searcher is close to checkout. Ranking even at #5 is meaningful traffic.",
    body:
`## Brief

Draft a blog article targeting "tradingview free vs pro" — Cluster E from \`/docs/seo/keyword-bank.md\`. T2/T3 audience: TradingView users deciding whether to upgrade.

## Angle

Honest breakdown of what each tier unlocks, what most retail traders actually use, and which Pro features matter for chart-tool buyers (multi-chart, server-side alerts, indicators-per-chart cap).

Position EasyTradeSetup's bundle as "works on Free tier, scales with Pro if you want" — true, no overclaim.

## Constraints

- Cite TradingView's public pricing page as source (link in External citations)
- Footer disclaimer fine — no trading setups discussed
- Note the article gets a "Last reviewed: YYYY-MM-DD" line because TradingView pricing tiers change
- 1,100–1,500 words

## Internal links

- /product
- /sample
- /docs/install
- /compare

## Soft CTA

"Skim the sample → /sample"

## Acceptance

- [ ] Draft committed to \`/content/blog/tradingview-free-vs-pro.md\`
- [ ] PR opened, this issue linked
- [ ] Pre-merge checklist ticked
- [ ] Human approval before merge`,
  },
];

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`\n  ✕ ${name} not set.`);
    console.error(`  Run: ${name}=<token> npx tsx scripts/seed-hermes-backlog.ts\n`);
    process.exit(1);
  }
  return v;
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = envOrThrow("GITHUB_TOKEN");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status} ${path}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

async function existingTitles(): Promise<Set<string>> {
  const list = await gh<Array<{ title: string }>>(
    `/repos/${REPO}/issues?state=all&labels=hermes&per_page=100`,
  );
  return new Set(list.map((i) => i.title));
}

function bodyFor(b: Brief): string {
  return `${b.body}

---

**Hermes compliance**

- Target keyword: \`${b.primary_keyword}\`
- Intent: ${b.intent}
- Audience: ${b.audience_tier}
- Disclaimer: ${b.disclaimer}
- Rationale: ${b.rationale}

Filed by Hermes backlog seed script — human review required before merge. Allowed paths only: \`/content/**\`, \`/docs/seo/**\`. See \`/docs/seo/hermes-agent-operating-rules.md\`.`;
}

async function main() {
  envOrThrow("GITHUB_TOKEN");
  console.log(`Seeding Hermes backlog into ${REPO}…\n`);

  const existing = await existingTitles();
  let created = 0;
  let skipped = 0;

  for (const brief of BACKLOG) {
    const title = `[SEO] ${brief.title}`;
    if (existing.has(title)) {
      console.log(`  · skip (already exists) — ${title}`);
      skipped++;
      continue;
    }
    const issue = await gh<{ number: number; html_url: string }>(
      `/repos/${REPO}/issues`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body:   bodyFor(brief),
          labels: ["seo", "hermes", "blog"],
        }),
      },
    );
    console.log(`  ✓ created #${issue.number} — ${title}`);
    console.log(`    ${issue.html_url}`);
    created++;
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.\n`);
  console.log(`Hermes backlog now visible at:`);
  console.log(`  https://github.com/${REPO}/issues?q=is%3Aopen+label%3Ahermes`);
  console.log(`  https://portal.easytradesetup.com/admin/hermes`);
}

main().catch((e) => {
  console.error(`\n  ✕ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
