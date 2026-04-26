import { NextResponse } from "next/server";

/**
 * Hero ticker quotes. Fetched server-side and cached at the edge for 5 min,
 * stale-while-revalidate 30 min so transient upstream blips never cause an
 * empty hero on the marketing page.
 *
 * Source chain (per symbol):
 *   1. Yahoo (query2 → query1)        — free, gives intraday sparkline series.
 *   2. Twelve Data /quote             — free tier 800/day with API key.
 *                                       Reliable on Vercel IPs (key auth, no IP block).
 *                                       Crucially the only free source with NIFTY.
 *   3. Stooq CSV                      — free, no key. No NIFTY, but solid for DJI + gold.
 *   4. Baked-in last-known close      — final fallback. Hero never renders empty.
 */

export const runtime = "nodejs";

type Code = "nifty" | "gold" | "us30";

type SymbolDef = {
  code: Code;
  yahooTicker: string;        // e.g. ^NSEI
  stooqTicker: string | null; // e.g. ^dji  (null = no stooq alternative)
  twelveTicker: string | null; // e.g. NIFTY 50:NSE  (null = unsupported on free tier)
  label: string;
  sub: string;
  marketName: string;
  region: "IN" | "GLOBAL" | "US";
  currency: string;
  fallback: { price: number; prevClose: number; series: number[] };
};

const SYMBOLS: SymbolDef[] = [
  {
    code: "nifty",
    yahooTicker: "^NSEI",
    stooqTicker: null,         // Stooq doesn't expose NIFTY for free
    twelveTicker: "NIFTY 50",  // Twelve Data has NIFTY 50 on free tier
    label: "NIFTY 50",
    sub: "NSE · India",
    marketName: "NSE",
    region: "IN",
    currency: "INR",
    fallback: {
      price: 23897.95,
      prevClose: 24173.05,
      series: [24173, 24130, 24080, 24050, 24010, 23980, 23945, 23920, 23900, 23898],
    },
  },
  {
    code: "gold",
    yahooTicker: "GC=F",
    stooqTicker: "gc.f",
    twelveTicker: "XAU/USD",   // Spot gold — close-enough proxy for COMEX GC
    label: "GOLD · GC",
    sub: "COMEX · Futures",
    marketName: "COMEX",
    region: "GLOBAL",
    currency: "USD",
    fallback: {
      price: 4740.9,
      prevClose: 4715.6,
      series: [4715, 4720, 4710, 4725, 4732, 4728, 4735, 4738, 4742, 4740],
    },
  },
  {
    code: "us30",
    yahooTicker: "^DJI",
    stooqTicker: "^dji",
    twelveTicker: "DJI",
    label: "US 30 · DOW",
    sub: "Dow Jones · NYSE",
    marketName: "NYSE",
    region: "US",
    currency: "USD",
    fallback: {
      price: 49230.7,
      prevClose: 49085.8,
      series: [49085, 49120, 49150, 49180, 49200, 49215, 49228, 49232, 49230, 49231],
    },
  },
];

