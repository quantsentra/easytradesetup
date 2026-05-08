import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { uploadShort } from "@/lib/youtube";
import { imageToVideoMp4 } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Daily YouTube publishing cron. Mirror of publish-instagram but for YT
// Shorts. Picks next pending row by yt_status, renders vertical 9:16 image
// via /api/og/post/[day]/yt, ships it through Cloudinary to get an MP4,
// uploads to YouTube Data API as a Short.
//
// Schedule: vercel.json fires this at 04:30 UTC daily = 10:00 IST. Offset
// from IG cron (09:00 IST) so we don't double-spike Vercel + Cloudinary
// at the same minute.
//
// One post per run. YT free quota = 6 uploads/day, plenty for 1/day.
//
// Idempotency: optimistic claim by setting yt_status='publishing' before
// any network work.

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.easytradesetup.com";

type ContentPost = {
  id:             string;
  day:            number;
  hook:           string;
  caption:        string;
  keyword_target: string | null;
  yt_status:      string;
  yt_attempts:    number;
};

// Strip hashtag-only lines + the trailing "Educational. Not advice." we
// use on IG. YT description gets the cleaner copy.
function ytDescriptionFromCaption(caption: string, day: number): string {
  const lines = caption.split("\n").map((l) => l.trim());
  const body = lines.filter((l) => l && !l.startsWith("#") && !l.startsWith("—")).join("\n");
  const tags = lines.filter((l) => l.startsWith("#")).join(" ");
  return [
    body,
    "",
    "▼ Free chart sample + risk calculator: https://www.easytradesetup.com",
    "",
    "Educational content. Not investment advice.",
    "",
    `#Shorts ${tags}`,
    "",
    `(post-${day})`,
  ].join("\n").slice(0, 4900);
}

// YT title is capped at 100 chars. Hook is usually fine, but defensively
// truncate + ensure #Shorts hashtag.
function ytTitleFromHook(hook: string): string {
  const base = hook.length > 80 ? `${hook.slice(0, 79)}…` : hook;
  return `${base} #Shorts`.slice(0, 100);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sb = createSupabaseAdmin();

  const { data: candidate, error: pickErr } = await sb
    .from("content_posts")
    .select("id, day, hook, caption, keyword_target, yt_status, yt_attempts")
    .eq("yt_status", "pending")
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
    return NextResponse.json({ ok: true, message: "no pending YT posts" });
  }

  const post = candidate as ContentPost;

  const { data: claimed, error: claimErr } = await sb
    .from("content_posts")
    .update({ yt_status: "publishing", yt_attempts: post.yt_attempts + 1 })
    .eq("id", post.id)
    .eq("yt_status", "pending")
    .select("id")
    .maybeSingle();

  if (claimErr || !claimed) {
    return NextResponse.json({
      ok: false,
      message: "race condition — another runner claimed the row",
      post_id: post.id,
    });
  }

  try {
    // Build vertical image URL → push through Cloudinary → fetch MP4.
    const imageUrl = `${PUBLIC_BASE}/api/og/post/${post.day}/yt`;
    const videoBytes = await imageToVideoMp4(imageUrl);

    // Upload to YT.
    const result = await uploadShort({
      title:       ytTitleFromHook(post.hook),
      description: ytDescriptionFromCaption(post.caption, post.day),
      tags:        post.keyword_target ? [post.keyword_target, "trading", "easytradesetup", "shorts"] : ["trading", "easytradesetup"],
      videoBytes,
    });

    if (!result.ok) {
      await sb
        .from("content_posts")
        .update({
          yt_status:        "failed",
          yt_error_message: result.error.slice(0, 500),
        })
        .eq("id", post.id);
      return NextResponse.json(
        { ok: false, day: post.day, error: result.error },
        { status: 502 },
      );
    }

    await sb
      .from("content_posts")
      .update({
        yt_status:        "published",
        yt_video_id:      result.videoId,
        yt_url:           result.url,
        yt_published_at:  new Date().toISOString(),
        yt_error_message: null,
      })
      .eq("id", post.id);

    return NextResponse.json({
      ok: true,
      day: post.day,
      video_id: result.videoId,
      url: result.url,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await sb
      .from("content_posts")
      .update({
        yt_status:        "failed",
        yt_error_message: msg.slice(0, 500),
      })
      .eq("id", post.id);
    return NextResponse.json(
      { ok: false, day: post.day, error: msg },
      { status: 502 },
    );
  }
}
