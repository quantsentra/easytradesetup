"use client";

import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Initial load — read localStorage, apply
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "auto";
    setMode(saved);
    apply(saved);
    setMounted(true);
  }, []);

  // Auto-mode re-evaluation — always attached, checks current mode each tick
  useEffect(() => {
    if (mode !== "auto") return;
    const tick = () => apply("auto");
    tick();
    const interval = window.setInterval(tick, 60_000);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode]);

  // Click-outside + Escape close
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(next: Mode) {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    setOpen(false);
  }

  const current: Mode = mounted ? mode : "auto";
  const label = current === "auto" ? "Auto" : current === "light" ? "Light" : "Dark";

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${label}`}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-60 hover:text-ink border border-rule hover:border-rule-2 transition-colors"
        style={{ background: "var(--c-fill-soft)" }}
      >
        <Icon mode={current} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-[160px] rounded-xl p-1 z-50"
          style={{
            background: "var(--c-panel)",
            border: "1px solid var(--c-rule-2)",
            boxShadow: "var(--c-shadow-term)",
          }}
        >
          <Option mode="auto"  current={current} onPick={pick} label="Auto" hint={hint("auto")} />
          <Option mode="light" current={current} onPick={pick} label="Light" />
          <Option mode="dark"  current={current} onPick={pick} label="Dark" />
        </div>
      )}
    </div>
  );
}

function hint(m: Mode): string | undefined {
  if (m !== "auto") return;
  if (typeof window === "undefined") return;
  return resolveAuto() === "light" ? "day" : "night";
}

function Option({
  mode, current, onPick, label, hint,
}: {
  mode: Mode;
  current: Mode;
  onPick: (m: Mode) => void;
  label: string;
  hint?: string;
}) {
  const active = mode === current;
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={() => onPick(mode)}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-ink text-left transition-colors"
      style={{ background: active ? "var(--c-fill-hover)" : "transparent" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--c-fill-soft)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <span className="w-4 h-4 grid place-items-center text-ink-60">
        <Icon mode={mode} />
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">{hint}</span>}
      {active && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-acid" aria-hidden>
          <path d="M5 13l4 4 10-11" />
        </svg>
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
