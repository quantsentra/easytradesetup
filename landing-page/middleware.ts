import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require a signed-in user. Everything else is public (marketing).
const isProtected = createRouteMatcher([
  "/portal(.*)",
  "/admin(.*)",
  "/api/entitlement(.*)",
]);

// If Clerk env vars are missing (e.g. preview envs not set yet) we must not
// crash the whole site — marketing pages need to stay up. Protected routes
// 404 in that case, which is the correct signal to operators.
const hasClerk =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, ev: unknown) {
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
    // Skip static assets, Next internals, and OG image generation.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
