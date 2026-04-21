"use client";

import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

const STORAGE_KEY = "ets_offer_banner_dismissed_v1";

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
      aria-label="Inaugural launch offer"
      className="relative bg-ink text-white"
    >
      <div className="container-wide flex items-center justify-center gap-3 sm:gap-4 py-2 sm:py-2.5 text-caption">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-pulse flex-shrink-0"
          aria-hidden
        />
        <span className="text-white/85 font-medium truncate">
          <span className="font-bold uppercase tracking-widest text-nano mr-2 sm:mr-3 text-white">
            {OFFER_LABEL}
          </span>
          <span className="hidden sm:inline opacity-75">
            <Price variant="retail" />
          </span>
          <span className="hidden sm:inline mx-1.5 opacity-60">→</span>
          <span className="font-semibold">
            <Price variant="amount" />
          </span>
          <span className="hidden sm:inline ml-2 opacity-75">· {OFFER_TAGLINE}</span>
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss offer banner"
          className="flex-shrink-0 ml-1 sm:ml-2 w-6 h-6 inline-flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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
