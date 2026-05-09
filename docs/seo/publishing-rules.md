# Publishing Rules — EasyTradeSetup

> Hard gates between a Hermes draft and a live URL. Non-negotiable.

---

## Pre-publish checklist (every blog article)

- [ ] Brief approved by human (issue closed with `approved` label)
- [ ] Draft reviewed against [`brand-voice.md`](./brand-voice.md) — no banned terms
- [ ] No fabricated quotes, testimonials, or P&L screenshots
- [ ] No specific stock / strike / price-target recommendations
- [ ] Risk disclaimer block present if article touches any setup, P&L hypothetical, or regulatory topic
- [ ] "Educational, not investment advice" footer present
- [ ] Primary keyword appears in `<title>`, H1, first 100 words, and at least one H2
- [ ] Meta title ≤60 char, meta description ≤155 char, both unique
- [ ] ≥3 internal links to product pages (`/product`, `/pricing`, `/sample`, `/compare`, `/docs/*`)
- [ ] ≥1 external citation if any data is referenced
- [ ] Primary image has `alt` text, lazy-loaded
- [ ] JSON-LD `Article` schema in route
- [ ] Added to `app/sitemap.ts` (priority 0.6 default for blog)
- [ ] Smoke test row added to `tests/e2e/pages.spec.ts`
- [ ] `npm run build` passes locally
- [ ] PR has at least one human approver before merge

## Pre-publish checklist (Instagram / YouTube)

The IG + YT auto-publisher uses [`100-day-queue.json`](../../landing-page/admin-assets/content/100-day-queue.json) as source of truth.

- [ ] Caption uses brand voice, no banned terms
- [ ] Hook ≤80 char, no clickbait register
- [ ] Risk disclaimer line included if post discusses setups, P&L, indicators
- [ ] No emojis in YT description (Instagram captions: ≤2 emojis tasteful)
- [ ] Hashtags relevant, no `#guaranteed`, `#sureshot`, `#nolosstrade`
- [ ] Visual rendered at `/admin/content-preview` and approved by human

## Pre-publish checklist (Facebook)

- [ ] Same content as IG repost is fine — no separate approval needed
- [ ] Long-form blog excerpts: include "read full article" link, never paste full article body

## Pre-publish checklist (Newsletter / Daily Notes)

Out of scope for Hermes. Founder writes those.

---

## Author/byline policy

- Founder name + photo placeholder ("TS") today. Until real founder bio is in, blog `author` field stays as `"EasyTradeSetup Editorial"`.
- No fabricated author identities. No AI-portrait avatars.

## Disclaimer placement

| Context | Where the disclaimer goes |
|---|---|
| Blog body discussing a setup or P&L | Inline callout block above the discussion + footer block |
| Blog general (no P&L) | Footer block only |
| IG / YT caption discussing setups | Last 2 lines before hashtags |
| Sample / compare / pricing pages | Existing on-page block (do not move) |

## Cadence guardrails

- No more than 1 blog publish per day. We optimise for compounding traffic on each piece.
- IG + YT auto-publisher already enforces 1 post per platform per day (see [`vercel.json`](../../landing-page/vercel.json) crons).

## Take-down rule

If a published piece gets factually challenged in comments / DMs / email and we can't verify the claim within 48 hours, take it down or add a correction header. Don't argue.

## Versioning

Every published article gets a "Last reviewed: YYYY-MM-DD" line near the top. Hermes refreshes this on monthly review pass.
