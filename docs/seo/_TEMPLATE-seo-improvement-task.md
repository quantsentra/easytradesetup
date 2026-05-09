---
type: seo-improvement-task
status: open # open | in-progress | review | shipped | declined
priority: "" # p0 | p1 | p2
estimated_effort: "" # S (≤1h) | M (≤4h) | L (≤1d) | XL (>1d)
target_keyword: ""
affected_pages: []
filed_by: "Hermes Agent"
filed_on: ""
assigned_to: "" # Claude Code | Founder | Hermes
---

# SEO Improvement Task — `<short title>`

## 1. Problem

What is wrong / what could be better. Use data, not vibes.

- Symptom: `<>`
- Evidence: `<GSC query / Lighthouse score / SERP screenshot / etc>`
- Page(s) affected: `<>`

## 2. Hypothesis

Why it's happening. What you think the fix is.

## 3. Proposed fix

### 3.1 Copy changes

- Page: `<>`
- Current: `<>`
- Proposed: `<>`
- Reason: `<>`

### 3.2 Meta changes

- Old `<title>`: `<>`
- New `<title>`: `<>` (≤60 char)
- Old `meta description`: `<>`
- New `meta description`: `<>` (≤155 char)

### 3.3 Internal links to add

- From `<page>` → `<page>` with anchor "`<>`"

### 3.4 Schema / structured data

- Add `<JSON-LD type>` to `<page>`

### 3.5 Other (lighthouse / accessibility / image alt / etc)

- `<>`

## 4. Expected impact

- Metric: `<sessions / impressions / position / CTR>`
- Magnitude: `<>`
- Timeline to observe: `<2 weeks / 1 month>`

## 5. Risks / blast radius

- What could regress?
- Any test that needs to be added or updated?

## 6. Allowed-paths check

This task touches files under:

- [ ] `/content/**` ✅ Hermes can edit
- [ ] `/docs/seo/**` ✅ Hermes can edit
- [ ] `landing-page/app/**` (copy/meta only) ⚠️ Hermes proposes via PR, Claude Code or human implements
- [ ] `landing-page/components/**` (copy only) ⚠️ same
- [ ] anything else 🚫 escalate, do not touch

## 7. Acceptance

- [ ] Approved by human
- [ ] PR opened by Claude Code or Hermes (depending on path)
- [ ] Pre-merge: `npm run build` passes, e2e green
- [ ] Post-merge: GSC tracked for `<>` weeks
