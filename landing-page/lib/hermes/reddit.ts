// Free unauthenticated Reddit reader. Scrapes top-of-week hot threads
// from a small list of trader-relevant subreddits. Used by the
// /api/admin/hermes/refill-backlog endpoint to auto-file SEO Task
// issues without requiring an Anthropic API key.
//
// No Reddit OAuth needed — public listing JSON is fetchable as long as
// we send a polite User-Agent. Rate limit ~60 req/min unauthenticated;
// we make 4 requests per refill call so we're nowhere near it.
//
// If Reddit ever blocks the fetch (429 / blocked), the caller falls
// back to keyword-bank.md clusters as the seed source.

const SUBREDDITS = [
  "IndianStreetBets",
  "options",
  "Daytrading",
  "IndiaInvestments",
];

// Words that signal a real trading question. Anything in TITLE matching
// at least one of these gets through the first filter.
const RELEVANT = [
  "tradingview", "pine script", "indicator",
  "nifty", "banknifty", "bank nifty",
  "option", "options", "expiry",
  "intraday", "scalp", "swing",
  "stop loss", "stoploss", "position siz",
  "regime", "trend", "range",
  "supply", "demand", "price action",
  "structure", "support", "resistance",
];

// Banned keywords — if any present, drop the thread (avoid wading into
// scams / pump groups / specific stock tips that we explicitly don't
// want to write content around).
const BANNED = [
  "telegram channel", "free signal", "premium tip",
  "guaranteed", "100%", "sure shot",
  "joining group", "dm me", "whatsapp",
];

export type RedditPost = {
  subreddit:    string;
  id:           string;
  title:        string;
  selftext:     string;
  url:          string;
  permalink:    string;     // includes the leading slash
  score:        number;
  num_comments: number;
  created_utc:  number;
};

type RedditChild = { kind: "t3"; data: RedditPost };
type RedditListing = { data: { children: RedditChild[] } };

async function fetchSub(sub: string): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${sub}/top.json?t=week&limit=50`;
  try {
    const res = await fetch(url, {
      headers: {
        // Reddit requires a non-default UA — bots without one get
        // rate-limited aggressively. Pretending to be a browser is
        // explicitly allowed by their robots.txt for read-only listing.
        "User-Agent": "easytradesetup-hermes/1.0 (admin demand-scrape, https://www.easytradesetup.com)",
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      // Don't throw — we want partial results across subreddits even if
      // one is blocked.
      return [];
    }
    const body = (await res.json()) as RedditListing;
    return body.data.children
      .filter((c) => c.kind === "t3")
      .map((c) => c.data);
  } catch {
    return [];
  }
}

// Pull weekly-top from all watched subs in parallel, dedup by id, and
// return the combined list. Caller scores + filters from there.
export async function fetchWeeklyHot(): Promise<RedditPost[]> {
  const lists = await Promise.all(SUBREDDITS.map(fetchSub));
  const seen  = new Set<string>();
  const out: RedditPost[] = [];
  for (const list of lists) {
    for (const p of list) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

// First-pass relevance filter. Keep posts where title OR body contain
// at least one RELEVANT term and zero BANNED terms.
export function isRelevant(p: RedditPost): boolean {
  const blob = `${p.title} ${p.selftext}`.toLowerCase();
  if (BANNED.some((b) => blob.includes(b))) return false;
  return RELEVANT.some((r) => blob.includes(r));
}

// "Looks like a question" heuristic. Question-shaped posts make the
// best blog topics — they map cleanly to "people ask this, here's the
// answer" content.
export function looksLikeQuestion(p: RedditPost): boolean {
  const t = p.title.toLowerCase();
  if (t.endsWith("?")) return true;
  return /^(how|what|why|when|where|which|should|can|is|are|do|does)\b/.test(t);
}

// Demand score. Combines upvotes + comments (weighted) + a small
// recency bonus so a 3-day-old viral thread beats a 6-day stale one.
export function demandScore(p: RedditPost): number {
  const ageHours   = (Date.now() / 1000 - p.created_utc) / 3600;
  const recencyMul = Math.max(0.4, 1 - ageHours / (24 * 14)); // decay over 2 weeks
  return (p.score + p.num_comments * 4) * recencyMul;
}
