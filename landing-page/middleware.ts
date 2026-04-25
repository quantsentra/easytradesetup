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

export async function middleware(req: NextRequest) {
  const plan = planHostnameRouting(req);

  if (plan.kind === "redirect") {
    return plan.response;
  }

  // Determine the logical path the app will render. Rewrites translate
  // portal.domain/foo -> /portal/foo; passthroughs keep the pathname as-is.
  const logicalPath =
    plan.kind === "rewrite" ? new URL(plan.to, req.url).pathname : plan.externalPath;

  // Build the response we'll eventually return. Cookie mutations from
  // Supabase auth attach here regardless of rewrite vs next.
  const res =
    plan.kind === "rewrite"
      ? NextResponse.rewrite(new URL(plan.to, req.url), { request: req })
      : NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase env vars, don't crash public pages; just 404 protected
  // routes so operators notice the missing config.
  if (!url || !anon) {
    if (needsAuth(logicalPath)) {
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

  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user && needsAuth(logicalPath)) {
    const signIn = req.nextUrl.clone();
    signIn.pathname = "/sign-in";
    // Redirect back to the cosmetic URL the user typed, not the internal one.
    signIn.search = `?redirect=${encodeURIComponent(plan.externalPath + (req.nextUrl.search || ""))}`;
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
