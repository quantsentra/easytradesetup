import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brand kit · Admin",
  robots: { index: false, follow: false },
};

// Admin-only brand kit reference. The interactive HTML lives in
// landing-page/admin-assets/brand/brand-kit.html (outside public/) and
// is served by /api/admin/brand-kit/[...path] which gates on isAdmin
// and applies a relaxed CSP scoped to the iframe document.
export default function BrandKitPage() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Brand kit.</h1>
          <div className="tz-topbar-sub">
            Single source of truth for off-platform creative — colors, typography, gradients,
            social asset specs, voice rules. Admin-only; not exposed publicly.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/brand-assets" className="tz-btn tz-btn-primary">
            ↓ Download assets
          </Link>
          <Link href="/api/admin/brand-kit/brand-kit.html" target="_blank" className="tz-btn">
            ↗ Open in tab
          </Link>
          <Link href="/api/admin/brand-kit/design-tokens.json" target="_blank" className="tz-btn">
            ↓ Tokens JSON
          </Link>
          <Link href="/api/admin/brand-kit/README.md" target="_blank" className="tz-btn">
            ↓ Handoff README
          </Link>
        </div>
      </div>

      <div
        className="tz-card"
        style={{
          padding: 0,
          overflow: "hidden",
          height: "calc(100vh - 220px)",
          minHeight: 720,
        }}
      >
        <iframe
          src="/api/admin/brand-kit/brand-kit.html"
          title="EasyTradeSetup Brand Kit"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
        />
      </div>

      <p className="mt-4 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Brand assets live at landing-page/admin-assets/brand/ · Edit the HTML to update · Outside public/, admin-gated by /api/admin/brand-kit/[...path]
      </p>
    </>
  );
}
