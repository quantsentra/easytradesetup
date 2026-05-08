import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { publishSingleImage, publishCarousel } from "@/lib/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily Instagram publishing cron. Picks the next pending content_posts row
// (lowest day number, status='pending'), generates image URLs that point
// back to /api/og/post/[day] (for static) or /api/og/post/[day]?slide=N (for
// carousel slides), POSTs them to the Instagram Graph API, and marks the
// row published.
//
// Schedule: vercel.json fires this at 03:30 UTC daily = 09:00 IST.
// Auth: same Bearer CRON_SECRET pattern as the uptime cron.
//
// Idempotency: optimistic claim by setting status='publishing' before doing
// any network work. A retry that catches a row mid-publish skips it.
//
// One post per run. No batching — Meta rate-limits at 50 posts/24h per IG
// account, plenty of headroom for one daily, and serialising means a single
// failure is one row not seven.

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.easytradesetup.com";

type ContentPost = {
  id:             string;
  day:            number;
  format:         "static" | "carousel" | "reel";
  hook:           string;
  caption:        string;
  slide_outline:  string[] | null;
  status:         string;
  attempts:       number;
};

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sb = createSupabaseAdmin();

  // Pick next pending post — lowest day, oldest scheduled_at as tiebreak.
  // Reels excluded at sync time so we don't need to filter here.
  const { data: candidate, error: pickErr } = await sb
    .from("content_posts")
    .select("id, day, format, hook, caption, slide_outline, status, attempts")
    .eq("status", "pending")
    .order("day", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (pickErr) {
    return NextResponse.json(
      { ok: false, error: `pick query failed: ${pickErr.message}` },
      { status: 500 },
    );
  }

  if (!candidate) {
    return NextResponse.json({ ok: true, message: "no pending posts" });
  }

  const post = candidate as ContentPost;

  // Optimistic claim — if another process beat us to it, the update returns
  // 0 rows and we bail.
  const { data: claimed, error: claimErr } = await sb
    .from("content_posts")
    .update({ status: "publishing", attempts: post.attempts + 1 })
    .eq("id", post.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (claimErr || !claimed) {
    return NextResponse.json({
      ok: false,
      message: "race condition — another runner claimed the row",
      post_id: post.id,
    });
  }

  // Build image URL(s) and call IG.
  let result: Awaited<ReturnType<typeof publishSingleImage>>;

  try {
    if (post.format === "static") {
      const imageUrl = `${PUBLIC_BASE}/api/og/post/${post.day}`;
      result = await publishSingleImage({
        imageUrl,
        caption: post.caption,
      });
    } else if (post.format === "carousel") {
      const slides = post.slide_outline ?? [];
      if (slides.length < 2) {
        result = { ok: false, error: `carousel needs >=2 slides, got ${slides.length}` };
      } else {
        const imageUrls = slides.slice(0, 10).map((_, i) =>
          `${PUBLIC_BASE}/api/og/post/${post.day}?slide=${i}`,
        );
        result = await publishCarousel({
          imageUrls,
          caption: post.caption,
        });
      }
    } else {
      result = { ok: false, error: `format ${post.format} not handled by this cron` };
    }
  } catch (e) {
    result = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  // Persist outcome.
  if (result.ok) {
    await sb
      .from("content_posts")
      .update({
        status:        "published",
        ig_media_id:   result.mediaId,
        ig_permalink:  result.permalink ?? null,
        published_at:  new Date().toISOString(),
        error_message: null,
      })
      .eq("id", post.id);

    return NextResponse.json({
      ok: true,
      day: post.day,
      format: post.format,
      media_id: result.mediaId,
      permalink: result.permalink,
    });
  }

  await sb
    .from("content_posts")
    .update({
      status:        "failed",
      error_message: result.error.slice(0, 500),
    })
    .eq("id", post.id);

  return NextResponse.json(
    {
      ok: false,
      day: post.day,
      format: post.format,
      error: result.error,
    },
    { status: 502 },
  );
}
