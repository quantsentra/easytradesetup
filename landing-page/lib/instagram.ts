// Instagram Business Login API client. Uses the new graph.instagram.com
// endpoints (not the legacy graph.facebook.com flow) — tokens start with
// `IGAA...` and are scoped directly to the Instagram Business account, no
// Facebook Page indirection.
//
// Two-step publishing flow per post:
//   1. POST /{ig-user-id}/media          — create a media container
//      For static/single-image: pass image_url + caption
//      For carousel: pass media_type=CAROUSEL + children=[child container ids]
//   2. POST /{ig-user-id}/media_publish  — publish the container
//
// Tokens expire in ~60 days. Refresh via /refresh_access_token before then —
// see scripts/refresh-instagram-token.ts. Set INSTAGRAM_LONG_TOKEN in Vercel.

const API_BASE = "https://graph.instagram.com";
const API_VERSION = "v23.0";

export type IgPublishResult =
  | { ok: true; mediaId: string; permalink?: string }
  | { ok: false; error: string };

function envOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function igConfig() {
  return {
    userId: envOrThrow("INSTAGRAM_USER_ID"),
    token:  envOrThrow("INSTAGRAM_LONG_TOKEN"),
  };
}

// Wraps one Meta call with timeout + JSON parsing.
async function igFetch(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  let body: unknown = null;
  try { body = JSON.parse(text); } catch { /* keep raw */ }

  if (!res.ok) {
    const errMsg =
      (body as { error?: { message?: string } } | null)?.error?.message ?? text;
    throw new Error(`IG API ${res.status}: ${errMsg}`);
  }
  return body as Record<string, unknown>;
}

// Step 1 — create a single-image media container.
async function createSingleContainer(opts: {
  imageUrl: string;
  caption: string;
}): Promise<string> {
  const { userId, token } = igConfig();
  const params = new URLSearchParams({
    image_url:   opts.imageUrl,
    caption:     opts.caption,
    access_token: token,
  });
  const body = await igFetch(
    `${API_BASE}/${API_VERSION}/${userId}/media?${params.toString()}`,
    { method: "POST" },
  );
  const id = body.id;
  if (typeof id !== "string") throw new Error("IG returned no container id");
  return id;
}

// Step 1b — create a carousel item child (image only). Caption is omitted
// here — only the parent carousel container carries the caption.
async function createCarouselChild(imageUrl: string): Promise<string> {
  const { userId, token } = igConfig();
  const params = new URLSearchParams({
    image_url:    imageUrl,
    is_carousel_item: "true",
    access_token: token,
  });
  const body = await igFetch(
    `${API_BASE}/${API_VERSION}/${userId}/media?${params.toString()}`,
    { method: "POST" },
  );
  const id = body.id;
  if (typeof id !== "string") throw new Error("IG returned no child container id");
  return id;
}

// Step 1c — create the carousel parent that wraps 2-10 child containers.
async function createCarouselParent(opts: {
  childIds: string[];
  caption: string;
}): Promise<string> {
  const { userId, token } = igConfig();
  if (opts.childIds.length < 2 || opts.childIds.length > 10) {
    throw new Error(`Carousel needs 2-10 slides, got ${opts.childIds.length}`);
  }
  const params = new URLSearchParams({
    media_type:   "CAROUSEL",
    children:     opts.childIds.join(","),
    caption:      opts.caption,
    access_token: token,
  });
  const body = await igFetch(
    `${API_BASE}/${API_VERSION}/${userId}/media?${params.toString()}`,
    { method: "POST" },
  );
  const id = body.id;
  if (typeof id !== "string") throw new Error("IG returned no carousel parent id");
  return id;
}

// Step 1d — poll container status until FINISHED. Required especially for
// carousels: the parent container needs all children resolved before
// media_publish will accept it. Without this poll we hit:
//   "IG API 400: Media ID is not available"
// because we tried to publish a still-IN_PROGRESS container.
//
// status_code values: IN_PROGRESS | FINISHED | ERROR | EXPIRED | PUBLISHED
async function waitForContainerReady(
  containerId: string,
  opts: { maxWaitMs?: number; intervalMs?: number } = {},
): Promise<void> {
  const { token } = igConfig();
  const maxWaitMs  = opts.maxWaitMs  ?? 60_000;
  const intervalMs = opts.intervalMs ?? 3_000;
  const deadline   = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const params = new URLSearchParams({
      fields:       "status_code",
      access_token: token,
    });
    const body = await igFetch(
      `${API_BASE}/${API_VERSION}/${containerId}?${params.toString()}`,
    );
    const status = body.status_code;
    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") {
      throw new Error(`IG container ${containerId} status=${status}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`IG container ${containerId} not ready within ${maxWaitMs}ms`);
}

// Step 2 — publish a previously-created container. Returns the live post id.
async function publishContainer(containerId: string): Promise<string> {
  const { userId, token } = igConfig();
  const params = new URLSearchParams({
    creation_id:  containerId,
    access_token: token,
  });
  const body = await igFetch(
    `${API_BASE}/${API_VERSION}/${userId}/media_publish?${params.toString()}`,
    { method: "POST" },
  );
  const id = body.id;
  if (typeof id !== "string") throw new Error("IG returned no media id on publish");
  return id;
}

// Public — single image post (the simpler of the two formats).
export async function publishSingleImage(opts: {
  imageUrl: string;
  caption: string;
}): Promise<IgPublishResult> {
  try {
    const containerId = await createSingleContainer(opts);
    await waitForContainerReady(containerId);
    const mediaId = await publishContainer(containerId);
    const permalink = await tryFetchPermalink(mediaId);
    return { ok: true, mediaId, permalink };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Public — carousel of 2-10 images sharing one caption.
export async function publishCarousel(opts: {
  imageUrls: string[];
  caption: string;
}): Promise<IgPublishResult> {
  try {
    const childIds = await Promise.all(opts.imageUrls.map(createCarouselChild));
    // Each child must be FINISHED before the parent will resolve cleanly.
    await Promise.all(childIds.map((id) => waitForContainerReady(id)));
    const parentId = await createCarouselParent({ childIds, caption: opts.caption });
    // Parent itself also needs a moment to bind to its children.
    await waitForContainerReady(parentId);
    const mediaId = await publishContainer(parentId);
    const permalink = await tryFetchPermalink(mediaId);
    return { ok: true, mediaId, permalink };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Best-effort permalink lookup. Failure here doesn't fail the publish — we
// only use the URL for analytics + admin display.
async function tryFetchPermalink(mediaId: string): Promise<string | undefined> {
  try {
    const { token } = igConfig();
    const params = new URLSearchParams({
      fields: "permalink",
      access_token: token,
    });
    const body = await igFetch(
      `${API_BASE}/${API_VERSION}/${mediaId}?${params.toString()}`,
    );
    return typeof body.permalink === "string" ? body.permalink : undefined;
  } catch {
    return undefined;
  }
}

// Refresh a long-lived token (extends expiry by another ~60 days). Run this
// monthly via cron — see /api/cron/refresh-instagram-token.
export async function refreshLongLivedToken(currentToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type:   "ig_refresh_token",
    access_token: currentToken,
  });
  const body = await igFetch(`${API_BASE}/refresh_access_token?${params.toString()}`);
  const access_token = body.access_token;
  const expires_in   = body.expires_in;
  if (typeof access_token !== "string" || typeof expires_in !== "number") {
    throw new Error("Token refresh returned unexpected shape");
  }
  return { access_token, expires_in };
}
