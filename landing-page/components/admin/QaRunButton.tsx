"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Triggers POST /api/admin/qa-run, refreshes the page on success so the
// new run appears at the top of the history table, then routes to the
// new run's drill-down. Errors are shown inline.

type RunResponse = {
  ok: boolean;
  runId?: string | null;
  persistError?: string | null;
  totals?: { total: number; passed: number; warned: number; failed: number };
  durationMs?: number;
  error?: string;
};

export default function QaRunButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  function run() {
    setErr(null);
    setStatus("Running suite — this takes ~15s…");
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/qa-run", { method: "POST" });
        const json = (await res.json()) as RunResponse;
        if (!res.ok || !json.ok) {
          setErr(json.error || "Suite run failed");
          setStatus("");
          return;
        }
        const t = json.totals;
        setStatus(
          t
            ? `Done in ${(json.durationMs! / 1000).toFixed(1)}s — ${t.passed}✓ ${t.warned}⚠ ${t.failed}✗`
            : "Done",
        );
        if (json.persistError) {
          setErr(`Persist warning: ${json.persistError}`);
        }
        if (json.runId) {
          router.push(`/admin/qa/${json.runId}`);
          router.refresh();
        } else {
          router.refresh();
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Network error");
        setStatus("");
      }
    });
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="tz-btn tz-btn-primary"
        style={{ minWidth: 160 }}
      >
        {pending ? "Running suite…" : "Run QA suite"}
      </button>
      {status && (
        <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-ink-dim)" }}>
          {status}
        </span>
      )}
      {err && (
        <span className="font-mono text-[11.5px]" style={{ color: "var(--tz-loss)" }}>
          ✗ {err}
        </span>
      )}
    </div>
  );
}
