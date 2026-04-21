import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Risk calculator" };

export default function RiskCalcPage() {
  return (
    <>
      <PageHeader
        eyebrow="Docs / Risk Calculator"
        title="Size positions, don't guess them"
        lede="The calculator is a single Google Sheet. You enter three numbers; it returns your position size."
      />
      <section className="container-x py-16">
        <Prose>
          <h2>Inputs you provide</h2>
          <ul>
            <li><strong>Account size</strong> — total trading capital in ₹.</li>
            <li><strong>Risk per trade</strong> — percent of account you&apos;re willing to lose on one trade. 0.5-1% is a reasonable default.</li>
            <li><strong>Entry, stop, and symbol ATR</strong> — copy from Golden Indicator&apos;s Volatility Lens output.</li>
          </ul>

          <h2>Outputs</h2>
          <ul>
            <li><strong>Position size</strong> in lots (for F&O) or shares (for equities).</li>
            <li><strong>₹ risk</strong> on the trade.</li>
            <li><strong>1R target</strong> — the distance you&apos;re risking, projected forward.</li>
          </ul>

          <h2>Why ATR-based sizing beats fixed-lot sizing</h2>
          <p>
            A 1-lot BankNifty trade risks ~₹2,000 on a calm day and ~₹6,000 on a violent day. Fixed-lot sizing means your
            real risk silently triples. ATR-based sizing keeps your ₹-risk constant by scaling the position down when
            volatility is high.
          </p>

          <h2>Where to find it</h2>
          <p>
            Your purchase email contains a Google Sheet link. Click <strong>File → Make a copy</strong> to save your own
            editable version.
          </p>
        </Prose>
      </section>
    </>
  );
}
