"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Two modes triggered by the same button:
//
//   active=true  → "Revoke" (soft) → POST /api/admin/entitlement-revoke
//   active=false → "Restore"       → POST /api/admin/entitlement-restore
//
// Hard-delete is the secondary action (kept on the same row) for clearly
// bogus rows (test fixtures, accidental inserts). Two-click confirm
// pattern with 5-second auto-disarm to prevent fat-finger destruction.

export default function RevokeEntitlementButton({
  userId,
  email,
  active = true,
}: {
  userId: string;
  email: string;
  active?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [armed, setArmed] = useState<null | "soft" | "hard" | "restore">(null);
  const [error, setError] = useState<string | null>(null);

  function arm(mode: "soft" | "hard" | "restore") {
    setError(null);
    setArmed(mode);
    setTimeout(() => setArmed((m) => (m === mode ? null : m)), 5_000);
  }

  function fire(mode: "soft" | "hard" | "restore") {
    setError(null);
    startTransition(async () => {
      try {
        const path =
          mode === "restore" ? "/api/admin/entitlement-restore" : "/api/admin/entitlement-revoke";
        const res = await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "restore" ? { userId } : { userId, hard: mode === "hard" },
          ),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `HTTP ${res.status}`);
          setArmed(null);
          return;
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
        setArmed(null);
      }
    });
  }

  // Restore path for already-revoked rows
  if (!active) {
    const a = armed === "restore";
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={a ? () => fire("restore") : () => arm("restore")}
          disabled={pending}
          aria-label={`Restore license for ${email}`}
          title={`Restore license for ${email}`}
          className="tz-btn"
          style={{
            height: 26, padding: "0 10px", fontSize: 11,
            color: a ? "#fff" : "var(--tz-win)",
            background: a ? "var(--tz-win)" : "transparent",
            borderColor: "var(--tz-win)",
          }}
        >
          {pending ? "…" : a ? "Confirm restore" : "Restore"}
        </button>
        {error && (
          <span role="alert" className="font-mono text-[10px]" style={{ color: "var(--tz-loss)" }}>
            ✗ {error}
          </span>
        )}
      </div>
    );
  }

  // Active row → soft revoke (primary) + hard delete (secondary, hidden until soft armed twice)
  const armedSoft = armed === "soft";
  const armedHard = armed === "hard";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={armedSoft ? () => fire("soft") : () => arm("soft")}
          disabled={pending}
          aria-label={`Revoke license for ${email}`}
          title="Soft-delete: row stays, can be restored"
          className="tz-btn"
          style={{
            height: 26, padding: "0 10px", fontSize: 11,
            color: armedSoft ? "#fff" : "var(--tz-loss)",
            background: armedSoft ? "var(--tz-loss)" : "transparent",
            borderColor: "var(--tz-loss)",
          }}
        >
          {pending && armedSoft ? "…" : armedSoft ? "Confirm revoke" : "Revoke"}
        </button>
        <button
          type="button"
          onClick={armedHard ? () => fire("hard") : () => arm("hard")}
          disabled={pending}
          aria-label={`Hard-delete entitlement for ${email}`}
          title="Hard delete: row gone forever, no restore"
          className="tz-btn"
          style={{
            height: 26, padding: "0 8px", fontSize: 10.5,
            color: armedHard ? "#fff" : "var(--tz-ink-mute)",
            background: armedHard ? "var(--tz-ink)" : "transparent",
            borderColor: "var(--tz-ink-mute)",
          }}
        >
          {pending && armedHard ? "…" : armedHard ? "Confirm DELETE" : "Hard delete"}
        </button>
      </div>
      {error && (
        <span role="alert" className="font-mono text-[10px]" style={{ color: "var(--tz-loss)" }}>
          ✗ {error}
        </span>
      )}
    </div>
  );
}
