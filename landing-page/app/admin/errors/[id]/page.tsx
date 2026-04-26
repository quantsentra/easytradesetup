import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getIssue,
  getLatestEvent,
  sentryConfigured,
  sentryIssueUrl,
  type SentryEvent,
} from "@/lib/sentry-client";
import IssueActions from "@/components/admin/IssueActions";

export const metadata = {
  title: "Error detail · Admin",
  robots: { index: false, follow: false },
};

type StackFrame = {
  filename?: string;
  function?: string;
  module?: string;
  lineNo?: number;
  colNo?: number;
  context?: Array<[number, string]>;
  inApp?: boolean;
};

type ExceptionEntry = {
  type: "exception";
  data: {
    values?: Array<{
      type?: string;
      value?: string;
      stacktrace?: { frames?: StackFrame[] };
    }>;
  };
};

function pickStackFrames(event: SentryEvent | null): StackFrame[] {
  if (!event?.entries) return [];
  for (const entry of event.entries) {
    if (entry.type === "exception") {
      const ee = entry as unknown as ExceptionEntry;
      const values = ee.data?.values || [];
      for (const v of values) {
        if (v.stacktrace?.frames?.length) {
          // Most recent frame last → reverse so top = where it threw.
          return [...v.stacktrace.frames].reverse();
        }
      }
    }
  }
  return [];
}

function exceptionSummary(event: SentryEvent | null): { type: string; value: string } | null {
  if (!event?.entries) return null;
  for (const entry of event.entries) {
    if (entry.type === "exception") {
      const ee = entry as unknown as ExceptionEntry;
      const v = ee.data?.values?.[0];
      if (v) return { type: v.type || "Error", value: v.value || "" };
    }
  }
  if (event?.metadata?.type || event?.metadata?.value) {
    return {
      type: event.metadata.type || "Error",
      value: event.metadata.value || "",
    };
  }
  return null;
}

function relTime(iso: string): string {
  const sec = (Date.now() - Date.parse(iso)) / 1000;
  if (sec < 60) return `${Math.floor(sec)}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86_400)}d ago`;
}

