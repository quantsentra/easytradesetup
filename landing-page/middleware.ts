import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const PORTAL_HOST = "portal.easytradesetup.com";
const MARKETING_HOST = "www.easytradesetup.com";

const isProtected = createRouteMatcher([
  "/portal(.*)",
  "/admin(.*)",
  "/api/entitlement(.*)",
]);

// Paths that pass through on the portal subdomain without /portal rewriting.
// Admin routes keep their /admin prefix; auth + API + Next internals are
// never rewritten.
const PORTAL_PASSTHROUGH_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/api",
  "/_next",
  "/favicon",
  "/robots.txt",
  "/sitemap.xml",
];

const hasClerk =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

function isPortalHost(host: string | null): boolean {
  return host === PORTAL_HOST;
}

function isMarketingHost(host: string | null): boolean {
  // Treat apex + www as marketing. Preview / vercel.app URLs use the raw
  // app (no host rewrite) so developers can inspect routes directly.
  return host === "easytradesetup.com" || host === MARKETING_HOST;
}

function hostnameRouting(req: NextRequest): NextResponse | null {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;

  // --- Portal subdomain ---
  if (isPortalHost(host)) {
    // /portal/* requests on the portal host should show clean URLs.
    // Strip the prefix with a 301 so bookmarks / pasted links self-heal.
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      const clean = pathname === "/portal" ? "/" : pathname.slice("/portal".length);
      const dest = new URL(`${clean}${search}`, `https://${PORTAL_HOST}`);
      return NextResponse.redirect(dest, 301);
    }

    // /admin, /sign-in, /sign-up, /api, Next internals pass through.
    if (PORTAL_PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return null;
    }

    // Everything else renders from the /portal/... tree internally.
    const rewritten = new URL(`/portal${pathname}${search}`, req.url);
    return NextResponse.rewrite(rewritten);
  }

  // --- Marketing domain ---
  if (isMarketingHost(host)) {
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      const clean = pathname === "/portal" ? "/" : pathname.slice("/portal".length);
      return NextResponse.redirect(
        new URL(`${clean}${search}`, `https://${PORTAL_HOST}`),
        301,
      );
    }
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return NextResponse.redirect(
        new URL(`${pathname}${search}`, `https://${PORTAL_HOST}`),
        301,
      );
    }
  }

  return null;
}

export default function middleware(req: NextRequest, ev: unknown) {
  // Hostname-based rewrite / redirect happens before Clerk so protected-route
  // detection sees the internal `/portal/...` path after rewriting.
  const routed = hostnameRouting(req);
  if (routed) return routed;

  if (!hasClerk) {
    if (isProtected(req)) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
    return NextResponse.next();
  }
  // @ts-expect-error — Clerk types the event loosely; pass-through is fine.
  return clerkHandler(req, ev);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
