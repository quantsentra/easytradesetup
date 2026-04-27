"use client";

import { useState, useTransition } from "react";

// Two modes:
//   <StripeRecoverButton />                — input field + Run button
//   <StripeRecoverButton sessionId="cs_…" compact />  — single replay button
//
// Both POST to /api/admin/stripe-recover. Result is shown inline.

type Result = {
  ok: boolean;
  email?: string | null;
  amount?: number;
  currency?: string;
  alreadyGranted?: boolean;
  entitlementGranted?: boolean;
  warnings?: string[];
  error?: string;
};

export default function StripeRecoverButton({
  sessionId: initialId,
  compact,
}: {
  sessionId?: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [sessionId, setSessionId] = useState(initialId || "");
  const [result, setResult] = useState<Result | null>(null);

  function run() {
    setResult(null);
    const id = sessionId.trim();
    if (!id.startsWith("cs_")) {
      setResult({ ok: false, error: "Session ID must start with cs_" });
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/stripe-recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: id }),
        });
        const json = (await res.json()) as Result;
        setResult({ ...json, ok: res.ok && json.ok });
      } catch (e) {
        setResult({ ok: false, error: e instanceof Error ? e.message : "Network error" });
      }
    });
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="tz-btn"
          style={{ height: 28, padding: "0 12px", fontSize: 11.5 }}
        >
          {pending ? "…" : "Replay"}
        </button>
        {result && (
          <span className="font-mono text-[10.5px]" style={{
            color: result.ok ? "var(--tz-win)" : "var(--tz-loss)",
            letterSpacing: ".06em",
          }}>
            {result.ok
              ? result.alreadyGranted ? "✓ already granted" : "✓ granted + email sent"
              : result.entitlementGranted
                ? "⚠ partial — see details"
                : `✗ ${result.error || "no license written"}`}
          </span>
        )}
        {result?.warnings && result.warnings.length > 0 && (
          <span className="text-[10.5px]" style={{ color: "var(--tz-amber)" }}>
            ⚠ {result.warnings[0]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="cs_live_b1Lv4gqF29qmxbMpzuBJg8…"
          className="tz-input flex-1 font-mono text-[12.5px]"
          disabled={pending}
        />
        <button
          type="button"
          onClick={run}
          disabled={pending || !sessionId.trim()}
          className="tz-btn tz-btn-primary"
          style={{ minWidth: 140 }}
        >
          {pending ? "Replaying…" : "Run fulfilment"}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-3 rounded-lg" style={{
          background: result.ok ? "rgba(31,157,85,0.08)" : "rgba(217,59,59,0.08)",
          border: `1px solid ${result.ok ? "rgba(31,157,85,0.35)" : "rgba(217,59,59,0.35)"}`,
        }}>
          {result.ok ? (
            <>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{
                color: "var(--tz-win)", fontWeight: 700,
              }}>
                {result.alreadyGranted ? "✓ Already granted (no double-fulfil)" : "✓ License granted + email sent"}
              </div>
              <div className="text-[13px]" style={{ color: "var(--tz-ink)" }}>
                Buyer: <strong>{result.email}</strong> · {result.currency?.toUpperCase()} {result.amount?.toFixed(2)}
              </div>
              {result.warnings && result.warnings.length > 0 && (
                <ul className="mt-2 text-[12px] space-y-1" style={{ color: "var(--tz-amber)" }}>
                  {result.warnings.map((w, i) => <li key={i}>⚠ {w}</li>)}
                </ul>
              )}
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{
                color: result.entitlementGranted ? "var(--tz-amber)" : "var(--tz-loss)", fontWeight: 700,
              }}>
                {result.entitlementGranted ? "⚠ Partial fulfilment" : "✗ License not granted"}
              </div>
              <div className="text-[13px]" style={{ color: "var(--tz-ink-dim)" }}>
                {result.error || "See warnings below."}
              </div>
              {result.warnings && result.warnings.length > 0 && (
                <ul className="mt-2 text-[12px] space-y-1" style={{ color: "var(--tz-amber)" }}>
                  {result.warnings.map((w, i) => <li key={i}>⚠ {w}</li>)}
                </ul>
              )}
              <div className="mt-3 text-[11.5px]" style={{ color: "var(--tz-ink-mute)" }}>
                Most common cause: migration <code>019_stripe.sql</code> not run in Supabase, or
                <code> SUPABASE_SERVICE_ROLE_KEY</code> missing in Vercel env.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
