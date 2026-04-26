import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";

export default async function DownloadsPage() {
  const user = await getUser();
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  if (!active) {
    return (
      <>
        <div className="tz-topbar">
          <div>
            <h1 className="tz-topbar-title">Downloads.</h1>
            <div className="tz-topbar-sub">Locked until license is active.</div>
          </div>
        </div>
        <div className="tz-card">
          <p className="text-[15px]" style={{ color: "var(--tz-ink-dim)" }}>
            Your download library unlocks the moment your license activates. Buy at the inaugural price
            to get access.
          </p>
          <div className="mt-5">
            <Link href="/checkout" className="tz-btn tz-btn-primary">
              Buy · lifetime access →
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Your files.</h1>
          <div className="tz-topbar-sub">Signed links expire in 10 minutes. Request a new link any time.</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
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

      <p className="mt-8 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
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
    <div className="tz-tilerow justify-between">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold" style={{ color: "var(--tz-ink)" }}>{name}</div>
        <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--tz-ink-mute)" }}>{version}</div>
        <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-widest"
          style={{ color: "var(--tz-ink-faint)" }}>
          {sizeHint}
        </div>
      </div>
      <form action="/api/portal/download" method="POST">
        <input type="hidden" name="path" value={storagePath} />
        <button type="submit" className="tz-btn tz-btn-primary">
          Download →
        </button>
      </form>
    </div>
  );
}
