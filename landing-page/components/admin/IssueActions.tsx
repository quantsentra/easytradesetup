"use client";

import { useTransition, useState } from "react";
import { resolveIssue, ignoreIssue } from "@/app/admin/errors/actions";

export default function IssueActions({ issueId }: { issueId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"resolved" | "ignored" | null>(null);

  function run(action: "resolve" | "ignore") {
    setError(null);
    startTransition(async () => {
      const r = action === "resolve" ? await resolveIssue(issueId) : await ignoreIssue(issueId);
      if (!r.ok) setError(r.error || "Failed");
      else setDone(action === "resolve" ? "resolved" : "ignored");
    });
  }

  if (done) {
    return (
      <span className="font-mono text-[11px]" style={{
        color: "var(--tz-win)",
        letterSpacing: ".08em",
        textTransform: "uppercase",
      }}>
        ✓ {done}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => run("resolve")}
        disabled={pending}
        className="tz-btn"
        style={{ height: 24, padding: "0 8px", fontSize: 11 }}
        title="Mark as resolved"
      >
        Resolve
      </button>
      <button
        type="button"
        onClick={() => run("ignore")}
        disabled={pending}
        className="tz-btn"
        style={{ height: 24, padding: "0 8px", fontSize: 11 }}
        title="Ignore — silence this issue"
      >
        Ignore
      </button>
      {error && (
        <span className="font-mono text-[10px]" style={{ color: "var(--tz-loss)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
