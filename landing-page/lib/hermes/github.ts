// Thin GitHub REST client for the /admin/hermes operator dashboard.
//
// Why GitHub-as-backend instead of fs/Supabase:
//  - /content/ + /docs/seo/ live at repo root, outside the Vercel deploy
//    bundle. Reading them at runtime would need outputFileTracingIncludes
//    or a copy step. GitHub already serves the same view to Hermes Agent.
//  - Issues + comments are the canonical interaction surface (Hermes
//    files issues, humans comment-approve). Reading them via gh API
//    keeps a single source of truth.
//
// Auth: GITHUB_TOKEN env var — fine-grained PAT scoped to this repo
// with Contents:read + Issues:read+write. No write access to anything
// outside Issues. See /docs/seo/hermes-agent-operating-rules.md.
//
// All public functions are server-side only. Caller is responsible for
// admin auth (we layer that in the route handlers + page.tsx).

const GH_API = "https://api.github.com";

// Default to the repo we're deployed from. Can be overridden via env if
// the operator dashboard ever points at a different repo.
function repoRef() {
  const explicit = process.env.HERMES_GITHUB_REPO;
  if (explicit) return explicit;
  return "quantsentra/easytradesetup";
}

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN not set — Hermes admin needs a fine-grained PAT (Contents:read + Issues:write).");
  }
  return {
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    Accept: "application/vnd.github+json",
  };
}

async function ghFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status} ${path}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// -----------------------------------------------------------------------
// Reads
// -----------------------------------------------------------------------

export type GhFile = {
  name: string;
  path: string;
  type: "file" | "dir";
  size: number;
  html_url: string;
  download_url: string | null;
  sha: string;
};

// List a directory in the default branch.
export async function listDir(path: string): Promise<GhFile[]> {
  try {
    const data = await ghFetch<GhFile[] | GhFile>(
      `/repos/${repoRef()}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
    );
    return Array.isArray(data) ? data : [data];
  } catch (e) {
    // 404 → empty dir. Anything else → propagate.
    if (e instanceof Error && e.message.includes("404")) return [];
    throw e;
  }
}

export type GhIssue = {
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  user: { login: string; avatar_url: string };
  labels: Array<{ name: string; color: string }>;
  comments: number;
  created_at: string;
  updated_at: string;
  body: string | null;
  pull_request?: unknown; // present on PRs — we filter these out
};

export async function listIssues(opts: {
  labels?: string[];
  state?: "open" | "closed" | "all";
  perPage?: number;
} = {}): Promise<GhIssue[]> {
  const params = new URLSearchParams();
  if (opts.labels?.length) params.set("labels", opts.labels.join(","));
  params.set("state", opts.state ?? "open");
  params.set("per_page", String(opts.perPage ?? 30));
  params.set("sort", "updated");
  params.set("direction", "desc");
  const list = await ghFetch<GhIssue[]>(
    `/repos/${repoRef()}/issues?${params.toString()}`,
  );
  // /issues includes PRs by default — filter them out.
  return list.filter((i) => !i.pull_request);
}

export type GhCommit = {
  sha: string;
  html_url: string;
  commit: {
    author: { name: string; email: string; date: string };
    message: string;
  };
  author: { login: string; avatar_url: string } | null;
};

export async function listRecentCommits(opts: {
  path?: string;
  perPage?: number;
} = {}): Promise<GhCommit[]> {
  const params = new URLSearchParams();
  if (opts.path) params.set("path", opts.path);
  params.set("per_page", String(opts.perPage ?? 10));
  return ghFetch<GhCommit[]>(`/repos/${repoRef()}/commits?${params.toString()}`);
}

// -----------------------------------------------------------------------
// Writes (admin-only — gated upstream)
// -----------------------------------------------------------------------

export async function createIssue(opts: {
  title: string;
  body: string;
  labels?: string[];
}): Promise<{ number: number; html_url: string }> {
  const data = await ghFetch<{ number: number; html_url: string }>(
    `/repos/${repoRef()}/issues`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: opts.title,
        body:  opts.body,
        labels: opts.labels ?? [],
      }),
    },
  );
  return { number: data.number, html_url: data.html_url };
}

export async function commentOnIssue(opts: {
  issueNumber: number;
  body: string;
}): Promise<{ id: number; html_url: string }> {
  const data = await ghFetch<{ id: number; html_url: string }>(
    `/repos/${repoRef()}/issues/${opts.issueNumber}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: opts.body }),
    },
  );
  return { id: data.id, html_url: data.html_url };
}

// -----------------------------------------------------------------------
// Convenience
// -----------------------------------------------------------------------

export function repoBrowseUrl(path: string): string {
  return `https://github.com/${repoRef()}/tree/main/${path}`;
}

export function repoEditUrl(path: string): string {
  return `https://github.com/${repoRef()}/edit/main/${path}`;
}

export function newIssueUrl(): string {
  return `https://github.com/${repoRef()}/issues/new?template=seo-task.yml`;
}