function shortFile(path?: string): string {
  if (!path) return "—";
  if (path.length < 70) return path;
  const parts = path.split(/[/\\]/);
  return parts.length > 3 ? `…/${parts.slice(-3).join("/")}` : path;
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!sentryConfigured()) {
    return (
      <>
        <div className="tz-topbar">
          <h1 className="tz-topbar-title">Error detail.</h1>
        </div>
        <p className="text-[14px]" style={{ color: "var(--tz-ink-dim)" }}>
          Sentry API not configured. Set <code>SENTRY_API_TOKEN</code> in Vercel.
        </p>
      </>
    );
  }

  const [issue, event] = await Promise.all([getIssue(id), getLatestEvent(id)]);
  if (!issue) notFound();

  const exc = exceptionSummary(event);
  const frames = pickStackFrames(event);
  const inAppFrames = frames.filter((f) => f.inApp);
  const displayFrames = inAppFrames.length > 0 ? inAppFrames : frames;

  const tags = (event?.tags || []).slice(0, 12);
  const userInfo = event?.user;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <div className="font-mono text-[10.5px] mb-1" style={{
            color: "var(--tz-acid-dim)",
            letterSpacing: ".14em", textTransform: "uppercase",
          }}>
            {issue.shortId} · {issue.level}
          </div>
          <h1 className="tz-topbar-title" style={{ fontSize: 20, lineHeight: 1.25 }}>
            {issue.title}
          </h1>
          {issue.culprit && (
            <div className="font-mono text-[12px] mt-1" style={{ color: "var(--tz-ink-mute)" }}>
              {issue.culprit}
            </div>
          )}
        </div>
        <div className="tz-topbar-actions">
          <a href={issue.permalink || sentryIssueUrl(issue.shortId)}
            target="_blank" rel="noopener" className="tz-btn">
            ↗ Sentry
          </a>
          <Link href="/admin/errors" className="tz-btn">← Errors</Link>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="tz-kpi">
          <div className="tz-kpi-label">Events</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 24 }}>{issue.count}</div>
          <div className="tz-kpi-delta">All time</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Users affected</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 24 }}>{issue.userCount}</div>
          <div className="tz-kpi-delta">Distinct</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">First seen</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 16 }}>
            {new Date(issue.firstSeen).toISOString().slice(0, 10)}
          </div>
          <div className="tz-kpi-delta">{relTime(issue.firstSeen)}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Last seen</div>
          <div className="tz-kpi-value tz-num" style={{ fontSize: 16 }}>
            {new Date(issue.lastSeen).toISOString().slice(0, 10)}
          </div>
          <div className="tz-kpi-delta">{relTime(issue.lastSeen)}</div>
        </div>
      </div>

      {/* Action row */}
      <div className="tz-card mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="tz-card-title">Status</div>
          <div className="text-[14px] mt-1" style={{ color: "var(--tz-ink-dim)" }}>
            Currently <strong style={{
              color: issue.status === "unresolved" ? "var(--tz-loss)" : "var(--tz-win)",
            }}>{issue.status}</strong>.
          </div>
        </div>
        <IssueActions issueId={issue.id} />
      </div>

      {/* Exception */}
      {exc && (
        <div className="tz-card mb-6">
          <div className="tz-card-title mb-2">Exception</div>
          <div style={{
            fontFamily: "var(--tz-mono)",
            fontSize: 13.5,
            color: "var(--tz-loss)",
            background: "rgba(217,59,59,0.06)",
            border: "1px solid rgba(217,59,59,0.20)",
            borderRadius: 8,
            padding: "12px 14px",
          }}>
            <strong>{exc.type}</strong>
            {exc.value && <>: {exc.value}</>}
          </div>
        </div>
      )}

      {/* Stack trace */}
      <div className="tz-card mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <div className="tz-card-title">Stack trace</div>
            <div className="tz-card-sub">
              {inAppFrames.length > 0
                ? `${inAppFrames.length} in-app frames · top = throw site`
                : `${frames.length} frames (no in-app marker — showing all)`}
            </div>
          </div>
        </div>
        {displayFrames.length === 0 ? (
          <p className="text-[13px]" style={{ color: "var(--tz-ink-mute)" }}>
            No stack trace on the latest event.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {displayFrames.map((frame, i) => (
              <div key={i} style={{
                background: i === 0 ? "rgba(217,59,59,0.04)" : "var(--tz-surface-2)",
                border: i === 0 ? "1px solid rgba(217,59,59,0.20)" : "1px solid var(--tz-border)",
                borderRadius: 8,
                padding: "10px 12px",
                fontFamily: "var(--tz-mono)",
                fontSize: 12,
              }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ color: "var(--tz-acid-dim)", fontWeight: 600 }}>
                    {frame.function || "<anonymous>"}
                  </span>
                  <span style={{ color: "var(--tz-ink-mute)" }}>
                    in {shortFile(frame.filename || frame.module)}
                  </span>
                  {frame.lineNo !== undefined && (
                    <span style={{ color: "var(--tz-ink-dim)" }}>
                      :{frame.lineNo}{frame.colNo !== undefined ? `:${frame.colNo}` : ""}
                    </span>
                  )}
                </div>
                {frame.context && frame.context.length > 0 && i === 0 && (
                  <pre style={{
                    margin: "8px 0 0",
                    padding: "8px 10px",
                    background: "var(--tz-bg-2)",
                    border: "1px solid var(--tz-border)",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--tz-ink)",
                    overflowX: "auto",
                    whiteSpace: "pre",
                    lineHeight: 1.5,
                  }}>
                    {frame.context.map(([lineNo, code]) => (
                      <div key={lineNo} style={{
                        color: lineNo === frame.lineNo ? "var(--tz-loss)" : "var(--tz-ink-dim)",
                        fontWeight: lineNo === frame.lineNo ? 700 : 400,
                      }}>
                        <span style={{
                          color: "var(--tz-ink-mute)",
                          marginRight: 12,
                          userSelect: "none",
                        }}>
                          {String(lineNo).padStart(4, " ")}
                        </span>
                        {code}
                      </div>
                    ))}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags + user */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {tags.length > 0 && (
          <div className="tz-card">
            <div className="tz-card-title mb-3">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={`${t.key}-${t.value}`} className="tz-chip"
                  style={{ fontSize: 11, fontFamily: "var(--tz-mono)" }}>
                  <span style={{ color: "var(--tz-ink-mute)" }}>{t.key}</span>
                  <span style={{ margin: "0 4px" }}>:</span>
                  <span style={{ color: "var(--tz-ink)" }}>{t.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {userInfo && (userInfo.email || userInfo.id || userInfo.username) && (
          <div className="tz-card">
            <div className="tz-card-title mb-3">User context</div>
            <div className="font-mono text-[12.5px]" style={{ color: "var(--tz-ink)" }}>
              {userInfo.email || userInfo.username || userInfo.id}
            </div>
            {userInfo.ip_address && (
              <div className="font-mono text-[11px] mt-1" style={{ color: "var(--tz-ink-mute)" }}>
                IP: {userInfo.ip_address}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Latest event shown · Cached 60s · Sentry deep link for full event history
      </p>
    </>
  );
}
