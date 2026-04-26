import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

// Security headers applied to every route. CSP uses 'unsafe-inline' on
// script-src for the FOUC theme-init script. Planned follow-up: extract the
// script to an external file served with nonce, or wire Edge Middleware that
// correctly propagates nonce to Next's hydration bundles.
const securityHeaders = [
  { key: "X-Content-Type-Options",     value: "nosniff" },
  { key: "X-Frame-Options",            value: "DENY" },
  { key: "X-DNS-Prefetch-Control",     value: "on" },
  { key: "Strict-Transport-Security",  value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://api.coingecko.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Image optimization: prefer AVIF (best compression) then WebP, fall back
  // to PNG/JPEG. Cache optimized variants for a year — chart screenshots
  // change rarely, and content-hashed URLs invalidate naturally on new builds.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

// Wrap with Sentry only if a DSN is configured. Without DSN, withSentryConfig
// is a no-op pass-through plus a small instrumentation overhead — keep the
// guard so local dev without Sentry env vars doesn't pull in source-map
// upload attempts.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

export default dsn
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG || "easytradesetup",
      project: process.env.SENTRY_PROJECT || "easytradesetup",
      // Only upload source maps when an auth token is available — otherwise
      // the build fails because Sentry CLI can't authenticate.
      silent: !process.env.CI,
      widenClientFileUpload: true,
      // Hide source maps from public bundle output (still uploaded to Sentry
      // when SENTRY_AUTH_TOKEN is set).
      hideSourceMaps: true,
      disableLogger: true,
      // Tunnel browser-side requests through this app so ad-blockers don't
      // strip them. Path is excluded from middleware auth via passthrough.
      tunnelRoute: "/monitoring",
    })
  : nextConfig;