type Quote = {
  code: Code;
  ticker: string;
  label: string;
  sub: string;
  marketName: string;
  region: SymbolDef["region"];
  currency: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  marketState: "REGULAR" | "PRE" | "POST" | "CLOSED" | "UNKNOWN";
  isLive: boolean;
  lastUpdate: number;
  series: number[];
  source: "yahoo" | "twelvedata" | "stooq" | "fallback";
  ok: true;
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function fetchYahoo(s: SymbolDef): Promise<Quote | null> {
  const ticker = encodeURIComponent(s.yahooTicker);
  const hosts = ["query2.finance.yahoo.com", "query1.finance.yahoo.com"];
  for (const host of hosts) {
    try {
      const url = `https://${host}/v8/finance/chart/${ticker}?interval=15m&range=1d`;
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json,*/*" },
        next: { revalidate: 300 },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const r = json?.chart?.result?.[0];
      const m = r?.meta;
      if (!r || !m || typeof m.regularMarketPrice !== "number") continue;

      const price = Number(m.regularMarketPrice);
      const prevClose = Number(m.chartPreviousClose ?? m.previousClose ?? price);
      const change = price - prevClose;
      const changePct = prevClose ? (change / prevClose) * 100 : 0;
      const stateRaw: string = m.marketState ?? "UNKNOWN";
      const marketState: Quote["marketState"] =
        stateRaw === "REGULAR" ? "REGULAR" :
        stateRaw === "PRE" ? "PRE" :
        stateRaw === "POST" || stateRaw === "POSTPOST" ? "POST" :
        stateRaw === "CLOSED" || stateRaw === "PREPRE" ? "CLOSED" :
        "UNKNOWN";

      const closes: number[] = (r.indicators?.quote?.[0]?.close ?? [])
        .filter((v: number | null) => typeof v === "number") as number[];
      const series = closes.slice(-30);

      return baseQuote(s, {
        price,
        prevClose,
        change,
        changePct,
        marketState,
        isLive: marketState === "REGULAR",
        lastUpdate: Number(m.regularMarketTime ?? Math.floor(Date.now() / 1000)),
        series: series.length > 0 ? series : [price],
        source: "yahoo",
      });
    } catch {
      continue;
    }
  }
  return null;
}

async function fetchTwelveData(s: SymbolDef): Promise<Quote | null> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey || !s.twelveTicker) return null;
  try {
    const symbol = encodeURIComponent(s.twelveTicker);
    // /quote = single-call price + day-stats. /time_series for sparkline.
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Free tier sometimes returns { code: 404, status: "error" } — treat as miss.
    if (!json || json.status === "error" || json.code) return null;

    const price = Number(json.close);
    const prevClose = Number(json.previous_close ?? json.open ?? price);
    if (!isFinite(price) || price <= 0) return null;

    const change = price - prevClose;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    const isOpen = json.is_market_open === true || json.is_market_open === "true";
    const ts = json.timestamp ? Number(json.timestamp) : Math.floor(Date.now() / 1000);

    return baseQuote(s, {
      price,
      prevClose,
      change,
      changePct,
      marketState: isOpen ? "REGULAR" : "CLOSED",
      isLive: isOpen,
      lastUpdate: isFinite(ts) ? ts : Math.floor(Date.now() / 1000),
      // Twelve Data /quote doesn't include intraday bars; synthesise a 2-point
      // series so the sparkline still draws a single trend line.
      series: [prevClose, price],
      source: "twelvedata",
    });
  } catch {
    return null;
  }
}

async function fetchStooq(s: SymbolDef): Promise<Quote | null> {
  if (!s.stooqTicker) return null;
  try {
    const ticker = encodeURIComponent(s.stooqTicker);
    const url = `https://stooq.com/q/l/?s=${ticker}&f=sd2t2ohlcv&h&e=csv`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const text = await res.text();
    // Header line then CSV row.
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;
    const cols = lines[1].split(",");
    // Symbol,Date,Time,Open,High,Low,Close,Volume
    const dateStr = cols[1];
    const timeStr = cols[2];
    const open = parseFloat(cols[3]);
    const close = parseFloat(cols[6]);
    if (!isFinite(close) || dateStr === "N/D") return null;

    const change = close - open;
    const changePct = open ? (change / open) * 100 : 0;
    const ts = Date.parse(`${dateStr}T${timeStr}Z`) / 1000;

    return baseQuote(s, {
      price: close,
      prevClose: open,
      change,
      changePct,
      marketState: "UNKNOWN",
      isLive: false,
      lastUpdate: isFinite(ts) ? ts : Math.floor(Date.now() / 1000),
      series: [open, close],
      source: "stooq",
    });
  } catch {
    return null;
  }
}

function fallbackQuote(s: SymbolDef): Quote {
  const price = s.fallback.price;
  const prev = s.fallback.prevClose;
  const change = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;
  return baseQuote(s, {
    price,
    prevClose: prev,
    change,
    changePct,
    marketState: "UNKNOWN",
    isLive: false,
    lastUpdate: Math.floor(Date.now() / 1000),
    series: s.fallback.series,
    source: "fallback",
  });
}

type QuoteCore = Omit<Quote, "code" | "ticker" | "label" | "sub" | "marketName" | "region" | "currency" | "ok">;

function baseQuote(s: SymbolDef, core: QuoteCore): Quote {
  return {
    code: s.code,
    ticker: s.yahooTicker,
    label: s.label,
    sub: s.sub,
    marketName: s.marketName,
    region: s.region,
    currency: s.currency,
    ok: true,
    ...core,
  };
}

async function fetchOne(s: SymbolDef): Promise<Quote> {
  return (
    (await fetchYahoo(s)) ||
    (await fetchTwelveData(s)) ||
    (await fetchStooq(s)) ||
    fallbackQuote(s)
  );
}

export async function GET() {
  const quotes = await Promise.all(SYMBOLS.map(fetchOne));
  return NextResponse.json(
    { quotes, fetchedAt: Date.now() },
    {
      headers: {
        // 5min fresh, then serve stale up to 30min while revalidating in
        // background. Survives multi-minute upstream outages without ever
        // returning empty data.
        "cache-control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    },
  );
}
