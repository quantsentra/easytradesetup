import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { listIssues } from "@/lib/hermes/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the daily Claude Code prompt with #N pre-filled for the
// oldest open hermes issue. Client copies the response text to
// clipboard, opens Claude Code, pastes, and the article gets drafted.
//
// This is the "remaining one manual step" in the otherwise-clicked
// daily routine. Reason: drafting needs a Claude session, and the
// user's Claude Code subscription only runs interactively, not via
// API. So we make pasting the prompt as low-friction as possible.

const PROMPT_TEMPLATE = (issueNumber: number, title: string) =>
`Draft GitHub issue #${issueNumber} from quantsentra/easytradesetup. Issue title: "${title}".

Read the issue body for the brief. Then:

1. Read /docs/seo/brand-voice.md and /docs/seo/publishing-rules.md for tone + checklist
2. Read landing-page/app/(marketing)/blog/best-indicator-for-nifty-options/page.tsx as a reference for length, structure, and JSON-LD wiring
3. Write the article TSX at landing-page/app/(marketing)/blog/<slug>/page.tsx
4. Append entry to landing-page/lib/blog.ts (slug, title, metaTitle, metaDescription, excerpt, hook, primaryKeyword, secondaryKeywords, audienceTier, pillar, datePublished, readMinutes)
5. Add paper-trail markdown at /content/blog/<slug>.md following _TEMPLATE-blog-article.md
6. Add smoke test row to landing-page/tests/e2e/pages.spec.ts ({ path: "/blog/<slug>", mustContain: /<keyword regex>/i })
7. Run: npx tsc --noEmit and npm run build to verify
8. Commit and push directly to main (sales-priority shipping mode active)
9. Tell me the live URL and the commit hash

Constraints:
- No banned terms anywhere (guaranteed, secret, 100%, no loss, sure shot)
- Inline risk callout in any section that names a setup or P&L hypothetical
- Footer disclaimer block mandatory
- ≥3 internal links to /sample /product /pricing /compare /docs/faq
- Sales focus is the indicator — soft CTAs only ("See the sample", "See the bundle", "Lock inaugural")
- Length 1,000–1,800 words
- Author field: "EasyTradeSetup Editorial"
`;

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  try {
    const open = await listIssues({ labels: ["hermes"], state: "open", perPage: 30 });
    if (open.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "No open hermes issues. Click 'Refill backlog' first to mine new topics.",
      }, { status: 404 });
    }

    // Oldest open = most aged in queue = ship-first.
    const oldest = open.sort((a, b) => a.number - b.number)[0];

    return NextResponse.json({
      ok:           true,
      issueNumber:  oldest.number,
      issueTitle:   oldest.title,
      issueUrl:     oldest.html_url,
      prompt:       PROMPT_TEMPLATE(oldest.number, oldest.title),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
