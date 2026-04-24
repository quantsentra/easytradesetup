import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

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
];

function isPortalHost(host: string | null): boolean {
  return host === PORTAL_HOST;
}

function isMarketingHost(host: string | null): boolean {
  return host === "easytradesetup.com" || host === MARKETING_HOST;
}

function needsAuth(pathname: string): boolean {
  return (
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

function hostnameRouting(req: NextRequest): NextResponse | null {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;

  // --- Portal subdomain — rewrite root-level paths into /portal/... ---
  if (isPortalHost(host)) {
    if (pathname === "/portal" || pathname.startsWith("/portal/")) {
      const clean = pathname === "/portal" ? "/" : pathname.slice("/portal".length);
      return NextResponse.redirect(
        new URL(`${clean}${search}`, `https://${PORTAL_HOST}`),
        301,
      );
    }
    if (
      PORTAL_PASSTHROUGH_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      )
    ) {
      return null;
    }
    const rewritten = new URL(`/portal${pathname}${search}`, req.url);
    return NextResponse.rewrite(rewritten);
  }

  // --- Marketing host — migrate portal/admin URLs to subdomain ---
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

/**
 * Refresh the Supabase auth session cookie and gate protected routes.
 * Keep middleware responses as slim as possible — we only need to touch
 * cookies and redirect when unauthenticated users hit /portal or /admin.
 */
export async function middleware(req: NextRequest) {
  const routed = hostnameRouting(req);
  if (routed) return routed;

  const res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase env, don't crash public pages; just 404 protected
  // routes so operators notice the missing config.
  if (!url || !anon) {
    if (needsAuth(req.nextUrl.pathname)) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
    return res;
  }

  const supa = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session if expired. Side effect: renewed auth cookie is set
  // on the response we return.
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user && needsAuth(req.nextUrl.pathname)) {
    const signIn = req.nextUrl.clone();
    signIn.pathname = "/sign-in";
    signIn.search = `?redirect=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(signIn);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
