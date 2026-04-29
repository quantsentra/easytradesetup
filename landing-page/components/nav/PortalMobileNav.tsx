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
        className="lg:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-lg hover-fill transition-colors"
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
          className="lg:hidden absolute left-0 right-0 top-full nav-mobile"
          style={{ borderTop: "1px solid var(--tz-border)" }}
        >
          <div className="container-wide py-4 flex flex-col">
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
                  <span className="flex items-center gap-3">
                    {active && <span className="nav-dot" aria-hidden />}
                    <span>{item.label}</span>
                  </span>
                  {active && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-acid">
                      current
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="grid grid-cols-2 gap-3 mt-6">
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
      )}
    </>
  );
}
