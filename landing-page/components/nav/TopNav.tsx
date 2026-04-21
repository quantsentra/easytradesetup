"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/strategy", label: "Strategy" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/updates", label: "Updates" },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-ink/70 border-b border-ink-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold-gradient">
            <span className="absolute inset-0.5 rounded-full bg-ink" />
            <span className="relative font-display text-gold text-base leading-none">E</span>
          </span>
          <span className="font-display text-lg tracking-tight">
            Easy<span className="italic text-gold">Trade</span>Setup
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-cream-muted hover:text-cream transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm text-cream-muted hover:text-cream transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-1.5 rounded-full bg-cream text-ink px-4 py-2 text-sm font-medium hover:bg-gold transition-colors"
          >
            Get it — ₹2,499
            <span aria-hidden>→</span>
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-9 h-9 inline-flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block w-5 h-px bg-cream transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`block w-5 h-px bg-cream transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-border bg-ink/95 backdrop-blur-xl">
          <div className="container-x py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-display"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-lg font-display"
            >
              Contact
            </Link>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-cream text-ink px-5 py-3 font-medium"
            >
              Get it — ₹2,499 →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
