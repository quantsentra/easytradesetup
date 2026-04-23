"use client";

import { useEffect, useState } from "react";

type Mode = "auto" | "light" | "dark";

const STORAGE_KEY = "theme";

function resolveAuto(): "light" | "dark" {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "light" : "dark";
}

function apply(mode: Mode) {
  const root = document.documentElement;
  const effective = mode === "auto" ? resolveAuto() : mode;
  if (effective === "light") root.classList.add("light");
  else root.classList.remove("light");
  root.dataset.themeMode = mode;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "auto";
    setMode(saved);
    apply(saved);
    setMounted(true);

    if (saved !== "auto") return;
    const tick = () => apply("auto");
    const interval = window.setInterval(tick, 60 * 1000);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function cycle() {
    const next: Mode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  const label = mode === "auto" ? "Auto theme" : mode === "light" ? "Light theme" : "Dark theme";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-60 hover:text-ink border border-rule hover:border-rule-2 transition-colors ${className}`}
      style={{ background: "var(--c-fill-soft)" }}
    >
      {!mounted ? (
        <Icon mode="auto" />
      ) : (
        <Icon mode={mode} />
      )}
    </button>
  );
}

function Icon({ mode }: { mode: Mode }) {
  if (mode === "light") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}
