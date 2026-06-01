// External funnel links that live outside this app.
//
// TradingView free script (Golden Indicator Free — Key Levels + CPR): the
// public community-library URL, our top-of-funnel discovery channel. Set
// NEXT_PUBLIC_TRADINGVIEW_FREE_URL in Vercel once the script is published
// public on TradingView. Until it's set, every "free on TradingView" CTA
// stays hidden (no dead links shipped).
export const TRADINGVIEW_FREE_URL =
  process.env.NEXT_PUBLIC_TRADINGVIEW_FREE_URL || "";

export const hasTradingViewFree = (): boolean => TRADINGVIEW_FREE_URL.length > 0;
