"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

export default function PortalMobileNav({
  items,
  isAdmin,
}: {
  items: NavItem[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-lg transition-colors"
        style={{ color: "var(--tz-ink)" }}
      >
        <span
          className={`block w-[18px] h-px transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
          style={{ background: "currentColor" }}
        />
        <span
          className={`block w-[18px] h-px transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          style={{ background: "currentColor" }}
        />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          style={{ background: "rgba(15, 18, 22, 0.45)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[86%] max-w-[320px]"
            style={{
              background: "var(--tz-surface)",
              borderLeft: "1px solid var(--tz-border)",
              boxShadow: "var(--tz-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-5 h-14"
              style={{ borderBottom: "1px solid var(--tz-border)" }}
            >
              <span
                className="font-mono text-[10.5px] font-bold uppercase tracking-widest"
                style={{ color: "var(--tz-ink-mute)" }}
              >
                Portal menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md"
                style={{ color: "var(--tz-ink-dim)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="px-3 py-3 flex flex-col gap-1">
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/portal" && pathname?.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="portal-mobile-link"
                    style={{
                      background: active ? "var(--tz-surface-2)" : undefined,
                      color: active ? "var(--tz-ink)" : "var(--tz-ink-dim)",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="font-mono text-[9px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--tz-acid)" }}
                      >
                        current
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div
              className="px-5 py-4 mt-2"
              style={{ borderTop: "1px solid var(--tz-border)" }}
            >
              <div
                className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--tz-ink-mute)" }}
              >
                Shortcuts
              </div>
              <div className="flex flex-col gap-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="portal-mobile-link"
                    style={{ color: "var(--tz-ink-dim)" }}
                  >
                    Admin console →
                  </Link>
                )}
                <a
                  href="https://www.easytradesetup.com"
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="portal-mobile-link"
                  style={{ color: "var(--tz-ink-dim)" }}
                >
                  ↗ Marketing site
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
