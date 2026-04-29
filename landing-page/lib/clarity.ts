// Microsoft Clarity Data Export API client.
//
// Endpoint: GET https://www.clarity.ms/export-data/api/v1/project-live-insights
// Auth:     Authorization: Bearer <CLARITY_API_TOKEN>
// Query:    numOfDays (1-3), dimension1, dimension2, dimension3
// Returns:  array of { metricName, information: [{ ...dimension keys, ... }] }
//
// The API is rate-limited (~10 calls / day per token). All calls in this
// module are server-side (admin-only); we never expose the token to the
// browser.

export type ClarityMetric = {
  metricName: string;
  information: Array<Record<string, string | number>>;
};

export type ClarityDimension =
  | "OS"
  | "Browser"
  | "Device"
  | "Country/Region"
  | "Page"
  | "Referrer"
  | "Source"
  | "Medium"
  | "Campaign";

export type ClarityFetchOptions = {
  numOfDays: 1 | 2 | 3;
  dimension1?: ClarityDimension;
  dimension2?: ClarityDimension;
  dimension3?: ClarityDimension;
};

export type ClarityResult =
  | { ok: true; data: ClarityMetric[] }
  | { ok: false; error: string; status?: number };

const ENDPOINT =
  "https://www.clarity.ms/export-data/api/v1/project-live-insights";

export async function fetchClarityInsights(
  opts: ClarityFetchOptions,
): Promise<ClarityResult> {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    return { ok: false, error: "CLARITY_API_TOKEN not set" };
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("numOfDays", String(opts.numOfDays));
  if (opts.dimension1) url.searchParams.set("dimension1", opts.dimension1);
  if (opts.dimension2) url.searchParams.set("dimension2", opts.dimension2);
  if (opts.dimension3) url.searchParams.set("dimension3", opts.dimension3);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      // Clarity rate-limits to ~10 calls/day per token. Cache aggressively
      // so a single admin page reload doesn't burn the quota.
      next: { revalidate: 60 * 30 }, // 30 min
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error: `Clarity API ${res.status}: ${body.slice(0, 200) || res.statusText}`,
      };
    }

    const data = (await res.json()) as ClarityMetric[];
    return { ok: true, data };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

// Pretty metric names — Clarity returns codes like "Traffic" / "EngagementMetric".
export function metricLabel(name: string): string {
  const map: Record<string, string> = {
    Traffic: "Traffic",
    EngagementMetric: "Engagement",
    ScrollDepth: "Scroll depth",
    PopularPages: "Popular pages",
    "Browser version": "Browser",
    Source: "Traffic source",
    Medium: "Traffic medium",
    Campaign: "Campaign",
    OS: "Operating system",
    Device: "Device",
    "Country/Region": "Country",
    Referrer: "Referrer",
    "JavaScript Errors": "JS errors",
    DeadClickCount: "Dead clicks",
    ExcessiveScroll: "Excessive scroll",
    RageClickCount: "Rage clicks",
    QuickbackClick: "Quick backs",
    ScriptErrorCount: "Script errors",
    ErrorClickCount: "Error clicks",
  };
  return map[name] ?? name;
}
