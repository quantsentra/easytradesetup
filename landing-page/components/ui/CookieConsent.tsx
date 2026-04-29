"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_COOKIE_MAX_AGE,
  isValidConsent,
  type ConsentState,
} from "@/lib/consent";

// Minimal CMP. Gates non-essential cookies (Clarity) until visitor decides.
// Default = essential only. Banner persists until explicit click; banner
// state survives navigation because it's mounted in the marketing layout.
//
// Server reads the same cookie via lib/consent.ts to decide whether to
// inject Clarity, so the SSR HTML is correct on first paint.

function readCookie(): ConsentState {
  if (typeof document === "undefined") return "unset";
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  const v = m ? decodeURIComponent(m[1]) : null;
  return isValidConsent(v) ? v : "unset";
}

function writeCookie(v: "all" | "essential") {
  if (typeof document === "undefined") return;
  // Domain-scoped so /portal subdomain inherits the same decision.
  const host = window.location.hostname;
  const domainAttr =
    host.endsWith("easytradesetup.com") ? "; domain=.easytradesetup.com" : "";
  document.cookie = `${CONSENT_COOKIE}=${v}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}; samesite=lax${domainAttr}`;
}

export default function CookieConsent() {
  const [state, setState] = useState<ConsentState>("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(readCookie());
  }, []);

  if (!mounted || state !== "unset") return null;

  function decide(v: "all" | "essential") {
    writeCookie(v);
    setState(v);
    // Clarity is server-injected based on the cookie, so reload picks up
    // the new state on the next request without any client-side script
    // bookkeeping. Single source of truth = the cookie.
    if (v === "all") window.location.reload();
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[420px] z-[60]"
    >
      <div
        className="rounded-2xl border border-rule-2 bg-panel p-4 sm:p-5 shadow-2xl backdrop-blur-md"
        style={{
          boxShadow:
            "0 0 0 1px rgba(43,123,255,0.18), 0 18px 48px -16px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="flex-none w-8 h-8 rounded-full grid place-items-center"
            style={{
              background: "rgba(34,211,238,0.14)",
              border: "1px solid rgba(34,211,238,0.40)",
              color: "#22D3EE",
            }}
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="9" cy="9" r="0.8" fill="currentColor" />
              <circle cx="14" cy="14" r="0.8" fill="currentColor" />
              <circle cx="9" cy="14" r="0.8" fill="currentColor" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-[14px] font-semibold text-ink">Cookies</h2>
            <p className="mt-1 text-[12.5px] leading-[1.5] text-ink-60">
              Essential cookies keep the site working (currency, sign-in). With
              your permission we also use Microsoft Clarity for anonymous
              heatmaps to improve the site. We never run advertising pixels.
              See our{" "}
              <Link href="/legal/privacy" className="link-apple">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="rounded-lg border border-rule-2 bg-bg-2 px-3 py-2 text-[13px] font-medium text-ink hover:bg-panel transition-colors"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="rounded-lg bg-blue px-3 py-2 text-[13px] font-semibold text-white hover:brightness-110 transition-all"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
