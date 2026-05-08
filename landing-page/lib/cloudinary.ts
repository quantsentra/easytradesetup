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

const VIDEO_DURATION_SECONDS = 5;

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

// Step 3 — construct video URL. Cloudinary serves images-as-video at
// /video/upload/<transformation>/<public_id>.mp4 — du_N forces duration.
function videoUrlForImage(publicId: string): string {
  const cloudName = envOrThrow("CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/video/upload/du_${VIDEO_DURATION_SECONDS}/${publicId}.mp4`;
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

  // Cloudinary builds the MP4 lazily on first hit. First fetch can 500 if
  // we hit too quickly — retry once after 2s on 500/503.
  try {
    return await fetchMp4(videoUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("500") || msg.includes("503")) {
      await new Promise((r) => setTimeout(r, 2_000));
      return await fetchMp4(videoUrl);
    }
    throw e;
  }
}
