// Sentry SDK configuration for browser/client runtime.
// Auto-loaded by @sentry/nextjs on every client page render.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",

    // Session-replay-style tracing kept off by default — pure error capture
    // for now. Bump tracesSampleRate to 0.1+ once we want performance data.
    tracesSampleRate: 0,

    // Replay disabled — heavy bundle, big privacy surface area. Revisit
    // post-launch if user-funnel debugging needs it.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Strip noise from common browser-extension and ad-blocker errors that
    // Sentry can't act on.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
      // Network failures from user-side (ad-blockers, offline)
      "Failed to fetch",
      "NetworkError when attempting to fetch resource",
      "Load failed",
    ],
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });
}
