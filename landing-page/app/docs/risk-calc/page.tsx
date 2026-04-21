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
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>Inputs you provide</h2>
            <ul>
              <li><strong>Account size</strong> — total trading capital in your base currency (₹, $, €, whichever).</li>
              <li><strong>Risk per trade</strong> — percent of account you&apos;re willing to lose on one trade. 0.5-1% is a reasonable default.</li>
              <li><strong>Entry, stop, and symbol ATR</strong> — copy directly from the Golden Indicator readout on your chart.</li>
            </ul>

            <h2>Outputs</h2>
            <ul>
              <li><strong>Position size</strong> in lots (for F&O), contracts (for futures), or shares / units (for equities and crypto).</li>
              <li><strong>Currency risk</strong> on the trade, in your base currency.</li>
              <li><strong>1R target</strong> — the distance you&apos;re risking, projected forward.</li>
            </ul>

            <h2>Why ATR-based sizing beats fixed-position sizing</h2>
            <p>
              A fixed 1-lot or 1-contract position carries very different real-currency risk when volatility doubles — your
              downside silently scales with it. ATR-based sizing keeps your currency risk constant by shrinking the
              position when volatility is high, regardless of whether you&apos;re trading BankNifty, Gold futures, or SPX
              options.
            </p>

            <h2>Where to find it</h2>
            <p>
              Your purchase email contains a Google Sheet link. Click <strong>File → Make a copy</strong> to save your own
              editable version.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
