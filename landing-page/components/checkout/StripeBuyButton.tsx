"use client";

import { useState, useTransition } from "react";

// Single-shot Stripe Checkout button. POSTs to /api/stripe/checkout, then
// redirects the browser to the hosted Stripe payment page. Email is
// optional — Stripe collects it on the hosted page if not provided.

export default function StripeBuyButton({
  className,
  label = "Pay with card →",
}: {
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  function go() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(email ? { email: email.trim().toLowerCase() } : {}),
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
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com (optional)"
          aria-label="Email address (optional, will pre-fill on Stripe)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          className="flex-1 bg-surface border border-rule rounded-lg px-4 py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors disabled:opacity-60"
        />
        <button
          type="button"
          onClick={go}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
        >
          {pending ? "Opening Stripe…" : label}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-caption" style={{ color: "#d93b3b" }}>
          ✗ {error}
        </p>
      )}

      <p className="mt-4 text-caption text-muted leading-relaxed">
        Secure checkout via{" "}
        <span className="font-semibold text-ink">Stripe</span>. Cards from 200+
        countries. PCI-DSS compliant. We never see your card details.
      </p>
    </div>
  );
}
