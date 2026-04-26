"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const referer = typeof document !== "undefined" ? document.referrer : "";
    fetch("/api/track/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referer }),
      keepalive: true,
    }).catch(() => {
      // Silent — tracking must not break navigation.
    });
  }, [pathname]);

  return null;
}
