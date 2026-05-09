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

Either format works — both are date-sortable:

- `<TICKER>-<YYYY-MM-DD>.png` (simple, one per day)
- `<TICKER>_<YYYY-MM-DD>_<HH-MM-SS>.png` (multiple per day, e.g. TradingView screenshot exports)

Examples:
- `indian/NIFTY-2026-05-09.png`
- `indian/NIFTY_2026-05-09_10-56-54.png`
- `indian/BANKNIFTY_2026-05-09_10-57-23.png`
- `us/US30_2026-05-09_11-02-41.png`
- `crypto-forex/BTCUSDT_2026-05-09_11-01-58.png`
- `gold/XAUUSD_2026-05-09_10-59-45.png`
- `generic/decision-grade-2026-05-01.png`

Claude Code picks the most recent file alphabetically (which equals chronologically because the date is at the start). Both formats sort cleanly.

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
