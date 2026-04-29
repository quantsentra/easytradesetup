"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import AccountMenu from "@/components/auth/AccountMenu";

const navItems = [
  { href: "/product",   label: "Features" },
  { href: "/sample",    label: "Free sample" },
  { href: "/pricing",   label: "Pricing" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href === "/sample") return pathname.startsWith("/sample");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    const supa = supabaseBrowser();
    (async () => {
      const res = await supa.auth.getUser();
      if (!alive) return;
      setEmail(res.data.user?.email ?? null);
      setLoaded(true);
    })();
    const sub = supa.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      alive = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  const isSignedIn = !!email;

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
    <header className="sticky top-0 z-50 above-bg nav-bar">
      <div className="container-wide flex items-center justify-between gap-6 h-16">
        <Link href="/" aria-label="EasyTradeSetup home" className="inline-flex items-center gap-2.5 flex-shrink-0">
          <BrandMark />
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            EasyTradeSetup
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
          {loaded && !isSignedIn && (
            <>
              <a
                href="https://portal.easytradesetup.com/sign-in"
                className="text-[13px] px-2 text-ink-60 hover:text-ink transition-colors"
              >
                Login
              </a>
              <a
                href="https://portal.easytradesetup.com/sign-up"
                className="btn btn-primary"
              >
                Sign up <span className="arrow" aria-hidden>→</span>
              </a>
            </>
          )}
          {loaded && isSignedIn && (
            <>
              <a
                href="https://portal.easytradesetup.com/"
                className="text-[13px] px-2 text-ink hover:text-cyan transition-colors font-medium"
              >
                Portal
              </a>
              <AccountMenu email={email || ""} size={28} />
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-lg hover-fill transition-colors"
          >
            <span className={`block w-[18px] h-px bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block w-[18px] h-px bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-rule nav-mobile">
          <div className="container-x py-4 flex flex-col">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
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
            {loaded && !isSignedIn && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                <a
                  href="https://portal.easytradesetup.com/sign-in"
                  onClick={() => setOpen(false)}
                  className="btn btn-outline btn-lg justify-center"
                >
                  Login
                </a>
                <a
                  href="https://portal.easytradesetup.com/sign-up"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary btn-lg justify-center"
                >
                  Sign up <span className="arrow" aria-hidden>→</span>
                </a>
              </div>
            )}
            {loaded && isSignedIn && (
              <a
                href="https://portal.easytradesetup.com/"
                onClick={() => setOpen(false)}
                className="nav-link-mobile hairline-b"
              >
                Portal
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="rounded-full grid place-items-center text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #2B7BFF, #22D3EE)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.12), 0 4px 12px rgba(43,123,255,.35)",
      }}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4 10-11" />
      </svg>
    </span>
  );
}
