import { NextResponse } from "next/server";

/**
 * Hero ticker quotes — fetched server-side from Yahoo Finance and cached
 * at the edge for 30s. Free, no API key. Used by <HeroSlider />.
 *
 * Yahoo's chart endpoint is unofficial; we keep the request small (one
 * candle, daily range) and short-circuit on errors so a flake doesn't
 * take the home page down.
 */

export const runtime = "nodejs";

type Symbol = {
  code: "nifty" | "gold" | "us30";
  ticker: string;
  label: string;
  sub: string;
  marketName: string;
  region: "IN" | "GLOBAL" | "US";
};

const SYMBOLS: Symbol[] = [
  { code: "nifty", ticker: "^NSEI",   label: "NIFTY 50",      sub: "NSE · India",       marketName: "NSE",   region: "IN" },
  { code: "gold",  ticker: "GC=F",    label: "GOLD · GC",     sub: "COMEX · Futures",   marketName: "COMEX", region: "GLOBAL" },
  { code: "us30",  ticker: "%5EDJI",  label: "US 30 · DOW",   sub: "Dow Jones · NYSE",  marketName: "NYSE",  region: "US" },
];

type Quote = {
  code: Symbol["code"];
  ticker: string;
  label: string;
  sub: string;
  marketName: string;
  region: Symbol["region"];
  currency: string;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  marketState: "REGULAR" | "PRE" | "POST" | "CLOSED" | "UNKNOWN";
  isLive: boolean;
  lastUpdate: number; // unix seconds
  series: number[]; // mini sparkline (close prices)
  ok: true;
} | {
  code: Symbol["code"];
  ticker: string;
  label: string;
  sub: string;
  marketName: string;
  region: Symbol["region"];
  ok: false;
  error: string;
};

async function fetchOne(s: Symbol): Promise<Quote> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${s.ticker}?interval=15m&range=1d`;
    const res = await fetch(url, {
      headers: {
        // Yahoo throttles requests without a UA.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json,text/plain,*/*",
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return baseFail(s, `upstream ${res.status}`);
    }
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    const m = r?.meta;
    if (!r || !m || typeof m.regularMarketPrice !== "number") {
      return baseFail(s, "no result");
    }

    const price = Number(m.regularMarketPrice);
    const prevClose = Number(m.chartPreviousClose ?? m.previousClose ?? price);
    const change = price - prevClose;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    const marketStateRaw: string = m.marketState ?? "UNKNOWN";
    const marketState: "REGULAR" | "PRE" | "POST" | "CLOSED" | "UNKNOWN" =
      marketStateRaw === "REGULAR" ? "REGULAR" :
      marketStateRaw === "PRE" ? "PRE" :
      marketStateRaw === "POST" || marketStateRaw === "POSTPOST" ? "POST" :
      marketStateRaw === "CLOSED" || marketStateRaw === "PREPRE" ? "CLOSED" :
      "UNKNOWN";

    // Mini sparkline — last ~30 closes.
    const closes: number[] = (r.indicators?.quote?.[0]?.close ?? [])
      .filter((v: number | null) => typeof v === "number") as number[];
    const series = closes.slice(-30);

    return {
      code: s.code,
      ticker: s.ticker,
      label: s.label,
      sub: s.sub,
      marketName: s.marketName,
      region: s.region,
      currency: String(m.currency ?? "USD"),
      price,
      prevClose,
      change,
      changePct,
      marketState,
      isLive: marketState === "REGULAR",
      lastUpdate: Number(m.regularMarketTime ?? Math.floor(Date.now() / 1000)),
      series: series.length > 0 ? series : [price],
      ok: true,
    };
  } catch (e) {
    return baseFail(s, e instanceof Error ? e.message : "fetch failed");
  }
}

function baseFail(s: Symbol, error: string): Quote {
  return {
    code: s.code,
    ticker: s.ticker,
    label: s.label,
    sub: s.sub,
    marketName: s.marketName,
    region: s.region,
    ok: false,
    error,
  };
}

export async function GET() {
  const quotes = await Promise.all(SYMBOLS.map(fetchOne));
  return NextResponse.json(
    { quotes, fetchedAt: Date.now() },
    {
      headers: {
        "cache-control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    },
  );
}
