import { currentUser } from "@clerk/nextjs/server";
import { getEntitlement } from "@/lib/entitlements";

export default async function AccountPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Account
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Your account.
      </h1>

      <div className="mt-8 flex flex-col gap-3">
        <Row label="Email">{email || "—"}</Row>
        <Row label="Clerk user ID" mono>{user?.id || "—"}</Row>
        <Row label="License">
          {active ? (
            <span className="chip chip-acid">Active · lifetime</span>
          ) : (
            <span className="chip">No license</span>
          )}
        </Row>
        <Row label="Granted">
          {entitlement?.granted_at
            ? new Date(entitlement.granted_at).toISOString().slice(0, 10)
            : "—"}
        </Row>
        <Row label="Source">{entitlement?.source || "—"}</Row>
      </div>

      <div className="mt-10 glass-card-soft p-6">
        <h2 className="h-card">Need help?</h2>
        <p className="mt-2 text-[14px] text-ink-60">
          Email <a href="mailto:hello@easytradesetup.com" className="text-cyan hover:underline">
            hello@easytradesetup.com
          </a>. The founder replies within 24 hours.
        </p>
      </div>
    </>
  );
}

function Row({
  label, children, mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="feat-card !p-5 flex flex-wrap items-center justify-between gap-3">
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
        {label}
      </span>
      <span className={`text-[14px] text-ink ${mono ? "font-mono" : ""}`}>
        {children}
      </span>
    </div>
  );
}
