---
type: seo-brief
status: draft
target_keyword: ""
secondary_keywords: []
search_intent: "" # informational | commercial | comparison | how-to | branded
audience_tier: "" # T1 | T2 | T3 | T4
funnel_stage: "" # top | mid | bottom
proposed_slug: ""
proposed_title: ""
meta_title: "" # ≤60 char
meta_description: "" # ≤155 char
estimated_word_count: 0
linked_keyword_bank_row: ""
disclaimer_required: true
filed_by: "Hermes Agent"
filed_on: "" # YYYY-MM-DD
---

# SEO Brief — `<working title>`

## 1. Why this article

One paragraph: what searcher problem this solves, why now, what the competitor SERP looks like.

## 2. Target query landscape

- Primary keyword: `<>`
- Secondary keywords (3-7): `<>`
- People Also Ask: `<>`
- SERP-feature opportunities: `<featured snippet / video / FAQ box / image pack>`

## 3. Reader job-to-be-done

In one sentence: when someone finishes this article, they should be able to `<verb>` `<object>`.

## 4. Outline (proposed)

- H1: `<title matching primary keyword>`
- H2 — `<section title>`
- H2 — `<section title>`
- H2 — `<section title>`
- H2 — FAQ
- H2 — Closing + soft CTA

## 5. Internal links to land

Minimum 3, max 6. Pull from this allow-list:

- [ ] `/product`
- [ ] `/pricing`
- [ ] `/sample`
- [ ] `/compare`
- [ ] `/docs/faq`
- [ ] `/docs/install`
- [ ] Other blog post: `<>`

## 6. External citations

If the article references data, list 1-3 authoritative sources here. Government / exchange / academic preferred.

- `<source name + URL>`

## 7. CTA strategy

- Primary CTA: `<which page + why this is the right ask for this stage>`
- Secondary CTA: `<>`

## 8. Risk disclaimer

- [ ] Inline callout required (article touches setups / P&L / hypothetical trades)
- [ ] Footer-only sufficient (general/educational, no setups discussed)

Disclaimer wording per [`/docs/seo/brand-voice.md`](../../docs/seo/brand-voice.md).

## 9. Visual assets

- Hero image: `<concept, dimensions, alt text>`
- In-body diagrams: `<count + description>`
- Charts / screenshots: `<TradingView capture? Pine snippet? Indicator overlay?>`

## 10. Implementation notes for Claude Code

After human approval:

- Route: `landing-page/app/blog/<slug>/page.tsx`
- Add to `landing-page/app/sitemap.ts` (priority 0.6)
- Smoke test: append row to `landing-page/tests/e2e/pages.spec.ts`
- JSON-LD: `Article` via `components/seo/JsonLd.tsx`
- Author field: `"EasyTradeSetup Editorial"` until founder bio is in

## 11. Acceptance criteria

- [ ] Brief reviewed and approved by human (issue closed `approved`)
- [ ] Article draft passes [`/docs/seo/publishing-rules.md`](../../docs/seo/publishing-rules.md) checklist
- [ ] No banned terms per [`brand-voice.md`](../../docs/seo/brand-voice.md)
- [ ] Disclaimer present per section 8
