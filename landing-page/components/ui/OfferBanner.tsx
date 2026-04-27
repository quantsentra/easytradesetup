"use client";

import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

const STORAGE_KEY = "ets_offer_banner_dismissed_v3";

// Always-on price banner. No countdown, no expiry — single permanent
// launch price framed as a flat retail discount. Dismiss-state persists
// per browser via localStorage.

export default function OfferBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignored */
    }
    setReady(true);
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
      aria-label="Launch price banner"
      className="relative bg-grad-promo text-white above-bg"
    >
      <div className="container-wide flex items-center justify-center gap-4 sm:gap-6 py-2 text-caption font-medium flex-wrap">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" aria-hidden />
          <span className="uppercase tracking-widest text-nano font-semibold">
            {OFFER_LABEL}
          </span>
          <span className="hidden sm:inline text-white/70">·</span>
          <span className="hidden sm:inline text-white/90 truncate">
            <Price variant="retail" />
            <span className="mx-1.5 text-white/60">→</span>
            <Price variant="amount" />
          </span>
          <span className="hidden md:inline text-white/70 ml-1">· {OFFER_TAGLINE}</span>
        </span>

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
