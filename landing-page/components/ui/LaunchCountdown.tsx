"use client";

import { useEffect, useState } from "react";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
} from "@/lib/launch";

function computeDelta(nowMs: number): {
  days: number;
  hours: number;
  minutes: number;
  ended: boolean;
} {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`).getTime();
  const diff = end - nowMs;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, ended: true };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return { days, hours, minutes, ended: false };
}

export default function LaunchCountdown({
  variant = "card",
}: {
  variant?: "card" | "inline";
}) {
  const [delta, setDelta] = useState<ReturnType<typeof computeDelta> | null>(null);

  useEffect(() => {
    const tick = () => setDelta(computeDelta(Date.now()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!delta) {
    return <div aria-hidden className="opacity-0 h-[1px]" />;
  }

  if (variant === "inline") {
    return (
      <span className="text-nano font-semibold uppercase tracking-widest text-ink">
        {delta.ended
          ? "Launch window closed"
          : `Ends ${LAUNCH_END_DATE_LABEL} · ${delta.days}d ${delta.hours}h left`}
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-center">
      <div className="text-nano font-semibold uppercase tracking-widest text-ink-40">
        Inaugural pricing ends
      </div>
      {delta.ended ? (
        <div className="mt-3 text-body text-ink font-semibold">Launch window closed</div>
      ) : (
        <div className="mt-3 flex items-baseline gap-2 sm:gap-3 font-mono tabular-nums">
          <TimeCell n={delta.days} label="Days" />
          <span className="text-ink-40 text-xl" aria-hidden>:</span>
          <TimeCell n={delta.hours} label="Hrs" />
          <span className="text-ink-40 text-xl" aria-hidden>:</span>
          <TimeCell n={delta.minutes} label="Min" />
        </div>
      )}
      <div className="mt-4 text-caption text-ink-60">
        Inaugural offer ends {LAUNCH_END_DATE_LABEL}
      </div>
    </div>
  );
}

function TimeCell({ n, label }: { n: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center px-2.5 py-2.5 rounded-lg border border-rule-2 min-w-[62px]"
      style={{ background: "var(--c-fill-soft)" }}
    >
      <div className="font-display text-[26px] sm:text-[30px] leading-none font-semibold text-ink tabular-nums">
        {String(n).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-widest text-ink-40">
        {label}
      </div>
    </div>
  );
}
