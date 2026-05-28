import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const PORTAL_HOST = "portal.easytradesetup.com";
const MARKETING_HOST = "www.easytradesetup.com";

const PORTAL_PASSTHROUGH_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/auth",
  "/api",
  "/_next",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
  "/monitoring", // Sentry tunnel route — must reach Sentry, not the portal app
];

// Marketing paths that don't exist under app/portal/* — if a portal-host
// request hits one (because a portal page links to /checkout etc with a
// relative href), redirect to the marketing host so the user lands on
// the real page instead of a 404 from the internal /portal/<slug>
// rewrite below.
const PORTAL_TO_MARKETING_PATHS = [
  "/checkout",
  "/pricing",
  "/sample",
  "/product",
  "/compare",
  "/about",
  "/contact",
  "/thank-you",
  "/docs/install",
  "/docs/faq",
  "/legal/disclaimer",
  "/legal/privacy",
  "/legal/terms",
  "/legal/refund",
];

function isPortalHost(host: string | null): boolean {
  return host === PORTAL_HOST;
}

function isMarketingHost(host: string | null): boolean {
  return host === "easytradesetup.com" || host === MARKETING_HOST;
}

function needsAuth(logicalPath: string): boolean {
  return (
    logicalPath === "/portal" ||
    logicalPath.startsWith("/portal/") ||
    logicalPath === "/admin" ||
    logicalPath.startsWith("/admin/")
  );
}

type RoutedPlan =
  | { kind: "redirect"; response: NextResponse }
  | { kind: "rewrite"; to: string; externalPath: string }
  | { kind: "passthrough"; externalPath: string };

/**
 * Figure out what the final response should look like based on the host.
 * Returns a plan so the caller can still layer Supabase auth + session
 * refresh on top without fighting the hostname rewrite.
 */
function planHostnameRouting(req: NextRequest): RoutedPlan {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;

  // --- Portal subdomain ---
  if (isPortalHost(host)) {
    // portal.domain/portal/foo -> 301 to portal.domain/foo
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      const clean = pathname === "/portal" ? "/" : pathname.slice("/portal".length);
      return {
        kind: "redirect",
        response: NextResponse.redirect(
          new URL(`${clean}${search}`, `https://${PORTAL_HOST}`),
          301,
        ),
      };
    }
    // /admin, /sign-in, /api, etc. render at their literal path.
    if (
      PORTAL_PASSTHROUGH_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      )
    ) {
      return { kind: "passthrough", externalPath: pathname };
    }
    // Marketing-only paths on the portal host -> 301 to the www host.
    // Catches the case where a portal page links to /checkout (etc) with
    // a relative href and the browser resolves it to portal.domain/
    // checkout, which has no underlying app/portal/checkout page.
    if (
      PORTAL_TO_MARKETING_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      )
    ) {
      return {
        kind: "redirect",
        response: NextResponse.redirect(
          new URL(`${pathname}${search}`, `https://${MARKETING_HOST}`),
          301,
        ),
      };
    }
    // Everything else maps to /portal/foo internally.
    return {
      kind: "rewrite",
      to: `/portal${pathname}${search}`,
      externalPath: pathname,
    };
  }

  // --- Marketing host ---
  if (isMarketingHost(host)) {
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      const clean = pathname === "/portal" ? "/" : pathname.slice("/portal".length);
      return {
        kind: "redirect",
        response: NextResponse.redirect(
          new URL(`${clean}${search}`, `https://${PORTAL_HOST}`),
          301,
        ),
      };
    }
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return {
        kind: "redirect",
        response: NextResponse.redirect(
          new URL(`${pathname}${search}`, `https://${PORTAL_HOST}`),
          301,
        ),
      };
    }
    // Auth pages live on the portal subdomain so OAuth callbacks land on the
    // same host as the eventual session cookie. Sending /sign-in /sign-up
    // /auth/* on marketing to the portal avoids a double sign-in flow.
    if (
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname === "/auth/callback" ||
      pathname.startsWith("/auth/")
    ) {
      return {
        kind: "redirect",
        response: NextResponse.redirect(
          new URL(`${pathname}${search}`, `https://${PORTAL_HOST}`),
          301,
        ),
      };
    }
  }

  return { kind: "passthrough", externalPath: pathname };
}

