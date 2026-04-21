"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/strategy", label: "Strategy" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/updates", label: "Updates" },
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
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(245, 245, 247, 0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="container-wide flex items-center justify-between h-12">
        <Link href="/" aria-label="EasyTradeSetup home" className="flex items-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
            <circle cx="14" cy="14" r="13" stroke="#1d1d1f" strokeWidth="1.5" />
            <path d="M8 15l4 3 8-8" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ml-2 font-text text-[15px] font-medium text-ink">EasyTradeSetup</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-micro text-muted hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact" className="text-micro text-muted hover:text-ink transition-colors">
            Contact
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-3.5 py-1.5 text-caption font-normal hover:brightness-110 transition-all"
          >
            Get access — <Price variant="amount" />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-9 h-9 inline-flex flex-col items-center justify-center gap-[5px]"
        >
          <span
            className={`block w-[18px] h-px bg-ink transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-[18px] h-px bg-ink transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-page border-t border-rule">
          <div className="container-x py-8 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-4 text-[24px] font-normal text-ink hairline-b"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-4 text-[24px] font-normal text-ink hairline-b"
            >
              Contact
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue text-white px-5 py-3 font-normal"
            >
              Get access — <Price variant="amount" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
