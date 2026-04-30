import { withSentryConfig } from "@sentry/nextjs";
import { withBotId } from "botid/next/config";

/** @type {import('next').NextConfig} */

// Security headers applied to every route. CSP is set per-request by
// middleware.ts (so it can attach a nonce that Next's hydration scripts
// + our JSON-LD inline script pass cleanly). Everything else is static
// and shared across all routes.
const securityHeaders = [
  { key: "X-Content-Type-Options",       value: "nosniff" },
  { key: "X-Frame-Options",              value: "DENY" },
  { key: "X-DNS-Prefetch-Control",       value: "on" },
  { key: "Strict-Transport-Security",    value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",           value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  // Cross-origin isolation. COOP locks the browsing context group so a
  // popup from another origin can't reach back into our window. CORP
  // tells the browser only same-origin pages may embed our resources.
  // COEP intentionally omitted — would block third-party assets (Stripe
  // js, Vercel scripts, fonts) without sitewide subresource changes.
  { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Vercel function bundles must include the gated Pine source so the
  // /api/portal/pine/[version] route can read it at runtime. Files in
  // /private are deliberately not in /public (so they aren't auto-served)
  // — outputFileTracingIncludes pulls them into the deployed bundle.
  outputFileTracingIncludes: {
    "/api/portal/pine/[version]": ["./private/pine/**/*"],
  },
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
  // /resources was a sales-page-disguised-as-docs hub. Customer-only items
  // already live in /portal; public canonicals live at /sample, /docs/install,
  // /legal/disclaimer. Killed the route, 301 to /product so any inbound links
  // (search, share, old TopNav cache) land on the bundle page instead of 404.
  async redirects() {
    return [
      { source: "/resources", destination: "/product", permanent: true },
    ];
  },
};

// Wrap with Sentry only if a DSN is configured. Without DSN, withSentryConfig
// is a no-op pass-through plus a small instrumentation overhead — keep the
// guard so local dev without Sentry env vars doesn't pull in source-map
// upload attempts.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

// Wrap with Vercel BotID — adds bot-detection to protected routes.
// Routes listed here get an automatic challenge layer; checkBotId()
// in the route handler reads the verdict.
const wrappedConfig = withBotId(nextConfig);

export default dsn
  ? // @ts-ignore — Sentry's wrapper expects NextConfig but BotID's wrapper
    // returns a compatible shape; type narrowing through the chain is noisy.
    withSentryConfig(wrappedConfig, {
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
  : wrappedConfig;
