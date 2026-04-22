"use client";

import { useEffect, useState } from "react";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
  RESERVATION_CAP,
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
    return (
      <div aria-hidden className="opacity-0 h-[1px]" />
    );
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
      <div className="text-nano font-semibold uppercase tracking-widest text-muted-faint">
        Inaugural pricing ends
      </div>
      {delta.ended ? (
        <div className="mt-2 text-body text-ink font-semibold">Launch window closed</div>
      ) : (
        <div className="mt-2 flex items-baseline gap-3 tabular-nums">
          <TimeCell n={delta.days} label="days" />
          <span className="text-muted-faint" aria-hidden>:</span>
          <TimeCell n={delta.hours} label="hours" />
          <span className="text-muted-faint" aria-hidden>:</span>
          <TimeCell n={delta.minutes} label="min" />
        </div>
      )}
      <div className="mt-3 text-caption text-muted">
        {LAUNCH_END_DATE_LABEL} · or first {RESERVATION_CAP} reservations — whichever comes first
      </div>
    </div>
  );
}

function TimeCell({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[34px] sm:text-[42px] leading-none font-display font-semibold text-ink tabular-nums">
        {String(n).padStart(2, "0")}
      </div>
      <div className="mt-1 text-nano font-semibold uppercase tracking-widest text-muted-faint">
        {label}
      </div>
    </div>
  );
}
