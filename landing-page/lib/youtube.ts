// YouTube Data API v3 client. Handles OAuth refresh + video upload.
//
// Auth pattern: long-lived refresh token granted once at setup, exchanged
// for a fresh 1-hour access token before each upload. We don't store the
// access token — it's re-derived per cron run.
//
// Quota: each video upload costs 1600 units. Free tier = 10,000 units/day
// = ~6 uploads/day. We post once daily — plenty.
//
// Env required:
//   YT_CLIENT_ID         (Google Cloud OAuth 2.0 client)
//   YT_CLIENT_SECRET     (OAuth client secret)
//   YT_REFRESH_TOKEN     (long-lived, granted via consent flow once)
//
// Endpoints:
//   POST oauth2.googleapis.com/token              — refresh access token
//   POST upload.googleapis.com/youtube/v3/videos  — multipart video upload

export type YtUploadResult =
  | { ok: true; videoId: string; url: string }
  | { ok: false; error: string };

function envOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

// Exchange refresh_token for a fresh access_token. Called once per upload
// — Google's tokens last 1 hour, plenty for a single multipart upload.
async function getAccessToken(): Promise<string> {
  const clientId     = envOrThrow("YT_CLIENT_ID");
  const clientSecret = envOrThrow("YT_CLIENT_SECRET");
  const refreshToken = envOrThrow("YT_REFRESH_TOKEN");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type:    "refresh_token",
    }).toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth refresh failed ${res.status}: ${text.slice(0, 300)}`);
  }
  const body = await res.json();
  if (typeof body.access_token !== "string") {
    throw new Error("OAuth response missing access_token");
  }
  return body.access_token;
}

// YouTube's multipart upload format — RFC 1867 multipart/related where the
// first part is JSON metadata and the second is the binary video. Easier
// than chunked resumable upload for files under 100MB (our slideshow MP4s
// are ~1MB).
function buildMultipartBody(opts: {
  metadata: object;
  videoBytes: Buffer;
  videoMimeType: string;
}): { body: Buffer; boundary: string } {
  const boundary = `ets-yt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const partA =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(opts.metadata)}\r\n`;
  const partB =
    `--${boundary}\r\n` +
    `Content-Type: ${opts.videoMimeType}\r\n\r\n`;
  const tail = `\r\n--${boundary}--\r\n`;

  const body = Buffer.concat([
    Buffer.from(partA, "utf8"),
    Buffer.from(partB, "utf8"),
    opts.videoBytes,
    Buffer.from(tail, "utf8"),
  ]);
  return { body, boundary };
}

// Public — upload one video as a Short. shortForm=true hints the YT
// upload that 9:16 vertical, ≤60s content should be classified for the
// Shorts shelf (#Shorts in title also helps).
export async function uploadShort(opts: {
  title:       string;
  description: string;
  tags?:       string[];
  videoBytes:  Buffer;
  videoMime?:  string;
}): Promise<YtUploadResult> {
  try {
    const accessToken = await getAccessToken();

    const metadata = {
      snippet: {
        title:       opts.title.slice(0, 100),
        description: opts.description.slice(0, 4900),
        tags:        opts.tags?.slice(0, 30) ?? [],
        // Category 27 = Education
        categoryId:  "27",
      },
      status: {
        // 'public' goes live immediately. For first uploads while you're
        // still verifying — switch to 'unlisted' if you want a manual gate.
        privacyStatus:           "public",
        selfDeclaredMadeForKids: false,
      },
    };

    const { body, boundary } = buildMultipartBody({
      metadata,
      videoBytes:    opts.videoBytes,
      videoMimeType: opts.videoMime ?? "video/mp4",
    });

    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": `multipart/related; boundary=${boundary}`,
          "content-length": body.length.toString(),
        },
        body: body as unknown as BodyInit,
        cache: "no-store",
        signal: AbortSignal.timeout(120_000),
      },
    );

    const text = await res.text();
    let json: unknown = null;
    try { json = JSON.parse(text); } catch { /* leave raw */ }

    if (!res.ok) {
      const errMsg =
        (json as { error?: { message?: string } } | null)?.error?.message ?? text.slice(0, 300);
      return { ok: false, error: `YT API ${res.status}: ${errMsg}` };
    }

    const videoId = (json as { id?: string } | null)?.id;
    if (typeof videoId !== "string") {
      return { ok: false, error: "YT API returned no video id" };
    }
    return {
      ok: true,
      videoId,
      url: `https://youtube.com/shorts/${videoId}`,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
