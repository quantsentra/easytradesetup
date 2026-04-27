"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Toggle for manual readiness items. POSTs to /api/admin/readiness/toggle
// then refreshes the page so the row's effective state updates.

export default function ReadinessAckButton({
  slug,
  acked,
}: {
  slug: string;
  acked: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function flip() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/readiness/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, done: !acked }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `HTTP ${res.status}`);
          return;
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={flip}
        disabled={pending}
        aria-pressed={acked}
        aria-label={acked ? "Mark as not done" : "Mark as done"}
        className="tz-btn"
        style={{
          height: 26,
          padding: "0 12px",
          fontSize: 11,
          color: acked ? "#fff" : "var(--tz-win)",
          background: acked ? "var(--tz-win)" : "transparent",
          borderColor: "var(--tz-win)",
        }}
      >
        {pending ? "…" : acked ? "✓ Done" : "Mark done"}
      </button>
      {error && (
        <span role="alert" className="font-mono text-[10px]" style={{ color: "var(--tz-loss)" }}>
          ✗ {error}
        </span>
      )}
    </div>
  );
}
