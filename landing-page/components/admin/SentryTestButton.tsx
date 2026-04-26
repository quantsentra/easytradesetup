"use client";

import { useState, useTransition } from "react";

export default function SentryTestButton() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function fire() {
    setMsg(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/sentry-test", { method: "POST" });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `HTTP ${res.status}`);
          return;
        }
        setMsg(json.message || "Sent.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={fire}
        disabled={pending}
        className="tz-btn"
        title="Fire a deliberate server-side error so Sentry captures it"
      >
        {pending ? "Firing…" : "Fire test error"}
      </button>
      {msg && (
        <span className="font-mono text-[10.5px]" style={{
          color: "var(--tz-win)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}>
          ✓ {msg}
        </span>
      )}
      {error && (
        <span className="font-mono text-[10.5px]" style={{
          color: "var(--tz-loss)",
          letterSpacing: ".04em",
        }}>
          ✗ {error}
        </span>
      )}
    </div>
  );
}
