import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEntitlement } from "@/lib/entitlements";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "downloads";
const SIGNED_URL_TTL_SECONDS = 600; // 10 minutes

// Only paths matching this prefix + the product we sell can be requested.
// Stops path traversal / cross-bucket leakage via user-supplied input.
const ALLOWED_PATH_PREFIX = "golden-indicator/";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const entitlement = await getEntitlement(userId);
  if (!entitlement?.active) {
    return NextResponse.json({ error: "No active license" }, { status: 403 });
  }

  const form = await req.formData();
  const rawPath = String(form.get("path") || "");
  if (!rawPath.startsWith(ALLOWED_PATH_PREFIX) || rawPath.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const supa = createSupabaseAdmin();
  const { data, error } = await supa.storage
    .from(BUCKET)
    .createSignedUrl(rawPath, SIGNED_URL_TTL_SECONDS, { download: true });

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Download unavailable" }, { status: 500 });
  }

  // Log the download attempt for audit + per-file analytics.
  await supa.from("downloads").insert({
    user_id: userId,
    path: rawPath,
    at: new Date().toISOString(),
  });

  return NextResponse.redirect(data.signedUrl, 303);
}
