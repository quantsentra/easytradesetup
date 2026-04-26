import Link from "next/link";
import {
  fetchSnapshot,
  sentryConfigured,
  sentryDashboardUrl,
  type SentryIssue,
} from "@/lib/sentry-client";
import Sparkline from "@/components/admin/Sparkline";
import IssueActions from "@/components/admin/IssueActions";

export const metadata = {
  title: "Errors · Admin",
  robots: { index: false, follow: false },
};

const LEVEL_COLOR: Record<SentryIssue["level"], string> = {
  fatal:   "var(--tz-loss)",
  error:   "var(--tz-loss)",
  warning: "var(--tz-amber)",
  info:    "var(--tz-acid-dim)",
  debug:   "var(--tz-ink-mute)",
};

const LEVEL_BG: Record<SentryIssue["level"], string> = {
  fatal:   "rgba(217,59,59,0.10)",
  error:   "rgba(217,59,59,0.10)",
  warning: "rgba(180,114,22,0.10)",
  info:    "rgba(43,123,255,0.10)",
  debug:   "rgba(21,24,26,0.04)",
};

function relTime(iso: string): string {
  const sec = (Date.now() - Date.parse(iso)) / 1000;
  if (sec < 60) return `${Math.floor(sec)}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604_800) return `${Math.floor(sec / 86_400)}d ago`;
  return new Date(iso).toISOString().slice(0, 10);
}

function fmtHour(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:00`;
}

