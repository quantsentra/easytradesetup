"use client";

import { useEffect, useState } from "react";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
  RESERVATION_CAP,
  estimatedClaimed,
} from "@/lib/launch";

function daysLeft(nowMs: number): number {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`).getTime();
  const diff = end - nowMs;
  if (diff <= 0) return 0;
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export default function ReservationNotice({
  tone = "solid",
}: {
  tone?: "solid" | "soft";
}) {
  const [days, setDays] = useState<number | null>(null);
  const [claimed, setClaimed] = useState<number>(0);

  useEffect(() => {
    const tick = () => {
      setDays(daysLeft(Date.now()));
      setClaimed(estimatedClaimed());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (days === null) {
    return <div aria-hidden className="h-[34px]" />;
  }

  const remaining = Math.max(0, RESERVATION_CAP - claimed);
  const pct = Math.min(100, Math.round((claimed / RESERVATION_CAP) * 100));

  return (
    <div
      className={`inline-flex items-center flex-wrap justify-center gap-x-3 gap-y-1.5 rounded-full border border-rule-3 px-3.5 py-1.5`}
      style={{
        background: tone === "soft" ? "var(--c-fill-soft)" : "var(--c-fill-hover)",
      }}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-cyan motion-safe:animate-pulse"
          style={{ boxShadow: "0 0 6px #22D3EE" }}
          aria-hidden
        />
        <span className="text-nano font-bold text-cyan uppercase tracking-widest tabular-nums">
          {claimed} / {RESERVATION_CAP} claimed · {remaining} left
        </span>
      </span>
      <span className="text-nano font-mono text-ink-40 uppercase tracking-widest">
        {days > 0
          ? `${days}d left · ends ${LAUNCH_END_DATE_LABEL}`
          : "Launch closed"}
      </span>

      {/* Thin progress bar */}
      <span
        className="basis-full h-[2px] rounded-full overflow-hidden"
        style={{ background: "var(--c-rule)" }}
        aria-hidden
      >
        <span
          className="block h-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #22D3EE, #2B7BFF)",
          }}
        />
      </span>
    </div>
  );
}
