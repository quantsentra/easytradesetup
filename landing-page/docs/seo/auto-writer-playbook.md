# SEO Auto-Writer Playbook

**Purpose:** ship one new, on-brand, compliance-safe SEO blog post per run with zero human involvement. A scheduled Claude Code agent follows this file end-to-end. Deterministic enough that any run produces a publishable article in the existing TSX architecture.

> Zero-cost engine: the agent's own generation writes the article — no external LLM API, no paid tooling. Cost = Vercel build minutes only.

---

## 0. Hard gates (never ship if any fail)

1. `npm run build` passes (build command runs `npm test` first — unit + typecheck).
2. The post has the **footer disclaimer** block, jurisdiction-neutral (see §6).
3. No fabricated performance, no testimonials, no "guaranteed"/"profit"/"signal-to-buy" language.
4. Every factual/market claim is either general trading knowledge or hedged ("illustrative", "approximated for teaching"). Worked examples are explicitly labelled illustrative.
5. The slug does not already exist in `lib/blog.ts` `POSTS`.

If a gate fails and can't be fixed in the run, **abort without committing** and log why.

---

## 1. Inputs to read first (every run)

- `landing-page/admin-assets/seo/keyword-research.json` — `headlines[]` with `keyword`, `type`, `opportunity` (high/med/low), `why`. The topic pool.
- `landing-page/lib/blog.ts` — existing `POSTS`. Dedupe against `slug` + `primaryKeyword`.
- This file (the SOP) + one recent article as the structural template, e.g.
  `app/(marketing)/blog/trend-vs-range-trading/page.tsx`.
- `CLAUDE.md` (repo root) — brand discipline, pricing, positioning. USD-only, US/UAE/international focus; NIFTY/BANKNIFTY kept for SEO.

---

## 2. Pick the topic

1. Filter `headlines[]` to `opportunity: "high"` first (then med).
2. Drop any whose intent is already covered by an existing `POSTS` entry (compare `primaryKeyword` + semantic overlap).
3. Pick the single best remaining keyword. Tie-break toward: buyer-intent ("best … indicator", "… worth it", "lifetime licence no monthly fee") > educational > top-of-funnel.
4. Derive a `slug` (kebab-case, ≤ 6 words, keyword-forward) and confirm it's unused.

If the high/med pool is exhausted (all covered), pick an adjacent long-tail variant of an existing pillar (e.g. a market-specific cut: NIFTY → BANKNIFTY → SPX → XAU → BTC) and log that the curated pool is dry so the founder re-runs AnswerThePublic.

---

## 3. Write the article (mirror the template exactly)

New file: `app/(marketing)/blog/<slug>/page.tsx`. Copy the structure of the template article verbatim, swapping content. Sections, in order:

1. `metadata` export — `metaTitle` ≤ 60 char, `metaDescription` ≤ 155 char, canonical, OG + Twitter, all read from `getPost(SLUG)`.
2. `ArticleJsonLd` + `BreadcrumbJsonLd`.
3. **HERO** — breadcrumb nav, eyebrow (cyan mono), `<h1>` with one `grad-text` span, lede `<p>`, meta row ending in amber "Educational, not advice".
4. **HERO IMAGE** — `next/image`, `post.heroImage` / `post.heroAlt`, caption.
5. **TL;DR** — cyan left-border callout, 3–4 sentences.
6. **BODY** — `<div className="blog-prose">`. 1500–2200 words. Real structure:
   - 2–3 intro paragraphs framing the reader's actual problem.
   - 4–7 `<h2>` sections. Use `<ul>`/`<ol>` for checklists, `<strong>` for the tell/term.
   - At least one `<div className="risk-note">` (bold label + hedge) where a claim could be misread as advice.
   - A worked example, explicitly labelled illustrative.
   - An `<h2>FAQ</h2>` with 4–5 `<h3>` questions (these win featured snippets — phrase as real search questions).
   - Internal links: at least `/sample`, `/product`, `/checkout`, and one topical `/indicator/{nifty|banknifty}` or sibling `/blog/...` link.
7. **IN-BODY CTA CARD** — `glass-card`, the three buttons (sample / product / checkout with `<Price variant="amount" />`).
8. **AUTHOR/META FOOTER** — "Last reviewed" + "Reviewed monthly".
9. **FOOTER DISCLAIMER** — see §6 (jurisdiction-neutral wording).
10. **READ NEXT** — two `glass-card-soft` cards linking the two most-related existing posts.
11. `formatDate` helper (copy as-is).

