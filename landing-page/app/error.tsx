"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to browser console + any attached logger / Vercel observability.
    // No PII; the digest is the only useful identifier for cross-referencing.
    console.error("[app error]", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <section className="above-bg">
      <div className="container-wide py-24 sm:py-32 text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-40">
          500 · something broke
        </span>
        <h1 className="mt-4 font-display text-[36px] sm:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          Something went wrong.
        </h1>
        <p className="mt-4 max-w-[520px] mx-auto text-[15px] text-ink-60">
          The page hit an unexpected error. You can try again, or head back to the homepage.
          If it keeps happening, open a ticket.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-ink-40">
            Reference · {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
          <Link href="/portal/support" className="btn btn-ghost">
            Report it →
          </Link>
        </div>
      </div>
    </section>
  );
}
