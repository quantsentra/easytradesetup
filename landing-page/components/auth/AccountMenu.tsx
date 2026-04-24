"use client";

import { useEffect, useRef, useState } from "react";

export default function AccountMenu({
  email,
  size = 32,
}: {
  email: string;
  size?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const initial = (email?.[0] || "?").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="rounded-full grid place-items-center font-display text-[13px] font-semibold text-white"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #2B7BFF, #22D3EE)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.12), 0 2px 6px rgba(43,123,255,.25)",
        }}
      >
        {initial}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px] glass-card-soft p-2"
          role="menu"
        >
          <div className="px-3 py-2 text-[12px] text-ink-60 break-all border-b border-rule mb-1">
            {email}
          </div>
          <a
            href="/portal/account"
            role="menuitem"
            className="block px-3 py-2 rounded-lg text-[13px] text-ink hover:text-cyan hover-fill transition-colors"
          >
            Account
          </a>
          <a
            href="/portal/support"
            role="menuitem"
            className="block px-3 py-2 rounded-lg text-[13px] text-ink hover:text-cyan hover-fill transition-colors"
          >
            Support
          </a>
          <form action="/auth/sign-out" method="POST" className="mt-1 border-t border-rule pt-1">
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-rose-500 hover-fill transition-colors"
              role="menuitem"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
