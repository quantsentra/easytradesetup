/** @type {import('next').NextConfig} */

// Security headers applied to every route. CSP tuned for:
//   - self + Vercel Analytics (script)
//   - inline styles (Tailwind + dynamic style props)
//   - Google Fonts (font + style)
//   - self images + data: + https: (TradingView screenshots, OG images)
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
      // 'unsafe-inline' on scripts required for the FOUC theme-init script
      // in app/layout.tsx. Replace with nonce-based CSP once an Edge
      // Middleware generates per-request nonces.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live",
      "frame-src 'self'",
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
