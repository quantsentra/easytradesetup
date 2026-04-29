import type { Metadata } from "next";
import { loadUptimeSummary, type UptimeSummary } from "@/lib/uptime";

export const metadata: Metadata = { title: "Site health" };
export const dynamic = "force-dynamic";

export default async function AdminSiteHealth() {
  const summaries = await loadUptimeSummary();
  const allUp = summaries.every((s) => s.ok);
  const noData = summaries.every((s) => s.total_24h === 0);

  const totalPings = summaries.reduce((a, s) => a + s.total_24h, 0);
  const totalFails = summaries.reduce((a, s) => a + s.failed_24h, 0);
  const overallUptime =
    totalPings > 0 ? Math.round(((totalPings - totalFails) / totalPings) * 1000) / 10 : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-ink">
            Site health
          </h1>
          <p className="mt-1 text-[14px] text-ink-60">
            Internal uptime monitor — pings every 5 min via Vercel cron. Last 24 h.
          </p>
        </div>
        <StatusPill ok={allUp} noData={noData} />
      </header>

      <section className="tz-card">
        <div className="tz-card-head">
          <h2 className="tz-card-title">Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule">
          <Kpi
            label="Status"
            value={allUp ? "All up" : noData ? "No data" : "Degraded"}
            tone={allUp ? "good" : noData ? "muted" : "bad"}
          />
          <Kpi
            label="24h uptime"
            value={overallUptime != null ? `${overallUptime.toFixed(1)}%` : "—"}
          />
          <Kpi label="Probes / 24h" value={String(totalPings)} />
          <Kpi label="Failures / 24h" value={String(totalFails)} tone={totalFails > 0 ? "bad" : "good"} />
        </div>
      </section>

      {noData && <SetupPanel />}

      <section className="tz-card">
        <div className="tz-card-head">
          <h2 className="tz-card-title">Endpoints</h2>
          <p className="tz-card-sub">Latest result per URL + 24-hour rollup.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-rule">
          {summaries.map((s) => (
            <EndpointCard key={s.url} s={s} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusPill({ ok, noData }: { ok: boolean; noData: boolean }) {
  const cls = noData
    ? "bg-bg-2 text-ink-60 border-rule-2"
    : ok
    ? "bg-up/10 text-up border-up/40"
    : "bg-dn/10 text-dn border-dn/40";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-mono uppercase tracking-widest ${cls}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: noData
            ? "var(--c-ink-40)"
            : ok
            ? "#2DBE6D"
            : "#FF4D4F",
          boxShadow: ok && !noData ? "0 0 8px #2DBE6D" : "none",
        }}
        aria-hidden
      />
      {noData ? "Awaiting data" : ok ? "Operational" : "Degraded"}
    </span>
  );
}

function Kpi({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "good" | "bad" | "muted" | "default";
}) {
  const colorMap: Record<NonNullable<typeof tone>, string> = {
    good: "#2DBE6D",
    bad: "#FF4D4F",
    muted: "var(--c-ink-40)",
    default: "var(--c-ink)",
  };
  return (
    <div className="bg-panel p-5">
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">
        {label}
      </div>
      <div
        className="mt-2 stat-num text-[24px] sm:text-[28px]"
        style={{ color: colorMap[tone] }}
      >
        {value}
      </div>
    </div>
  );
}

function EndpointCard({ s }: { s: UptimeSummary }) {
  return (
    <div className="bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-semibold text-ink truncate">
              {s.label}
            </span>
            <StatusDot ok={s.ok} hasData={s.total_24h > 0} />
          </div>
          <a
            href={s.url}
            target="_blank"
            rel="noopener"
            className="text-[11.5px] font-mono text-ink-40 hover:text-ink-60 truncate block max-w-[320px]"
          >
            {s.url}
          </a>
        </div>
        <div className="text-right flex-none">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">
            24h uptime
          </div>
          <div
            className="mt-1 stat-num text-[18px]"
            style={{
              color:
                s.uptime_24h_pct == null
                  ? "var(--c-ink-40)"
                  : s.uptime_24h_pct >= 99.9
                  ? "#2DBE6D"
                  : s.uptime_24h_pct >= 95
                  ? "#F0C05A"
                  : "#FF4D4F",
            }}
          >
            {s.uptime_24h_pct != null ? `${s.uptime_24h_pct.toFixed(1)}%` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
        <Stat label="Status" value={s.status > 0 ? String(s.status) : "—"} />
        <Stat
          label="Latency"
          value={s.latency_ms != null ? `${s.latency_ms} ms` : "—"}
        />
        <Stat
          label="Last seen"
          value={s.ran_at ? formatRelative(s.ran_at) : "—"}
        />
      </div>

      {s.recent.length > 0 && (
        <div className="mt-4">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40 mb-2">
            Last {s.recent.length} probes
          </div>
          <div className="flex gap-[3px]">
            {[...s.recent].reverse().map((r) => (
              <span
                key={r.id}
                title={`${r.status || "fail"} · ${r.latency_ms}ms · ${formatRelative(r.ran_at)}`}
                className="block w-[6px] h-[22px] rounded-sm"
                style={{
                  background: r.ok ? "#2DBE6D" : "#FF4D4F",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ ok, hasData }: { ok: boolean; hasData: boolean }) {
  return (
    <span
      className="w-2 h-2 rounded-full flex-none"
      style={{
        background: !hasData ? "var(--c-ink-40)" : ok ? "#2DBE6D" : "#FF4D4F",
        boxShadow: hasData && ok ? "0 0 6px #2DBE6D" : "none",
      }}
      aria-hidden
    />
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-40">
        {label}
      </div>
      <div className="mt-0.5 text-ink font-medium tabular-nums">{value}</div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  return `${Math.floor(ms / 86_400_000)}d ago`;
}

function SetupPanel() {
  return (
    <section className="tz-card">
      <div className="tz-card-head">
        <h2 className="tz-card-title">Awaiting cron data</h2>
        <p className="tz-card-sub">First ping fires within 5 min of deploy.</p>
      </div>
      <div className="p-5 sm:p-6 space-y-4 text-[13.5px] text-ink leading-relaxed">
        <p>
          The internal uptime monitor pings every 5 minutes via Vercel cron and writes results into
          the <code className="font-mono text-[12.5px] bg-bg-2 px-1.5 py-0.5 rounded">uptime_pings</code> table.
          If this card never goes away, check:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Migration <code className="font-mono text-[12.5px] bg-bg-2 px-1.5 py-0.5 rounded">023_uptime.sql</code>{" "}
            applied in Supabase SQL editor.
          </li>
          <li>
            <code className="font-mono text-[12.5px] bg-bg-2 px-1.5 py-0.5 rounded">CRON_SECRET</code> env set on
            Vercel (Project Settings → Environment Variables → Production + Preview).
          </li>
          <li>
            Vercel project plan supports cron (Pro tier or higher; Hobby allows 2 crons).
          </li>
          <li>
            Check Vercel → Functions → Cron logs for{" "}
            <code className="font-mono text-[12.5px] bg-bg-2 px-1.5 py-0.5 rounded">/api/cron/uptime</code>.
          </li>
        </ol>
      </div>
    </section>
  );
}
