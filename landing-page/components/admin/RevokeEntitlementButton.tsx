"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Confirm-then-delete button for /admin/customers. Two-click pattern:
// first click flips to "Confirm?" state; second click POSTs the revoke.
// 5-second auto-cancel returns to idle if the operator wanders off.

export default function RevokeEntitlementButton({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function arm() {
    setError(null);
    setArmed(true);
    setTimeout(() => setArmed(false), 5_000);
  }

  function fire() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/entitlement-revoke", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `HTTP ${res.status}`);
          setArmed(false);
          return;
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
        setArmed(false);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={armed ? fire : arm}
        disabled={pending}
        title={`Hard-delete entitlement for ${email}`}
        className="tz-btn"
        style={{
          height: 26,
          padding: "0 10px",
          fontSize: 11,
          color: armed ? "#fff" : "var(--tz-loss)",
          background: armed ? "var(--tz-loss)" : "transparent",
          borderColor: "var(--tz-loss)",
        }}
      >
        {pending ? "…" : armed ? "Confirm delete" : "Revoke"}
      </button>
      {error && (
        <span className="font-mono text-[10px]" style={{ color: "var(--tz-loss)" }}>
          ✗ {error}
        </span>
      )}
    </div>
  );
}
