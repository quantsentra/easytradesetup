import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * OAuth + magic-link callback. Supabase redirects here after the user
 * clicks a sign-in link (email OTP) or completes an OAuth provider flow.
 * We exchange the `code` query param for a session cookie, then bounce
 * to the caller's intended destination.
 *
 * Error paths always land on /sign-in with an `error=` query param so
 * the sign-in page surfaces the failure inline.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirect = url.searchParams.get("redirect") || "/portal";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent("Missing auth code")}`, origin),
    );
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !anon) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent("Auth not configured")}`, origin),
    );
  }

  const cookieStore = await cookies();
  const res = NextResponse.redirect(new URL(redirect, origin));

  const supa = createServerClient(supaUrl, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supa.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, origin),
    );
  }

  return res;
}