Voice: working price-action trader. Sharp, rules-based, non-hype. No emojis in body. No exclamation marks. Prefer concrete numbers over adjectives. The product is a *chart tool, not a signal service* — "regime first, structure second, signals never."

---

## 4. Register the post (3 edits)

1. **`lib/blog.ts`** — prepend a `BlogPost` row to `POSTS` with every field: `slug`, `title`, `metaTitle`, `metaDescription`, `excerpt`, `hook`, `primaryKeyword`, `secondaryKeywords` (5), `audienceTier`, `pillar`, `datePublished` (today, YYYY-MM-DD — the agent is told today's date at run time), `readMinutes`, `heroImage`, `heroAlt`. Sitemap picks it up automatically via `allPostsSorted()`.
2. **`tests/e2e/pages.spec.ts`** — add a smoke row: `{ path: "/blog/<slug>", mustContain: /<2-3 distinctive phrases from the article>/i }`.
3. **Read-next links** — optionally update one older post's "Read next" to point at the new one (keeps internal-link graph dense). Not mandatory.

---

## 5. Hero image — be resourceful, stay honest

Don't limit yourself to one screenshot per market. Pick the image that makes the post most compelling and click-worthy, in this priority:

1. **Real Golden Indicator screenshots** (best — authentic product proof). Browse ALL folders under `public/blog-images/`, not just the market-matching one: `indian/` (NIFTY/BANKNIFTY), `us/` (SPX/NASDAQ/DOW), `gold/` (XAU), `crypto-forex/` (BTC/forex), `generic/`. Use whichever real chart best fits the article's angle. List the folder and use a filename that exists — never invent one.
2. **Generate a new on-brand graphic** when no screenshot fits the topic (e.g. a comparison/concept post). You MAY create and commit a new asset to `public/blog-images/generic/` — a branded title card, a concept diagram, or a simple SVG built with code, using the brand palette (navy `#05070F`, electric blue `#2B7BFF`, cyan `#22D3EE`, gold `#F0C05A`). This is encouraged to make posts varied and shareable. Keep it lightweight and text-legible at small sizes (it doubles as the OG/social share image).

**Hard image rules (never break):**
- **No copyrighted, stock, or web-scraped images.** Only real product screenshots already in the repo, or original graphics you generate. If you can't source a safe image, fall back to `generic/decision-grade-baseline.png`.
- **Caption + `heroAlt` must match what the image actually is.** Only call it "Golden Indicator on a <market> chart" if it IS a real product screenshot. A generated concept graphic gets an honest caption ("regime / structure / key-levels decision layer", etc.) — never imply a generated card is a live trade or a real chart.
- No fabricated P&L, no fake "results" overlays, no broker screenshots.

Goal: richer, more varied, more shareable imagery that pulls clicks — without a single misleading or unlicensed picture.

---

## 6. Jurisdiction-neutral disclaimer (REQUIRED footer block)

Business is USD / US / UAE / international now — **do NOT write "SEBI-registered"**. Use:

> Educational content. Not investment advice. Trading carries risk of substantial loss including total capital. EasyTradeSetup is not a registered investment adviser or research analyst in any jurisdiction. Past results do not predict future performance. Worked examples and price references are illustrative for teaching, not recommendations to take any specific trade.

(Older posts still say "SEBI" — leave them unless doing a separate sweep; don't propagate it to new posts.)

---

## 7. Validate + ship

1. `cd landing-page && npm run build` — must pass (runs `npm test` first).
2. If green: `git add` the new `page.tsx`, `lib/blog.ts`, `tests/e2e/pages.spec.ts` (+ any read-next edit). Do **not** stage unrelated WIP (e.g. `lib/instagram.ts`).
3. Commit: `seo: blog — <title>` with a one-line body naming the primary keyword + opportunity tier. Co-author Claude.
4. `git push origin main` → Vercel deploys. New post live + in sitemap within ~2 min.
5. Log: slug shipped, primary keyword, which keyword-research entry it consumed (so the pool drains over runs).

---

## 8. Cadence & dedupe

- One post per run. Weekly schedule = ~52 posts/yr of compounding long-tail.
- Dedupe is by `slug` + `primaryKeyword` overlap against `POSTS`. Never republish a covered intent.
- SEO ranks on a 6–12 week lag — do not expect traffic spikes per post. The play is cumulative coverage of the long tail.
- When the curated `keyword-research.json` pool is exhausted, log it loudly in the commit body so the founder re-runs AnswerThePublic and appends new `headlines[]`.
