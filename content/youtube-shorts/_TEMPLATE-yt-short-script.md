---
type: yt-short-script
status: draft
target_keyword: ""
hook: "" # ≤80 char
duration_seconds: 30 # max 60 (Shorts cap)
audience_tier: ""
disclaimer_required: true
filed_by: "Hermes Agent"
filed_on: ""
---

# YT Short — `<working title>`

## Metadata

- **Hook (first 2 seconds, on-screen + spoken):** `<≤80 char>`
- **YT title:** `<≤60 char, primary keyword in first 30 char>`
- **Description (first 150 char visible above fold):**
  ```
  <2-3 sentences. Educational framing. Soft CTA in last line.>

  Educational content, not investment advice. Trading carries risk.
  Indicator: easytradesetup.com

  #shorts #trading #nifty #tradingview
  ```
- **Hashtags (3-5 max):** `<#shorts is mandatory>`

## Script (frame-by-frame)

| Time | Visual | Voiceover / on-screen text |
|---|---|---|
| 0:00 | `<scene>` | `<text — must match hook>` |
| 0:03 | `<scene>` | `<text>` |
| 0:08 | `<scene>` | `<text>` |
| 0:15 | `<scene>` | `<text>` |
| 0:25 | `<scene>` | `<text — payoff line>` |
| 0:28 | end card | `<CTA — soft, e.g. "See sample → easytradesetup.com">` |

## Voice direction

Tone: per [`brand-voice.md`](../../docs/seo/brand-voice.md). Calm, declarative, no hype. No exclamation marks unless genuine surprise.

## Visual direction

- Aspect: 9:16 (1080×1920)
- Brand palette only — see [`brand-voice.md`](../../docs/seo/brand-voice.md)
- No emojis on-screen
- Caption text: white on `rgba(5,7,15,0.75)` panel, `var(--tz-mono)` font

## Risk disclaimer

Last 2 seconds on-screen text:
> Educational. Not investment advice. Trading carries risk.

## Implementation notes

If this Short fits the auto-publisher pipeline, the script gets converted to a static image (theme: `dark-cyan` default, override OK) + audio overlay. Add a row to [`100-day-queue.json`](../../landing-page/admin-assets/content/100-day-queue.json) **after human approval** — Hermes does not edit this file directly.

If this Short is a real video (Opus Clip / phone recording / AI-generated), it bypasses the auto-publisher. Founder uploads manually.

## Acceptance

- [ ] Script ≤30 seconds when read at conversational pace
- [ ] Hook lands in first 2 seconds
- [ ] Disclaimer on-screen
- [ ] No banned terms (no "guaranteed", no "100%", no "secret")
- [ ] Approved by human before queueing or uploading
