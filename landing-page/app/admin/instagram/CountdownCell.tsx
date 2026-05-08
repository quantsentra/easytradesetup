"use client";

import { useEffect, useState } from "react";

// Lightweight live countdown to a target timestamp. Updates every second
// while above 1 hour, every second below 1 hour. Once the target passes,
// renders "publishing soon" — the cron may still be a few minutes from
// firing on its next tick after the scheduled time.
//
// Used in the publisher admin to show, per pending row, how long until
// the daily cron is expected to pick it up.
export default function CountdownCell({ target }: { target: string | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Initialise on client only — avoids SSR hydration mismatch where
    // server-rendered "in 14h 23m" disagrees with the first client tick.
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  if (!target) {
    return <span style={{ color: "var(--tz-ink-mute)" }}>—</span>;
  }
  if (now === null) {
    // First server-rendered paint — render placeholder; client effect will
    // swap in the real countdown ~16ms later.
    return (
      <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
        loading…
      </span>
    );
  }

  const targetMs = new Date(target).getTime();
  const remaining = targetMs - now;

  if (remaining <= 0) {
    return (
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          padding: "2px 6px",
          background: "rgba(255,179,65,0.15)",
          color: "var(--tz-amber, #FFB341)",
          borderRadius: 4,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        publishing soon
      </span>
    );
  }

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const mins = Math.floor((remaining % 3_600_000) / 60_000);
  const secs = Math.floor((remaining % 60_000) / 1_000);

  let label: string;
  if (days > 0) {
    label = `in ${days}d ${hours}h`;
  } else if (hours > 0) {
    label = `in ${hours}h ${mins}m`;
  } else if (mins > 0) {
    label = `in ${mins}m ${secs}s`;
  } else {
    label = `in ${secs}s`;
  }

  // Dim the colour as it gets closer to firing — visual heat on the row
  // that's about to go.
  const isImminent = remaining < 3_600_000; // < 1 hour
  const isToday = remaining < 86_400_000; // < 24 hours

  return (
    <span
      className="font-mono"
      style={{
        fontSize: 11,
        color: isImminent
          ? "var(--tz-amber, #FFB341)"
          : isToday
          ? "var(--tz-cyan, #22D3EE)"
          : "var(--tz-ink-mute)",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}
