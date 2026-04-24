"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const STORAGE_KEY = "theme";

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");
  root.dataset.themeMode = mode;
}

function initialMode(): Mode {
  // This only runs client-side; the FOUC script in layout.tsx has already
  // applied a theme before hydration. We just mirror what the DOM says.
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch { /* ignored */ }
  if (typeof document !== "undefined" && document.documentElement.classList.contains("light")) {
    return "light";
  }
  return "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const m = initialMode();
    setMode(m);
    apply(m);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Mode = mode === "light" ? "dark" : "light";
    setMode(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignored */ }
    apply(next);
  }

  const label = mode === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={mode === "light"}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-60 hover:text-ink border border-rule hover:border-rule-2 transition-colors ${className}`}
      style={{ background: "var(--c-fill-soft)" }}
    >
      {mounted ? <Icon mode={mode} /> : <Icon mode="dark" />}
    </button>
  );
}

function Icon({ mode }: { mode: Mode }) {
  // Show the icon of the destination mode (sun when currently dark, moon when light).
  if (mode === "dark") {
    // Currently dark → show sun (clicking goes to light)
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  // Currently light → show moon (clicking goes to dark)
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
