import type { Metadata } from "next";
import RiskFirewallCalculator from "@/components/portal/RiskFirewallCalculator";

export const metadata: Metadata = {
  title: "Risk Firewall Calculator · Free",
  robots: { index: false, follow: false },
};

export default function RiskCalculatorPage() {
  return (
    <>
      <section className="tz-hero-card" style={{ padding: "26px 28px" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="tz-chip tz-chip-acid">
            <span className="tz-chip-dot" />
            Free tool · for every logged-in user
          </span>
          <span className="tz-chip">No purchase required</span>
        </div>
        <h1 className="tz-hero-title" style={{ fontSize: 30 }}>
          Risk Firewall Calculator.
        </h1>
        <p className="tz-hero-sub">
          Plug in your account, your risk %, and your trade levels. Get back a
          mechanical position-size, reward potential, R:R ratio, and a safety
          score — before you ever click Buy or Sell. The firewall stops one bad
          trade from becoming a bad month.
        </p>
      </section>

      <div className="mt-8">
        <RiskFirewallCalculator />
      </div>

      <p
        className="mt-10 text-[12px]"
        style={{ color: "var(--tz-ink-mute)", lineHeight: 1.55 }}
      >
        <strong style={{ color: "var(--tz-ink-dim)" }}>
          Educational, not investment advice.
        </strong>{" "}
        This tool is for educational purposes only and does not provide
        financial advice. Position-size math depends on instrument, broker,
        contract specification, and live spreads — verify against your broker
        before placing a real trade.
      </p>
    </>
  );
}
