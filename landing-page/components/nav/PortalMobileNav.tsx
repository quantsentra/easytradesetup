"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

// Mobile nav drawer for portal + admin. Uses position: fixed so the
// drawer always anchors below the header at top: 64px regardless of
// surrounding flex/relative layout — fixes the dropdown-clipping bug
// the admin sidebar was showing on mobile (long list got cut off
// because the parent had overflow restrictions and the dropdown was
// position: absolute).
//
// Long admin lists (5 sections, ~18 items) now scroll inside the drawer
// rather than escaping the viewport.

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

  // Close on Esc — accessibility + matches user expectation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-lg hover-fill transition-colors relative z-[60]"
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
        <>
          {/* Backdrop — clicking it closes the drawer */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 z-40"
            style={{
              top: 64,
              background: "rgba(5, 7, 15, 0.55)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer panel — fixed positioned, scrolls internally */}
          <div
            className="lg:hidden fixed left-0 right-0 nav-mobile z-50"
            style={{
              top: 64,
              maxHeight: "calc(100dvh - 64px)",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              borderTop: "1px solid var(--tz-border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div className="px-5 sm:px-6 py-3 flex flex-col">
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/portal" && item.href !== "/admin" && pathname?.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link-mobile hairline-b ${active ? "nav-link-mobile-active" : ""}`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      {active && <span className="nav-dot" aria-hidden />}
                      <span className="truncate">{item.label}</span>
                    </span>
                    {active && (
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-acid flex-shrink-0">
                        current
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="grid grid-cols-2 gap-3 mt-5 mb-3">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="btn btn-outline btn-lg justify-center"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/portal"
                    onClick={() => setOpen(false)}
                    className="btn btn-outline btn-lg justify-center"
                  >
                    Portal
                  </Link>
                )}
                <a
                  href="https://www.easytradesetup.com"
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary btn-lg justify-center"
                >
                  Site <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
