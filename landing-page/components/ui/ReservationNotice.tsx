"use client";

import { useEffect, useState } from "react";
import {
  LAUNCH_END_DATE,
  LAUNCH_END_DATE_LABEL,
  RESERVATION_CAP,
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

  useEffect(() => {
    setDays(daysLeft(Date.now()));
    const id = setInterval(() => setDays(daysLeft(Date.now())), 60_000);
    return () => clearInterval(id);
  }, []);

  if (days === null) {
    return <div aria-hidden className="h-[34px]" />;
  }

  const base =
    tone === "soft"
      ? "bg-white/[0.03] border-rule-2"
      : "bg-white/[0.06] border-rule-3";

  return (
    <div
      className={`inline-flex items-center flex-wrap justify-center gap-x-3 gap-y-1.5 rounded-full border ${base} px-3.5 py-1.5`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-cyan motion-safe:animate-pulse"
          style={{ boxShadow: "0 0 6px #22D3EE" }}
          aria-hidden
        />
        <span className="text-nano font-bold text-cyan uppercase tracking-widest">
          {RESERVATION_CAP} spots · launch price
        </span>
      </span>
      <span className="text-nano font-mono text-ink-40 uppercase tracking-widest">
        {days > 0
          ? `${days}d left · ends ${LAUNCH_END_DATE_LABEL}`
          : "Launch closed"}
      </span>
    </div>
  );
}
