"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "ets_exit_intent_shown_v1";
const DISABLED_ROUTES = ["/checkout", "/thank-you"];
const MIN_DWELL_MS = 20_000;
const SCROLL_TRIGGER_PX = 800;

// Read/write survives private mode by falling through to sessionStorage and
// then an in-memory flag. Prevents repeat-spam when localStorage is blocked.
function readShown(): boolean {
  try { if (localStorage.getItem(STORAGE_KEY) === "1") return true; } catch { /* ignored */ }
  try { if (sessionStorage.getItem(STORAGE_KEY) === "1") return true; } catch { /* ignored */ }
  return false;
}
function writeShown() {
  try { localStorage.setItem(STORAGE_KEY, "1"); return; } catch { /* ignored */ }
  try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignored */ }
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const dismissedRef = useRef(false);
  const armedRef = useRef(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    writeShown();
    dismissedRef.current = true;
  }, []);

  const trigger = useCallback(() => {
    if (dismissedRef.current || !armedRef.current) return;
    setOpen(true);
    writeShown();
    dismissedRef.current = true;
  }, []);

  // Arm after MIN_DWELL_MS and after scroll past SCROLL_TRIGGER_PX.
  useEffect(() => {
    if (DISABLED_ROUTES.includes(pathname)) {
      armedRef.current = false;
      return;
    }
    if (readShown()) {
      dismissedRef.current = true;
      return;
    }

    let dwellPassed = false;
    let scrollPassed = false;

    const maybeArm = () => {
      if (dwellPassed && scrollPassed) armedRef.current = true;
    };

    const dwellTimer = window.setTimeout(() => {
      dwellPassed = true;
      maybeArm();
    }, MIN_DWELL_MS);

    const onScroll = () => {
      if (window.scrollY >= SCROLL_TRIGGER_PX) {
        scrollPassed = true;
        maybeArm();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Desktop — mouseleave towards top
  useEffect(() => {
    if (DISABLED_ROUTES.includes(pathname)) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    window.addEventListener("mouseleave", onMouseLeave);
    return () => window.removeEventListener("mouseleave", onMouseLeave);
  }, [pathname, trigger]);

  // Mobile — when page hides (tab swap, back button)
  useEffect(() => {
    if (DISABLED_ROUTES.includes(pathname)) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pathname, trigger]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const website = String(data.get("website") || "");
    if (website) { setStatus("success"); return; } // honeypot tripped
    setStatus("submitting");
    try {
      const ctrl = new AbortController();
      const timeout = window.setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          source: "exit-intent",
        }),
        signal: ctrl.signal,
      });
      window.clearTimeout(timeout);
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="relative glass-card w-full sm:max-w-lg p-6 sm:p-10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 text-ink-60 hover:text-ink transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="eye">
          <span className="eye-dot" aria-hidden />
          Before you go
        </div>
        <h2 id="exit-intent-title" className="mt-3 h-tile">
          Take a free trade setup with you.
        </h2>
        <p className="mt-3 text-caption text-ink-60 leading-relaxed">
          Drop your email and we&apos;ll send a free trade setup preview — same format as the
          setups inside your portal after purchase. Structure, entry rules, invalidation. No
          spam. No follow-ups until launch.
        </p>

        {status === "success" ? (
          <div className="mt-6 rounded-xl px-4 py-3 text-caption" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86EFAC" }}>
            Thanks — check your inbox. If it doesn&apos;t arrive in 5 minutes, peek in spam.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoFocus
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 bg-white/5 border border-rule-2 rounded-lg px-4 py-3 text-body text-ink placeholder:text-ink-40 focus:outline-none focus:border-blue-soft transition-colors"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn btn-primary btn-lg disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send sample"}
            </button>
          </form>
        )}

        {status === "error" && (
          <div className="mt-3 text-caption text-dn">
            Couldn&apos;t send right now. Please try again or email welcome@easytradesetup.com.
          </div>
        )}

        <p className="mt-5 text-nano text-ink-40 uppercase tracking-widest font-mono">
          Or{" "}
          <Link href="/sample" onClick={dismiss} className="link-apple normal-case tracking-normal">
            view the sample page
          </Link>
          {" "}· unsubscribe any time · we don&apos;t sell emails.
        </p>
      </div>
    </div>
  );
}
