# Blog hero images

Drop indicator screenshots here. Claude Code picks the right one when drafting blogs.

## Folder = market region

| Folder | Use for | Example markets |
|---|---|---|
| `indian/`        | Anything about NSE F&O, NIFTY, BANKNIFTY, MIDCAP, FINNIFTY, Indian equities | NIFTY, BANKNIFTY, RELIANCE |
| `us/`            | US indices + equities | SPX, NASDAQ, DOW, AAPL, TSLA |
| `crypto-forex/`  | Crypto pairs + forex pairs | BTC, ETH, EURUSD, GBPJPY |
| `gold/`          | Precious metals + commodities | XAU, XAG, CRUDE, SILVER |
| `generic/`       | Brand visuals, no specific market — use as fallback | "what is an indicator" hero, abstract chart art |

## Naming convention

`<TICKER>-<YYYY-MM-DD>.png`

Examples:
- `indian/NIFTY-2026-05-09.png`
- `indian/BANKNIFTY-2026-05-09.png`
- `us/SPX-2026-05-12.png`
- `crypto-forex/BTC-2026-05-09.png`
- `gold/XAU-2026-05-09.png`
- `generic/decision-grade-2026-05-01.png`

The date should be the date the screenshot was taken — Claude Code prefers the most recent one in the matching folder.

## Specs

- **Format**: PNG or JPG (PNG preferred for chart screenshots)
- **Dimensions**: 1600 × 900 ideal (16:9). Anything ≥ 1200 wide is fine — Next/Image resizes.
- **Content**: a real chart with the Golden Indicator overlay. Crop tight, no TradingView toolbar bleed.
- **Brand**: dark theme TradingView is preferred — matches site palette.

## How Claude Code picks

When drafting a blog, Claude Code:

1. Reads the article topic (NIFTY → indian, SPX → us, BTC → crypto-forex, gold → gold, generic → generic).
2. Lists files in that folder.
3. Picks the **most recent** by date in the filename.
4. If that folder is empty, falls back to `generic/`.
5. If `generic/` is empty too, falls back to `/chart-after.png` (existing brand chart).

The `heroImage` field on the post entry in `landing-page/lib/blog.ts` records exactly which image is used so the choice is auditable.

## To add a new screenshot

1. Take the screenshot in TradingView with Golden Indicator running.
2. Crop to ~16:9.
3. Drop into the right folder with the right name.
4. `git add public/blog-images/<folder>/<file> && git commit -m "blog-images: add <ticker> <date>" && git push`
5. Next blog drafted in that market category will use it automatically.

## Compliance

- These images appear on a **public** website. Only show real chart screenshots taken with your own TradingView account.
- Do **not** include any specific stock recommendation overlay text on the image (e.g. "BUY NOW" arrows). The risk-disclaimer policy applies to images too.
- Brand-only typography. No emojis baked into images.
