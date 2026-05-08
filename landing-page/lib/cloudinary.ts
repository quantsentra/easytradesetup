// Cloudinary image-to-video pipeline. Used by the YouTube cron to turn a
// static branded poster (1080x1920) into a 5-second MP4 that YT accepts.
//
// Flow:
//   1. fetch our /api/og/post/[day]/yt route → PNG bytes
//   2. POST to Cloudinary unsigned upload endpoint → public_id + URL
//   3. construct video delivery URL with du_5 (duration 5s) transformation
//   4. fetch that URL → MP4 bytes the YT API will multipart-upload
//
// Free tier: 25GB transforms / 25GB bandwidth per month. One post is
// ~3-5MB of video — comfortably within limits.
//
// Env required:
//   CLOUDINARY_CLOUD_NAME      (public — visible in any URL)
//   CLOUDINARY_UPLOAD_PRESET   (public — preset must be configured "unsigned")
//
// Note: signed uploads (with API_KEY/SECRET) are stricter but require
// crypto.createHash to sign each upload. We use unsigned for simplicity —
// Cloudinary free tier still rate-limits unsigned to prevent abuse.

// 10 seconds is comfortably above YouTube's "real video" heuristic and
// well within Shorts' 60s cap. 5 seconds was being flagged as "Processing
// abandoned" because a static-image hold under 6s reads as a malformed
// asset to YT's pipeline.
const VIDEO_DURATION_SECONDS = 10;

function envOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

// Step 1 + 2 — push image bytes to Cloudinary, get public_id back.
async function uploadImage(imageBytes: Blob): Promise<{ public_id: string; secure_url: string }> {
  const cloudName = envOrThrow("CLOUDINARY_CLOUD_NAME");
  const preset    = envOrThrow("CLOUDINARY_UPLOAD_PRESET");

  const form = new FormData();
  form.append("file", imageBytes);
  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const body = await res.json();
  if (typeof body.public_id !== "string" || typeof body.secure_url !== "string") {
    throw new Error("Cloudinary returned unexpected shape");
  }
  return { public_id: body.public_id, secure_url: body.secure_url };
}

// Step 3 — construct video URL. Single-image-as-video stays under the
// image/ resource type — the .mp4 file extension on the delivery URL is
// what tells Cloudinary to render it as video.
//
// Transformation chain (order matters for Cloudinary):
//   e_zoompan:du_N  — Ken Burns slow zoom WITH explicit duration. The
//                     colon-syntax is required when chaining a duration
//                     onto the effect — bare `du_N,e_zoompan` lets the
//                     effect's default 4s win, which is what bit us
//                     before (videos came out 0:04 instead of 0:10).
//   c_pad,h_1920,w_1080,b_auto:black — pad to exact 9:16 frame so YT
//                                       Shorts treats it as vertical.
//   q_auto                          — best quality/file-size tradeoff.
//   vc_h264                         — H.264 codec, most accepted by YT.
//
// f_mp4 / .mp4 extension redundantly force the format.
function videoUrlForImage(publicId: string): string {
  const cloudName = envOrThrow("CLOUDINARY_CLOUD_NAME");
  // Single transformation step (comma-separated). Slash-separated chained
  // transforms 400 here — the c_pad step needed `c_pad,h_,w_,b_` together
  // and that combination isn't accepted alongside e_zoompan in the same
  // chain. Source image is already 1080x1920 so padding is unnecessary.
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_zoompan:du_${VIDEO_DURATION_SECONDS},vc_h264,f_mp4/${publicId}.mp4`;
}

// Step 4 — fetch MP4 bytes the YT API will upload.
async function fetchMp4(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    throw new Error(`Cloudinary MP4 fetch failed ${res.status} for ${url}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

// Public — full pipeline. Fetches the OG image, ships it through
// Cloudinary, returns the MP4 buffer ready for YT upload.
export async function imageToVideoMp4(imageUrl: string): Promise<Buffer> {
  const imgRes = await fetch(imageUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!imgRes.ok) {
    throw new Error(`Image fetch failed ${imgRes.status} for ${imageUrl}`);
  }
  const imgBlob = await imgRes.blob();

  const { public_id } = await uploadImage(imgBlob);
  const videoUrl = videoUrlForImage(public_id);

  // Cloudinary builds the MP4 lazily on first hit — the first request
  // triggers the transformation, subsequent ones are cached. Lazy-build
  // can return 423 (Locked, building) or 500 transiently. Poll twice with
  // backoff before failing.
  const attempts = [0, 2_000, 5_000];
  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i] > 0) await new Promise((r) => setTimeout(r, attempts[i]));
    try {
      return await fetchMp4(videoUrl);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const lastTry = i === attempts.length - 1;
      if (lastTry || (!msg.includes("500") && !msg.includes("503") && !msg.includes("423") && !msg.includes("404"))) {
        // Surface the actual URL we tried so the operator can paste it
        // into a browser to diagnose. public_id can include a folder
        // prefix (e.g. ets-yt/abc123) which makes the URL non-obvious.
        throw new Error(`${msg} | tried: ${videoUrl}`);
      }
    }
  }
  throw new Error(`Cloudinary fetch unexpectedly fell through for ${videoUrl}`);
}
