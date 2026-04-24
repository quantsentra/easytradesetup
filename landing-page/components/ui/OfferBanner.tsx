"use client";

import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";
import { LAUNCH_END_DATE, LAUNCH_END_DATE_LABEL } from "@/lib/launch";

const STORAGE_KEY = "ets_offer_banner_dismissed_v2";

function computeLeft() {
  const end = new Date(`${LAUNCH_END_DATE}T23:59:59+05:30`).getTime();
  const diff = end - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return { days, hours, mins };
}

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [left, setLeft] = useState<{ days: number; hours: number; mins: number } | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignored */
    }
    setReady(true);
    const tick = () => {
      const l = computeLeft();
      setLeft(l);
      setEnded(l === null);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignored */
    }
  }

  if (!ready || dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Launch offer banner"
      className="relative bg-grad-promo text-white above-bg"
    >
      <div className="container-wide flex items-center justify-center gap-4 sm:gap-6 py-2 text-caption font-medium flex-wrap">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" aria-hidden />
          <span className="uppercase tracking-widest text-nano font-semibold">
            {ended ? "Launch window closed" : OFFER_LABEL}
          </span>
          <span className="hidden sm:inline text-white/70">·</span>
          <span className="hidden sm:inline text-white/90 truncate">
            {ended ? (
              <>Retail price in effect — <Price variant="retail" /></>
            ) : (
              <>
                <Price variant="retail" />
                <span className="mx-1.5 text-white/60">→</span>
                <Price variant="amount" />
              </>
            )}
          </span>
          {!ended && (
            <span className="hidden md:inline text-white/70 ml-1">· {OFFER_TAGLINE}</span>
          )}
        </span>

        {left && !ended && (
          <span className="inline-flex items-baseline gap-2 font-mono text-nano tabular-nums">
            <span className="text-white/70">Ends {LAUNCH_END_DATE_LABEL} —</span>
            <b className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">{left.days}d</b>
            <b className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">{left.hours}h</b>
            <b className="bg-white/15 px-1.5 py-0.5 rounded text-[11px]">{left.mins}m</b>
          </span>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss banner"
          className="ml-1 w-6 h-6 inline-flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
