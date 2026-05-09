import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { uploadShort, makePublic } from "@/lib/youtube";
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

// SEO + algo-friendly hashtag pool. Mixes:
//   - core brand discovery (#easytradesetup)
//   - sub-niche (#tradingview, #pinescript, #priceaction)
//   - high-volume India/global trading tags
//   - Shorts-specific (#Shorts is required for Shorts shelf, #YouTubeShorts boosts)
// Pick 8-10 per video; YT caps tag total length at ~500 chars.
const SEO_HASHTAG_POOL = [
  "#Shorts",
  "#YouTubeShorts",
  "#trading",
  "#daytrading",
  "#intradaytrading",
  "#stockmarket",
  "#stockmarketindia",
  "#nifty",
  "#niftytrading",
  "#banknifty",
  "#options",
  "#optionstrading",
  "#tradingview",
  "#pinescript",
  "#priceaction",
  "#supplyanddemand",
  "#technicalanalysis",
  "#riskmanagement",
  "#tradingstrategy",
  "#tradingsignals",
  "#easytradesetup",
  "#goldenindicator",
];

// Strip hashtag-only lines + the trailing "Educational. Not advice." we
// use on IG. YT description gets the cleaner copy + a fresh hashtag block
// drawn from the SEO pool above (avoids duplicating IG's tag list).
function ytDescriptionFromCaption(caption: string, day: number, keywordTarget: string | null): string {
  const lines = caption.split("\n").map((l) => l.trim());
  const body = lines.filter((l) => l && !l.startsWith("#") && !l.startsWith("—")).join("\n");

  const seoTags = pickSeoHashtags(keywordTarget);

  return [
    body,
    "",
    "▼ Free chart sample + risk calculator → https://www.easytradesetup.com",
    "▼ Lifetime indicator (no monthly fee) → https://www.easytradesetup.com/pricing",
    "",
    "Educational content. Not investment advice.",
    "",
    seoTags,
    "",
    `(post-${day})`,
  ].join("\n").slice(0, 4900);
}

// Smarter title: emoji hook + benefit + #Shorts. YT algo penalises
// titles that are pure hashtag spam, so we keep #Shorts at end + a few
// keyword tags only when there's space.
function ytTitleFromHook(hook: string, keywordTarget: string | null): string {
  // Pick a leading emoji based on keyword target so titles aren't all
  // identical to algo. Trading-related → 📈, money/value → 💰, default → ⚡
  const target = (keywordTarget ?? "").toLowerCase();
  let prefix = "⚡";
  if (target.includes("price") || target.includes("trend") || target.includes("structure")) prefix = "📈";
  else if (target.includes("risk") || target.includes("position")) prefix = "🛡️";
  else if (target.includes("payment") || target.includes("subscription") || target.includes("luxalgo")) prefix = "💰";
  else if (target.includes("supply") || target.includes("demand") || target.includes("zone")) prefix = "🎯";

  const base = `${prefix} ${hook}`;
  // Reserve 12 chars for " #Shorts" suffix (with leading space).
  const truncated = base.length > 88 ? `${base.slice(0, 87)}…` : base;
  return `${truncated} #Shorts`.slice(0, 100);
}

// Pick 8 SEO hashtags: always include #Shorts + #easytradesetup + brand,
// plus keyword-relevant choices from the pool. Returned as a single line
// space-separated (YT description format).
function pickSeoHashtags(keywordTarget: string | null): string {
  const target = (keywordTarget ?? "").toLowerCase();
  const always = ["#Shorts", "#YouTubeShorts", "#easytradesetup", "#goldenindicator"];

  const conditional: string[] = [];
  if (target.includes("nifty") || target.includes("indian") || target.includes("india")) {
    conditional.push("#nifty", "#niftytrading", "#stockmarketindia", "#banknifty");
  } else {
    conditional.push("#trading", "#daytrading", "#stockmarket");
  }
  if (target.includes("luxalgo") || target.includes("subscription") || target.includes("payment")) {
    conditional.push("#tradingindicators", "#tradingview", "#pinescript");
  } else if (target.includes("supply") || target.includes("demand") || target.includes("zone")) {
    conditional.push("#supplyanddemand", "#priceaction", "#smartmoneyconcepts");
  } else {
    conditional.push("#priceaction", "#technicalanalysis", "#tradingstrategy");
  }

  return [...always, ...conditional].slice(0, 10).join(" ");
}

// Tag array sent to YT API (separate from description hashtags). Each
// entry must be plain text, no `#` prefix.
function ytTagsForVideo(keywordTarget: string | null): string[] {
  const tags = pickSeoHashtags(keywordTarget).split(" ").map((t) => t.replace(/^#/, ""));
  // YT prefers some longer-form tags too, not just niche hashtags.
  return [...tags, "trading education", "stock market", "trading indicator", "tradingview", "easytradesetup"].slice(0, 30);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Pause switch. Two ways to dormant the YT pipeline without removing
  // the cron entry from vercel.json:
  //   1. Set YT_PAUSED=1   — explicit pause flag
  //   2. Leave YT_REFRESH_TOKEN empty — token-driven pause (matches the
  //      "drop YT for now" workflow without losing queue state)
  // In both cases we no-op cleanly. We do NOT claim the row, so as soon
  // as the operator restores the token / unsets the flag, the same row
  // is still pending and gets picked up on the next cron tick.
  const paused      = process.env.YT_PAUSED === "1" || process.env.YT_PAUSED === "true";
  const noToken     = !process.env.YT_REFRESH_TOKEN;
  if (paused || noToken) {
    return NextResponse.json({
      ok:      true,
      paused:  true,
      reason:  paused ? "YT_PAUSED env flag" : "YT_REFRESH_TOKEN empty",
      message: "YT publisher dormant — no row claimed, queue intact",
    });
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
      title:       ytTitleFromHook(post.hook, post.keyword_target),
      description: ytDescriptionFromCaption(post.caption, post.day, post.keyword_target),
      tags:        ytTagsForVideo(post.keyword_target),
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

    // Flip private → public via videos.update. Testing-mode YT projects
    // force private at upload time; this owner-initiated visibility change
    // is allowed even pre-audit. Failure here doesn't fail the cron — the
    // video is uploaded, we just record that it's still private so the
    // operator can flip manually or rerun.
    const wentPublic = await makePublic(result.videoId);

    await sb
      .from("content_posts")
      .update({
        yt_status:        "published",
        yt_video_id:      result.videoId,
        yt_url:           result.url,
        yt_published_at:  new Date().toISOString(),
        yt_error_message: wentPublic ? null : "Uploaded but flip-to-public failed — still private on YT",
      })
      .eq("id", post.id);

    return NextResponse.json({
      ok: true,
      day: post.day,
      video_id: result.videoId,
      url: result.url,
      visibility: wentPublic ? "public" : "private",
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
