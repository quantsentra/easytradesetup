"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Price from "@/components/ui/Price";

const HIDDEN_ROUTES = ["/checkout", "/thank-you"];

export default function StickyBuyBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`md:hidden fixed left-0 right-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="mx-3 mb-3 rounded-2xl shadow-card bg-ink text-white px-4 py-3 flex items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="text-nano uppercase tracking-widest text-white/60 font-semibold">
            Inaugural · Launch price
          </div>
          <div className="text-caption font-semibold tabular-nums truncate">
            <Price variant="strike-offer" />
          </div>
        </div>
        <Link
          href="/checkout"
          className="flex-none inline-flex items-center justify-center rounded-full bg-blue text-white px-5 py-2.5 text-caption font-semibold hover:brightness-110 transition-all"
        >
          Reserve
        </Link>
      </div>
    </div>
  );
}
