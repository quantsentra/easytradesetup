// Live market data for the ticker bar.
//
// Crypto prices come from CoinGecko's free public API (no key, CORS-open).
// Indices / forex / commodities free real-time data is paywalled, so they
// stay as symbol ribbons without quotes until a paid data provider is wired.
//
// Fetch is server-side only (Next server component). Revalidates every 60s.
// If the upstream fails or times out, we silently fall back to an empty
// quote set so the symbol ribbon still renders.

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price" +
  "?ids=bitcoin,ethereum,solana,ripple" +
  "&vs_currencies=usd&include_24hr_change=true";

export type LiveQuote = {
  symbol: string;       // e.g. "BTC / USD"
  price: number;        // last in USD
  changePct: number;    // 24h % change
};

type CoinGeckoResp = Record<string, { usd: number; usd_24h_change: number }>;

const GECKO_MAP: Array<{ id: string; symbol: string }> = [
  { id: "bitcoin",  symbol: "BTC / USD" },
  { id: "ethereum", symbol: "ETH / USD" },
  { id: "solana",   symbol: "SOL / USD" },
  { id: "ripple",   symbol: "XRP / USD" },
];

export async function fetchLiveQuotes(): Promise<LiveQuote[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4_000);
    const res = await fetch(COINGECKO_URL, {
      signal: controller.signal,
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = (await res.json()) as CoinGeckoResp;
    const out: LiveQuote[] = [];
    for (const { id, symbol } of GECKO_MAP) {
      const row = data[id];
      if (!row || typeof row.usd !== "number") continue;
      out.push({
        symbol,
        price: row.usd,
        changePct: typeof row.usd_24h_change === "number" ? row.usd_24h_change : 0,
      });
    }
    return out;
  } catch {
    return [];
  }
}

export function formatPrice(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 1)    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function formatChange(pct: number): string {
  const s = pct >= 0 ? "+" : "";
  return `${s}${pct.toFixed(2)}%`;
}
