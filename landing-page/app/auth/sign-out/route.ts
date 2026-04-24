import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !anon) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const cookieStore = await cookies();
  const res = NextResponse.redirect(new URL("/", origin));

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

  await supa.auth.signOut();
  return res;
}

// Also expose GET so a plain <a href="/auth/sign-out"> works.
export const GET = POST;
