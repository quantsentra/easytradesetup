import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getEntitlement } from "@/lib/entitlements";

export default async function DownloadsPage() {
  const user = await currentUser();
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  if (!active) {
    return (
      <div className="glass-card p-8">
        <h1 className="h-tile">Locked</h1>
        <p className="mt-3 text-[15px] text-ink-60">
          Downloads unlock after your license activates. Reserve the launch price to get access.
        </p>
        <Link href="/checkout" className="btn btn-acid mt-6">
          Reserve · lifetime access →
        </Link>
      </div>
    );
  }

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Downloads
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Your files.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60">
        All downloads are signed links that expire in 10 minutes. Request a new link any time.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <FileRow
          name="Golden Indicator · Pine v5"
          version="v2.4 · released 2026-04-15"
          sizeHint=".pine · ~28 KB"
          storagePath="golden-indicator/v2.4/golden-indicator.pine"
        />
        <FileRow
          name="Trade Logic PDF"
          version="1st edition · 50 pages"
          sizeHint=".pdf · ~3.2 MB"
          storagePath="golden-indicator/trade-logic.pdf"
        />
        <FileRow
          name="Risk Calculator · template"
          version="XLSX + Google Sheets copy link"
          sizeHint=".xlsx · ~40 KB"
          storagePath="golden-indicator/risk-calculator.xlsx"
        />
      </div>

      <p className="mt-8 text-nano font-mono uppercase tracking-widest text-ink-40">
        Personal-use license only · Do not redistribute or resell
      </p>
    </>
  );
}

function FileRow({
  name, version, sizeHint, storagePath,
}: {
  name: string;
  version: string;
  sizeHint: string;
  storagePath: string;
}) {
  return (
    <div className="feat-card !p-5 flex flex-wrap items-center gap-4 justify-between">
      <div className="min-w-0">
        <div className="text-[15px] font-semibold text-ink">{name}</div>
        <div className="mt-0.5 text-[12.5px] text-ink-60">{version}</div>
        <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
          {sizeHint}
        </div>
      </div>
      <form action="/api/portal/download" method="POST">
        <input type="hidden" name="path" value={storagePath} />
        <button type="submit" className="btn btn-primary">
          Download →
        </button>
      </form>
    </div>
  );
}
