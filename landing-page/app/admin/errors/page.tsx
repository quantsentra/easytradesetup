import Link from "next/link";
import {
  fetchSnapshot,
  sentryConfigured,
  sentryDashboardUrl,
  sentryIssueUrl,
  type SentryIssue,
} from "@/lib/sentry-client";

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

export default async function ErrorsPage() {
  const configured = sentryConfigured();
  const snap = await fetchSnapshot();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Errors.</h1>
          <div className="tz-topbar-sub">
            Sentry issues — surfaced here so you never need to leave admin.
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
              ↗ Sentry
            </a>
          )}
          <Link href="/admin" className="tz-btn tz-btn-primary">← Overview</Link>
        </div>
      </div>

      {/* Not-configured banner */}
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
            Generate a token at{" "}
            <a href="https://sentry.io/settings/account/api/auth-tokens/" target="_blank" rel="noopener"
              style={{ color: "var(--tz-acid-dim)" }}>
              sentry.io → User → Auth Tokens
            </a>{" "}
            with scopes: <code>org:read</code>, <code>project:read</code>, <code>event:read</code>.
          </p>
          <p className="text-[12.5px] leading-relaxed mt-3" style={{ color: "var(--tz-ink-mute)" }}>
            Note: <code>NEXT_PUBLIC_SENTRY_DSN</code> only sends errors <em>to</em> Sentry.
            Reading them <em>back</em> needs the API token above.
          </p>
        </div>
      )}

      {/* Stats strip */}
      {snap && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="tz-kpi acc">
            <div className="tz-kpi-label">Unresolved issues</div>
            <div className="tz-kpi-value tz-num"
              style={{ color: snap.stats.unresolvedTotal > 0 ? "var(--tz-loss)" : "var(--tz-win)" }}>
              {snap.stats.unresolvedTotal}
            </div>
            <div className="tz-kpi-delta">Last 30 days</div>
          </div>
          <div className="tz-kpi">
            <div className="tz-kpi-label">Events · 24h</div>
            <div className="tz-kpi-value tz-num">{snap.stats.rawEvents24h}</div>
            <div className="tz-kpi-delta">Raw error events</div>
          </div>
          <div className="tz-kpi">
            <div className="tz-kpi-label">SDK runtime</div>
            <div className="tz-kpi-value tz-num" style={{ fontSize: 18, color: "var(--tz-acid-dim)" }}>
              client + server + edge
            </div>
            <div className="tz-kpi-delta">@sentry/nextjs · all 3 runtimes</div>
          </div>
        </div>
      )}

      {/* Issues list */}
      {snap && (
        <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="tz-card-head" style={{
            padding: "18px 20px", marginBottom: 0,
            borderBottom: "1px solid var(--tz-border)",
          }}>
            <div>
              <div className="tz-card-title">Recent issues · 30d</div>
              <div className="tz-card-sub">Unresolved, sorted by last-seen.</div>
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
                  padding: "12px 20px",
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
                    }}>
                      {issue.level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <a
                        href={issue.permalink || sentryIssueUrl(issue.shortId)}
                        target="_blank"
                        rel="noopener"
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
                      </a>
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
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Cached 60s · Sentry data near-real-time · Click an issue title to deep-link to Sentry
      </p>
    </>
  );
}