export default async function ErrorsPage() {
  const configured = sentryConfigured();
  const snap = await fetchSnapshot();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Errors.</h1>
          <div className="tz-topbar-sub">
            Live Sentry feed — single-pane policy: never leave admin.
          </div>
        </div>
        <div className="tz-topbar-actions">
          {configured && (
            <a
              href={sentryDashboardUrl()}
              target="_blank"
              rel="noopener"
              className="tz-btn"
            >
              ↗ Sentry deep
            </a>
          )}
          <Link href="/admin" className="tz-btn tz-btn-primary">← Overview</Link>
        </div>
      </div>

      {!configured && (
        <div className="tz-card mb-6" style={{
          borderColor: "rgba(180,114,22,0.35)",
          background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <h2 style={{ font: "600 16px var(--tz-display)", color: "var(--tz-amber)", margin: "0 0 6px" }}>
            Sentry API not configured
          </h2>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--tz-ink-dim)" }}>
            Set <code>SENTRY_API_TOKEN</code> in Vercel env vars to surface issues here.
            Generate at{" "}
            <a href="https://sentry.io/settings/account/api/auth-tokens/" target="_blank" rel="noopener"
              style={{ color: "var(--tz-acid-dim)" }}>
              sentry.io → User → Auth Tokens
            </a>{" "}
            with scopes: <code>org:read</code>, <code>project:read</code>, <code>event:read</code>,
            and <code>event:write</code> (so resolve/ignore buttons work).
          </p>
        </div>
      )}

      {snap && (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div className="tz-kpi acc">
              <div className="tz-kpi-label">Unresolved</div>
              <div className="tz-kpi-value tz-num"
                style={{ color: snap.stats.unresolvedTotal > 0 ? "var(--tz-loss)" : "var(--tz-win)" }}>
                {snap.stats.unresolvedTotal}
              </div>
              <div className="tz-kpi-delta">Last 30 days</div>
            </div>
            <div className="tz-kpi">
              <div className="flex items-start justify-between gap-2">
                <div style={{ minWidth: 0 }}>
                  <div className="tz-kpi-label">Events · 24h</div>
                  <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>
                    {snap.stats.rawEvents24h}
                  </div>
                </div>
                <Sparkline
                  data={snap.series24h.map((p) => p.count)}
                  width={70}
                  height={26}
                  color="#d93b3b"
                  fillColor="rgba(217,59,59,0.12)"
                  ariaLabel="24h event trend"
                />
              </div>
              <div className="tz-kpi-delta">Hourly</div>
            </div>
            <div className="tz-kpi">
              <div className="tz-kpi-label">Events · 7d</div>
              <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>
                {snap.events7d}
              </div>
              <div className="tz-kpi-delta">Rolling week</div>
            </div>
            <div className="tz-kpi">
              <div className="tz-kpi-label">Events · 30d</div>
              <div className="tz-kpi-value tz-num" style={{ fontSize: 22 }}>
                {snap.events30d}
              </div>
              <div className="tz-kpi-delta">Rolling month</div>
            </div>
          </div>

          {/* 24h chart card */}
          {snap.series24h.length > 0 && (
            <div className="tz-card mb-6">
              <div className="tz-card-head">
                <div>
                  <div className="tz-card-title">Events · last 24h</div>
                  <div className="tz-card-sub">Hourly buckets, UTC.</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 96 }}>
                {snap.series24h.map((p, i) => {
                  const max = Math.max(1, ...snap.series24h.map((b) => b.count));
                  const h = (p.count / max) * 100;
                  return (
                    <div key={i} title={`${fmtHour(p.time)} · ${p.count} events`}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: "100%",
                        height: `${Math.max(2, h)}%`,
                        minHeight: 3,
                        borderRadius: 3,
                        background: p.count > 0
                          ? "linear-gradient(180deg, var(--tz-loss) 0%, rgba(217,59,59,0.4) 100%)"
                          : "var(--tz-surface-3)",
                        opacity: p.count > 0 ? 1 : 0.5,
                      }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 font-mono text-[10px]" style={{
                color: "var(--tz-ink-mute)", letterSpacing: ".08em",
              }}>
                <span>{fmtHour(snap.series24h[0].time)}</span>
                <span>now</span>
              </div>
            </div>
          )}

          {/* Issues list */}
          <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tz-card-head" style={{
              padding: "18px 20px", marginBottom: 0,
              borderBottom: "1px solid var(--tz-border)",
            }}>
              <div>
                <div className="tz-card-title">Unresolved issues · 30d</div>
                <div className="tz-card-sub">Click title to drill into stack trace.</div>
              </div>
            </div>
            {snap.issues.length === 0 ? (
              <p className="text-[13.5px] p-6" style={{ color: "var(--tz-ink-mute)" }}>
                {snap.stats.rawEvents24h > 0
                  ? "No unresolved issues — events are coming through clean. Nice."
                  : "No errors logged yet — Sentry is wired but quiet. That's the goal state."}
              </p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {snap.issues.map((issue) => (
                  <li key={issue.id} style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--tz-border)",
                  }}>
                    <div className="flex items-start gap-3" style={{ alignItems: "flex-start" }}>
                      <span style={{
                        flexShrink: 0,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontFamily: "var(--tz-mono)",
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: LEVEL_COLOR[issue.level] || "var(--tz-ink-mute)",
                        background: LEVEL_BG[issue.level] || "var(--tz-surface-2)",
                        border: `1px solid ${LEVEL_COLOR[issue.level] || "var(--tz-border)"}40`,
                        marginTop: 2,
                      }}>
                        {issue.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/errors/${issue.id}`}
                          style={{
                            color: "var(--tz-ink)",
                            textDecoration: "none",
                            fontWeight: 600,
                            fontSize: 14,
                            display: "block",
                            lineHeight: 1.35,
                          }}
                        >
                          {issue.title}
                        </Link>
                        {issue.culprit && (
                          <div className="font-mono text-[11.5px] mt-1" style={{ color: "var(--tz-ink-mute)" }}>
                            {issue.culprit}
                          </div>
                        )}
                        <div className="text-[11.5px] mt-1.5 flex items-center flex-wrap gap-x-3 gap-y-1"
                          style={{ color: "var(--tz-ink-dim)" }}>
                          <span className="font-mono" style={{ color: "var(--tz-acid-dim)" }}>
                            {issue.shortId}
                          </span>
                          <span>·</span>
                          <span>{issue.count} events</span>
                          <span>·</span>
                          <span>{issue.userCount} users</span>
                          <span>·</span>
                          <span>{relTime(issue.lastSeen)}</span>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <IssueActions issueId={issue.id} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Cached 60s · Resolve/Ignore needs event:write scope on SENTRY_API_TOKEN
      </p>
    </>
  );
}
