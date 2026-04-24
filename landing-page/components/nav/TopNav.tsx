"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Price from "@/components/ui/Price";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/product",  label: "Product" },
  { href: "/pricing",  label: "Pricing" },
  { href: "/compare",  label: "Compare" },
  { href: "/sample",   label: "Sample" },
  { href: "/docs/faq", label: "FAQ" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href.startsWith("/docs")) return pathname.startsWith("/docs");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 above-bg nav-bar">
      <div className="container-wide flex items-center justify-between gap-6 h-16">
        <Link href="/" aria-label="EasyTradeSetup home" className="inline-flex items-center gap-2.5 flex-shrink-0">
          <span
            className="w-7 h-7 rounded-full grid place-items-center text-white"
            style={{
              background: "linear-gradient(135deg, #2B7BFF, #22D3EE)",
              boxShadow: "0 0 0 1px rgba(255,255,255,.12), 0 4px 12px rgba(43,123,255,.35)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 13l4 4 10-11" />
            </svg>
          </span>
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
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`text-[13px] transition-colors px-2 ${pathname === "/contact" ? "text-ink font-medium" : "text-ink-60 hover:text-ink"}`}
          >
            Contact
          </Link>
          {isLoaded && !isSignedIn && (
            <Link
              href="/sign-in"
              className="text-[13px] px-2 text-ink-60 hover:text-ink transition-colors"
            >
              Sign in
            </Link>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link
                href="/portal"
                className="text-[13px] px-2 text-ink hover:text-cyan transition-colors font-medium"
              >
                Portal
              </Link>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
            </>
          )}
          <ThemeToggle />
          <Link href="/checkout" className="btn btn-acid">
            Reserve · <Price variant="amount" />
            <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
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
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={`nav-link-mobile hairline-b ${pathname === "/contact" ? "nav-link-mobile-active" : ""}`}
            >
              Contact
            </Link>
            {isLoaded && !isSignedIn && (
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="nav-link-mobile hairline-b"
              >
                Sign in
              </Link>
            )}
            {isLoaded && isSignedIn && (
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="nav-link-mobile hairline-b"
              >
                Portal
              </Link>
            )}
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn btn-acid btn-lg mt-6 justify-center"
            >
              Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
