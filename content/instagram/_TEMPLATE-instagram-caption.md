---
type: ig-caption
status: draft
format: "" # static | carousel | reel
slides: 0 # only if format=carousel
target_keyword: ""
hook: "" # ≤80 char
audience_tier: ""
disclaimer_required: true
filed_by: "Hermes Agent"
filed_on: ""
---

# IG `<format>` — `<working title>`

## Hook (cover slide / first line)

`<≤80 char. The line that earns the next second of attention.>`

## Slide outline (carousel only — 2-10 slides)

1. **Cover** — `<headline + visual concept>`
2. `<slide 2 — one idea>`
3. `<slide 3 — one idea>`
4. `<slide 4 — one idea>`
5. **Payoff** — `<the punchline + soft CTA>`

> One idea per slide. Slide N+1 must justify swiping past slide N.

## Caption (full)

```
<Hook line — same as the cover, repeated for the feed view>

<Body — 3-5 short paragraphs. White space is fine. One idea per paragraph.>

<Soft CTA — "See the sample → easytradesetup.com" or similar>

—
Educational content, not investment advice. Trading carries risk of substantial loss. Past results do not predict future performance.

#tradingview #nifty #banknifty #optionstrading #pricetaction #intraday #indianmarkets #tradingindicator
```

## Caption rules

- ≤2200 char total (IG hard limit), aim for ≤1500.
- ≤2 emojis (allowed but not required). Never in body — only as visual punctuation.
- No banned terms: no "guaranteed", "100%", "no loss", "sure-shot", "secret", "trick".
- Hashtags: 8-15 relevant. Pull from `100-day-queue.json` hashtag pool. No banned tags.
- Disclaimer block mandatory if post discusses any setup, P&L, indicator behaviour.

## Visual brief

- Theme: `<dark-cyan | dark-gold | light-clean | gradient | chart>`
- Aspect: 4:5 (1080×1350) for static + carousel; 9:16 for reels
- Typography: brand only, no third-party fonts
- Color palette: brand only

## Implementation notes

After approval, append a row to [`100-day-queue.json`](../../landing-page/admin-assets/content/100-day-queue.json) — Hermes proposes the JSON snippet but **does not edit the file**. A human pastes it in and pushes.

If this is a one-off (not part of the queue), use the manual workflow at `/admin/content-queue`.

## Acceptance

- [ ] Hook earns the first second
- [ ] Each slide stands alone
- [ ] Caption ≤1500 char
- [ ] Disclaimer present
- [ ] Hashtags relevant, no banned tags
- [ ] Approved by human before queueing
