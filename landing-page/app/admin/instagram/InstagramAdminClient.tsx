"use client";

import { useState } from "react";

type State = "idle" | "loading" | "ok" | "error";

function ActionButton({
  label,
  onClick,
  primary,
}: {
  label: string;
  onClick: () => Promise<void>;
  primary?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg]     = useState<string | null>(null);

  async function handle() {
    if (state === "loading") return;
    setState("loading");
    setMsg(null);
    try {
      await onClick();
      setState("ok");
      setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : String(e));
      setTimeout(() => setState("idle"), 4000);
    }
  }

  const stateColor =
    state === "ok"      ? "var(--tz-up, #22C55E)" :
    state === "error"   ? "var(--tz-loss, #FF4D4F)" :
    state === "loading" ? "var(--tz-amber, #FFB341)" :
    primary             ? "rgba(43,123,255,0.45)" :
                          "var(--tz-border, rgba(255,255,255,0.08))";

  const prefix =
    state === "ok"      ? "✓ " :
    state === "error"   ? "✕ " :
    state === "loading" ? "… " :
                          "→ ";

  return (
    <button
      type="button"
      onClick={handle}
      disabled={state === "loading"}
      style={{
        padding: "10px 16px",
        background: primary
          ? "linear-gradient(135deg, rgba(43,123,255,0.18), rgba(34,211,238,0.10))"
          : "var(--tz-surface-2, rgba(255,255,255,0.02))",
        border: `1px solid ${stateColor}`,
        borderRadius: 8,
        color: "var(--tz-ink)",
        cursor: state === "loading" ? "wait" : "pointer",
        font: "inherit",
        fontSize: 13,
        fontWeight: 600,
        opacity: state === "loading" ? 0.85 : 1,
        transition: "border-color .15s",
      }}
    >
      {prefix}{state === "ok" ? "done" : state === "error" ? msg?.slice(0, 60) ?? "failed" : label}
    </button>
  );
}

export default function InstagramAdminClient() {
  return (
    <div
      className="tz-card"
      style={{
        padding: 18,
        background: "linear-gradient(135deg, rgba(43,123,255,0.08), rgba(34,211,238,0.04))",
        borderColor: "rgba(43,123,255,0.30)",
      }}
    >
      <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
        Actions
      </h3>

      <div className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
        Queue
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <ActionButton
          primary
          label="Sync queue from JSON → DB"
          onClick={async () => {
            const res = await fetch("/api/admin/content-posts/sync", {
              method: "POST",
              credentials: "same-origin",
            });
            const body = await res.json();
            if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
            location.reload();
          }}
        />
      </div>

      <div className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "#FF6B9D" }}>
        Instagram
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <ActionButton
          label="Test publish IG (manual cron run)"
          onClick={async () => {
            const res = await fetch("/api/admin/content-posts/run-publish", {
              method: "POST",
              credentials: "same-origin",
            });
            const body = await res.json();
            if (!res.ok || !body.ok) throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
            location.reload();
          }}
        />
        <ActionButton
          label="Retry failed IG → pending"
          onClick={async () => {
            const res = await fetch("/api/admin/content-posts/retry-failed", {
              method: "POST",
              credentials: "same-origin",
            });
            const body = await res.json();
            if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
            location.reload();
          }}
        />
      </div>

      <div className="font-mono text-[10.5px] uppercase tracking-widest mb-2" style={{ color: "#FF6B6B" }}>
        YouTube Shorts
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <ActionButton
          label="Test publish YT (manual cron run)"
          onClick={async () => {
            const res = await fetch("/api/admin/content-posts/run-publish-yt", {
              method: "POST",
              credentials: "same-origin",
            });
            const body = await res.json();
            if (!res.ok || !body.ok) throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
            location.reload();
          }}
        />
        <ActionButton
          label="Retry failed YT → pending"
          onClick={async () => {
            const res = await fetch("/api/admin/content-posts/retry-failed-yt", {
              method: "POST",
              credentials: "same-origin",
            });
            const body = await res.json();
            if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
            location.reload();
          }}
        />
      </div>

      <p className="text-[11.5px] mt-4" style={{ color: "var(--tz-ink-mute)", margin: "16px 0 0", lineHeight: 1.5 }}>
        <strong>Sync</strong> imports new days from <code>14-day-queue.json</code> without overwriting already-published rows.
        <strong> Test publish</strong> runs the same cron logic the scheduler runs daily.
      </p>
    </div>
  );
}
