import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { fetchWeeklyHot } from "@/lib/hermes/reddit";
import {
  clusterPosts,
  dedupAgainstIssues,
  briefBodyFor,
  titleFor,
} from "@/lib/hermes/topic-mining";
import { listIssues, createIssue } from "@/lib/hermes/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auto-refill the Hermes backlog with N new SEO Task issues mined from
// Reddit demand signal. Free path — no Anthropic API needed. Caller
// gets back the count + URLs of issues created.
//
// Usage:
//   POST /api/admin/hermes/refill-backlog
//   body: { count?: number = 5 }   // 1 for daily, 5 for weekly
//
// Idempotency: dedups against existing open + closed hermes issues so
// re-runs don't re-seed the same topic.

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  let body: { count?: number };
  try { body = await req.json(); } catch { body = {}; }
  const count = Math.max(1, Math.min(10, Number(body.count ?? 5)));

  // 1. Fetch Reddit + cluster
  const posts    = await fetchWeeklyHot();
  if (posts.length === 0) {
    return NextResponse.json({
      ok: false,
      error: "Reddit returned 0 threads — likely blocked or rate-limited. Retry in 30 min.",
    }, { status: 503 });
  }

  const clustered = clusterPosts(posts);
  if (clustered.length === 0) {
    return NextResponse.json({
      ok: true,
      created: 0,
      message: "No question-shaped relevant threads this week. Nothing to file.",
      reddit_pool_size: posts.length,
    });
  }

  // 2. Dedup against existing issues (open + closed)
  const existingIssues = await listIssues({ labels: ["hermes"], state: "all", perPage: 100 });
  const fresh = dedupAgainstIssues(clustered, existingIssues.map((i) => i.title));

  if (fresh.length === 0) {
    return NextResponse.json({
      ok: true,
      created: 0,
      message: "All clusters this week match existing issues. Backlog already has these topics.",
      pool_size: clustered.length,
    });
  }

  // 3. Create up to `count` new issues
  const filerLine = `\n\n_Filed via /admin/hermes daily refill by ${user.email ?? user.id} — Reddit demand-scrape, ${new Date().toISOString().slice(0, 10)}_`;
  const created: Array<{ number: number; html_url: string; keyword: string; score: number }> = [];
  const errors: Array<{ keyword: string; error: string }> = [];

  for (const cluster of fresh.slice(0, count)) {
    try {
      const issue = await createIssue({
        title:  titleFor(cluster),
        body:   briefBodyFor(cluster) + filerLine,
        labels: ["seo", "hermes", "blog", "auto-mined"],
      });
      created.push({
        number:   issue.number,
        html_url: issue.html_url,
        keyword:  cluster.primaryKeyword,
        score:    Math.round(cluster.totalDemand),
      });
    } catch (e) {
      errors.push({
        keyword: cluster.primaryKeyword,
        error:   e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json({
    ok:               true,
    created:          created.length,
    issues:           created,
    errors,
    reddit_pool_size: posts.length,
    cluster_count:    clustered.length,
    fresh_count:      fresh.length,
  });
}
