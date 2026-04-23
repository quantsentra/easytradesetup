"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";

const navItems = [
  { href: "/product",  label: "Product" },
  { href: "/pricing",  label: "Pricing" },
  { href: "/compare",  label: "Compare" },
  { href: "/sample",   label: "Sample" },
  { href: "/docs/faq", label: "FAQ" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 above-bg"
      style={{
        backgroundColor: "rgba(5, 7, 15, 0.55)",
        backdropFilter: "blur(18px) saturate(1.4)",
        WebkitBackdropFilter: "blur(18px) saturate(1.4)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="container-wide flex items-center justify-between gap-6 h-14">
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] text-ink-60 hover:text-ink hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
          <Link
            href="/contact"
            className="text-[13px] text-ink-60 hover:text-ink transition-colors px-2"
          >
            Contact
          </Link>
          <Link href="/checkout" className="btn btn-primary">
            Reserve · <Price variant="amount" />
            <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-10 h-10 inline-flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className={`block w-[18px] h-px bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`block w-[18px] h-px bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-rule"
          style={{
            backgroundColor: "rgba(5, 7, 15, 0.95)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="container-x py-6 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-[18px] font-medium text-ink hairline-b"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-3.5 text-[18px] font-medium text-ink hairline-b"
            >
              Contact
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn btn-primary btn-lg mt-6 justify-center"
            >
              Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
