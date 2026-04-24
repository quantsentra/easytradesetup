import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require a signed-in user. Everything else is public (marketing).
const isProtected = createRouteMatcher([
  "/portal(.*)",
  "/admin(.*)",
  "/api/entitlement(.*)",
]);

// Admin-only routes — signed-in is necessary but not sufficient; the route
// handler still has to check the user's role.
const isAdminOnly = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }

  if (isAdminOnly(req)) {
    // Role check happens inside the route handler where we have the full
    // session claims + Supabase access. The middleware just guarantees the
    // request is authenticated.
  }
});

export const config = {
  matcher: [
    // Skip static assets, Next internals, and OG image generation.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
