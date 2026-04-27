"use client";

import { useState, useTransition } from "react";

// One-tap Stripe Checkout button. Clicking POSTs to /api/stripe/checkout
// and redirects to Stripe's hosted page where Apple Pay / Google Pay /
// Link / cards are offered. Email is collected by Stripe (no field here)
// so the path is: tap → Stripe → pay → /thank-you. ~2 seconds.

export default function StripeBuyButton({
  className,
  label = "Pay $49 →",
}: {
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function go() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
        const json = await res.json();
        if (!res.ok || !json.ok || !json.url) {
          setError(json.error || `HTTP ${res.status}`);
          return;
        }
        window.location.href = json.url;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
      }
    });
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={go}
        disabled={pending}
        className="w-full inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-4 text-body font-semibold hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
              aria-hidden
            />
            Opening Stripe…
          </span>
        ) : (
          label
        )}
      </button>

      {error && (
        <p className="mt-3 text-caption" style={{ color: "#d93b3b" }}>
          ✗ {error}
        </p>
      )}

      <p className="mt-4 text-caption text-muted leading-relaxed">
        Apple Pay · Google Pay · cards. Stripe-hosted, PCI-DSS compliant.
        We never see your card details.
      </p>
    </div>
  );
}
