import "server-only";

// Thin server-side client for Sentry's REST API.
// Auth: SENTRY_API_TOKEN env (Sentry → User Settings → Auth Tokens →
// Create New Token with scopes: org:read, project:read, event:read).
// Region: Sentry routes EU and US separately. Our DSN is *.de.sentry.io,
// so the API host is sentry.io but data lives in the de region — Sentry
// resolves region automatically when org slug is included in the path.

const TOKEN = process.env.SENTRY_API_TOKEN;
const ORG = process.env.SENTRY_ORG || "easytradesetup";
const PROJECT = process.env.SENTRY_PROJECT || "easytradesetup";
// EU users hit sentry.io which redirects; passing the region host directly
// avoids the redirect cost.
const HOST = process.env.SENTRY_API_HOST || "https://sentry.io";

export type SentryIssue = {
  id: string;
  shortId: string;
  title: string;
  culprit: string | null;
  level: "fatal" | "error" | "warning" | "info" | "debug";
  status: "resolved" | "unresolved" | "ignored";
  firstSeen: string;
  lastSeen: string;
  count: string;        // Sentry returns string
  userCount: number;
  permalink: string;
  metadata: { type?: string; value?: string; filename?: string };
  project: { id: string; name: string; slug: string };
};

export type SentryStats = {
  unresolvedTotal: number;
  resolvedThisWeek: number;
  rawEvents24h: number;
};

export function sentryConfigured(): boolean {
  return Boolean(TOKEN && ORG && PROJECT);
}

export function sentryDashboardUrl(): string {
  return `${HOST}/organizations/${ORG}/issues/?project=&query=is:unresolved`;
}

export function sentryIssueUrl(shortId: string): string {
  return `${HOST}/organizations/${ORG}/issues/?query=${encodeURIComponent(shortId)}`;
}

async function call<T>(path: string): Promise<T | null> {
  if (!TOKEN) return null;
  try {
    const url = `${HOST}${path}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
      // Cache for 60s — Sentry data is near-real-time but admin re-renders
      // are infrequent; this batches API calls without losing freshness.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** List recent issues (limit ≤ 100). Default 25 unresolved + recent. */
export async function listRecentIssues(limit = 25): Promise<SentryIssue[]> {
  const path = `/api/0/projects/${ORG}/${PROJECT}/issues/?statsPeriod=30d&limit=${limit}&query=is:unresolved`;
  const data = await call<SentryIssue[]>(path);
  return data || [];
}

type StatsResp = {
  intervals?: string[];
  groups?: Array<{
    totals?: Record<string, number>;
    series?: Record<string, number[]>;
  }>;
};

/** Total event count for a project over a period (e.g. "24h", "7d", "30d"). */
export async function eventCount(period: string): Promise<number> {
  const interval = period === "24h" ? "1h" : period === "7d" ? "6h" : "1d";
  const path = `/api/0/projects/${ORG}/${PROJECT}/stats_v2/?statsPeriod=${period}&interval=${interval}&field=sum(quantity)&category=error`;
  const data = await call<StatsResp>(path);
  if (!data?.groups) return 0;
  return data.groups.reduce(
    (sum, g) => sum + (g.totals?.["sum(quantity)"] || 0),
    0,
  );
}

/** Bucketed event time-series for sparkline / line chart. */
export async function eventsTimeSeries(period: string): Promise<Array<{ time: string; count: number }>> {
  const interval = period === "24h" ? "1h" : period === "7d" ? "6h" : "1d";
  const path = `/api/0/projects/${ORG}/${PROJECT}/stats_v2/?statsPeriod=${period}&interval=${interval}&field=sum(quantity)&category=error`;
  const data = await call<StatsResp>(path);
  if (!data?.intervals || !data?.groups || data.groups.length === 0) return [];
  const series = data.groups[0].series?.["sum(quantity)"] || [];
  return data.intervals.map((time, i) => ({ time, count: series[i] || 0 }));
}

export type SentryEvent = {
  id: string;
  eventID: string;
  title: string;
  dateCreated: string;
  user?: { id?: string; email?: string; username?: string; ip_address?: string } | null;
  tags?: Array<{ key: string; value: string }>;
  entries?: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
  metadata?: { type?: string; value?: string };
  platform?: string;
  context?: Record<string, unknown>;
};

/** Single issue detail. */
export async function getIssue(issueId: string): Promise<SentryIssue | null> {
  return call<SentryIssue>(`/api/0/issues/${issueId}/`);
}

/** Latest event for an issue — has the stack trace + tags + user. */
export async function getLatestEvent(issueId: string): Promise<SentryEvent | null> {
  return call<SentryEvent>(`/api/0/issues/${issueId}/events/latest/`);
}

/** Mutate issue status — resolve or ignore. Requires event:write scope on token. */
export async function updateIssue(
  issueId: string,
  status: "resolved" | "ignored" | "unresolved",
): Promise<boolean> {
  if (!TOKEN) return false;
  try {
    const res = await fetch(`${HOST}/api/0/issues/${issueId}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Aggregate snapshot for the admin tile. Returns null if not configured. */
export async function fetchSnapshot(): Promise<{
  issues: SentryIssue[];
  stats: SentryStats;
  series24h: Array<{ time: string; count: number }>;
  events7d: number;
  events30d: number;
} | null> {
  if (!sentryConfigured()) return null;

  const [issues, ev24, ev7d, ev30d, series] = await Promise.all([
    listRecentIssues(25),
    eventCount("24h"),
    eventCount("7d"),
    eventCount("30d"),
    eventsTimeSeries("24h"),
  ]);

  return {
    issues,
    stats: {
      unresolvedTotal: issues.length,
      resolvedThisWeek: 0,
      rawEvents24h: ev24,
    },
    series24h: series,
    events7d: ev7d,
    events30d: ev30d,
  };
}
