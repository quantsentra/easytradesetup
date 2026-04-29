import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";

export default async function AccountPage() {
  const user = await getUser();
  const email = user?.email || "";
  const fullName = (user?.user_metadata?.full_name as string | undefined) || "";
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Your account.</h1>
          <div className="tz-topbar-sub">Profile, license, and session info.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="flex flex-col gap-3">
          <Row label="Email">{email || "—"}</Row>
          <Row label="Name">{fullName || <span style={{ color: "var(--tz-ink-mute)" }}>—</span>}</Row>
          <Row label="User ID" mono>{user?.id || "—"}</Row>
          <Row label="License">
            {active ? (
              <span className="tz-chip tz-chip-acid">
                <span className="tz-chip-dot" />
                Active · lifetime
              </span>
            ) : (
              <span className="tz-chip">No license</span>
            )}
          </Row>
          <Row label="Granted">
            {entitlement?.granted_at ? new Date(entitlement.granted_at).toISOString().slice(0, 10) : "—"}
          </Row>
          <Row label="Source">
            <span className="font-mono text-[12px]">{entitlement?.source || "—"}</span>
          </Row>
        </div>

        <div className="tz-card">
          <div className="tz-card-head">
            <div>
              <div className="tz-card-title">Need help?</div>
              <div className="tz-card-sub">Founder replies within 24 hours.</div>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--tz-ink-dim)" }}>
            Prefer a private ticket? Open one in{" "}
            <a href="/portal/support" style={{ color: "var(--tz-acid-dim)" }}>/portal/support</a>.
            Or email{" "}
            <a href="mailto:welcome@easytradesetup.com" style={{ color: "var(--tz-acid-dim)" }}>
              welcome@easytradesetup.com
            </a>
            .
          </p>
          <div className="mt-4">
            <a href="/portal/support" className="tz-btn">
              Open a ticket →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="tz-tilerow justify-between !py-4 !px-5">
      <span className="tz-field-label" style={{ marginBottom: 0 }}>{label}</span>
      <span className={`text-[14px] ${mono ? "font-mono text-[12px]" : ""}`} style={{ color: "var(--tz-ink)" }}>
        {children}
      </span>
    </div>
  );
}
