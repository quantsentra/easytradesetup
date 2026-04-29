import { createSupabaseAdmin } from "@/lib/supabase/server";

// Endpoints the uptime cron pings every run. Keep small — Vercel cron
// invocation is paid per-run and we want fast cold-start cost. Critical
// public-facing URLs only; admin / portal pages are auth-gated and not
// useful to ping unauthenticated.
export const UPTIME_TARGETS: ReadonlyArray<{ url: string; label: string }> = [
  { url: "https://www.easytradesetup.com/",         label: "Home" },
  { url: "https://www.easytradesetup.com/pricing",  label: "Pricing" },
  { url: "https://www.easytradesetup.com/checkout", label: "Checkout" },
  { url: "https://www.easytradesetup.com/api/health", label: "API health" },
  { url: "https://portal.easytradesetup.com/sign-in", label: "Sign-in" },
];

export type Ping = {
  url: string;
  status: number;
  ok: boolean;
  latency_ms: number;
  error: string | null;
};

export async function pingOne(url: string): Promise<Ping> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual", // 30x is acceptable for uptime; capture explicit code
      cache: "no-store",
      // Hard timeout so a stuck endpoint can't blow our cron budget.
      signal: AbortSignal.timeout(8_000),
      headers: { "user-agent": "ets-uptime-bot/1.0" },
    });
    const ok = res.status >= 200 && res.status < 400;
    return {
      url,
      status: res.status,
      ok,
      latency_ms: Date.now() - start,
      error: ok ? null : `HTTP ${res.status}`,
    };
  } catch (e) {
    return {
      url,
      status: 0,
      ok: false,
      latency_ms: Date.now() - start,
      error: (e instanceof Error ? e.message : String(e)).slice(0, 200),
    };
  }
}

export async function recordPings(pings: Ping[]): Promise<void> {
  const admin = createSupabaseAdmin();
  await admin.from("uptime_pings").insert(
    pings.map((p) => ({
      url: p.url,
      status: p.status,
      ok: p.ok,
      latency_ms: p.latency_ms,
      error: p.error,
    })),
  );
}

export type UptimeRow = {
  id: number;
  url: string;
  status: number;
  ok: boolean;
  latency_ms: number;
  error: string | null;
  ran_at: string;
};

export type UptimeSummary = {
  url: string;
  label: string;
  ok: boolean;
  status: number;
  latency_ms: number | null;
  ran_at: string | null;
  uptime_24h_pct: number | null;
  total_24h: number;
  failed_24h: number;
  recent: UptimeRow[];
};

// Read latest ping per URL + 24-hour uptime + recent history. Single round-trip
// to Postgres via two queries; cached 30s so the admin page reload doesn't
// rehammer the DB.
export async function loadUptimeSummary(): Promise<UptimeSummary[]> {
  const admin = createSupabaseAdmin();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await admin
    .from("uptime_pings")
    .select("*")
    .gte("ran_at", since)
    .order("ran_at", { ascending: false });

  if (error) {
    console.error("[uptime] load failed", error);
    return UPTIME_TARGETS.map((t) => emptySummary(t));
  }

  const byUrl = new Map<string, UptimeRow[]>();
  for (const r of rows as UptimeRow[]) {
    const list = byUrl.get(r.url) ?? [];
    list.push(r);
    byUrl.set(r.url, list);
  }

  return UPTIME_TARGETS.map((t) => {
    const all = byUrl.get(t.url) ?? [];
    if (!all.length) return emptySummary(t);
    const latest = all[0];
    const failed = all.filter((r) => !r.ok).length;
    return {
      url: t.url,
      label: t.label,
      ok: latest.ok,
      status: latest.status,
      latency_ms: latest.latency_ms,
      ran_at: latest.ran_at,
      uptime_24h_pct: all.length
        ? Math.round(((all.length - failed) / all.length) * 1000) / 10
        : null,
      total_24h: all.length,
      failed_24h: failed,
      recent: all.slice(0, 24), // ~last 2 hours at 5-min cadence
    };
  });
}

function emptySummary(t: { url: string; label: string }): UptimeSummary {
  return {
    url: t.url,
    label: t.label,
    ok: false,
    status: 0,
    latency_ms: null,
    ran_at: null,
    uptime_24h_pct: null,
    total_24h: 0,
    failed_24h: 0,
    recent: [],
  };
}