// Per-request CSP nonce. Next 14+ auto-applies this to its hydration
// scripts when the request carries an `x-nonce` header — and our custom
// JSON-LD `<Script>` reads the same header server-side, so both code paths
// pass a strict CSP without 'unsafe-inline'.
function buildCsp(nonce: string): string {
  const dev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    // 'strict-dynamic' lets nonced scripts load further scripts (Next's
    // chunk loader, Vercel Analytics, BotID). 'unsafe-eval' kept in dev
    // only — Next dev mode uses eval; the prod bundle does not.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${dev ? "'unsafe-eval'" : ""} https:`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    // Microsoft Clarity collects session-recording payloads via *.clarity.ms.
    // Loader script is `https://www.clarity.ms/tag/<id>` and the SDK posts to
    // `*.clarity.ms` for ingest. script-src already covers the load via
    // 'strict-dynamic'; connect-src needs the explicit allowlist.
    // GA4 (via @next/third-parties) ships hits to www.google-analytics.com
    // and www.google.com (the latter for Google Ads conversion linker).
    // Allowlist both connect targets so CSP doesn't block telemetry.
    // Clerk Frontend API + clerkjs load over *.clerk.accounts.dev (dev) and
    // clerk.* / *.clerk.com (prod). connect-src needs them for token + user
    // calls; frame-src for the hosted components / Turnstile bot challenge.
    "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live https://api.coingecko.com https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com https://*.clarity.ms https://c.bing.com https://www.google-analytics.com https://*.analytics.google.com https://www.google.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.easytradesetup.com",
    "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com https://*.clerk.accounts.dev https://*.clerk.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");
}

export default clerkMiddleware(async (clerkAuth, req) => {
  const plan = planHostnameRouting(req);

  if (plan.kind === "redirect") {
    return plan.response;
  }

  // Determine the logical path the app will render. Rewrites translate
  // portal.domain/foo -> /portal/foo; passthroughs keep the pathname as-is.
  const logicalPath =
    plan.kind === "rewrite" ? new URL(plan.to, req.url).pathname : plan.externalPath;

  // The brand-kit iframe assets (admin-only) need a permissive CSP so
  // the React-on-CDN + Babel-standalone pattern in brand-kit.html runs.
  // Skip strict CSP injection for this path — the route handler sets
  // its own iframe-scoped policy.
  const isBrandKitAsset = logicalPath.startsWith("/api/admin/brand-kit/");

  // Generate per-request nonce. Server components read this from
  // `headers().get("x-nonce")` to apply to inline scripts.
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  // Inject x-nonce into the request headers Next forwards to server
  // components, so they can read it via headers().
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  if (!isBrandKitAsset) {
    requestHeaders.set("Content-Security-Policy", csp);
  }

  // Build the response we'll eventually return (rewrite for portal-host
  // path mapping, otherwise next).
  const res =
    plan.kind === "rewrite"
      ? NextResponse.rewrite(new URL(plan.to, req.url), {
          request: { headers: requestHeaders },
        })
      : NextResponse.next({ request: { headers: requestHeaders } });

  // Echo CSP on the response so the browser actually enforces it.
  // Brand-kit asset path is exempt — its route handler sets a relaxed
  // iframe-scoped CSP and would otherwise be overridden here.
  if (!isBrandKitAsset) {
    res.headers.set("Content-Security-Policy", csp);
  }

  // Auth gate — Clerk owns the session. Protected logical paths (/portal,
  // /admin) require a signed-in user; everything else passes through.
  if (needsAuth(logicalPath)) {
    const { userId } = await clerkAuth();
    if (!userId) {
      const signIn = req.nextUrl.clone();
      signIn.pathname = "/sign-in";
      // Redirect back to the cosmetic URL the user typed, not the internal one.
      signIn.search = `?redirect=${encodeURIComponent(plan.externalPath + (req.nextUrl.search || ""))}`;
      return NextResponse.redirect(signIn);
    }
  }

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
