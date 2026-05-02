import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Returns Policy",
  description:
    "All sales are final. The product is a one-time digital download — Pine Script + bundle, delivered instantly on payment. Install help via support tickets.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Returns Policy"
        lede="Last updated: 2026-04-27"
      />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>All sales are final</h2>
            <p>
              Golden Indicator is a one-time digital purchase — Pine Script source plus the
              bundled materials (Interactive Course + Quiz, Risk Calculator, Chart Gallery,
              Founder welcome note, lifetime updates). Once your portal access is unlocked
              and the materials are delivered, the sale is final.
            </p>

            <h2>Why no refunds</h2>
            <p>
              Trading tools cannot be "returned" once delivered the same way a physical product
              can. The Pine Script source can be downloaded, installed, copied, and screenshotted
              the moment you receive it. Offering refunds turns the product into a free trial,
              which is unfair to buyers who pay and stay.
            </p>

            <h2>If something does not work, we fix it</h2>
            <p>
              Install issues, errors on your TradingView chart, or anything that prevents you from
              using the indicator as documented &mdash; open a support ticket from your portal:
              {" "}
              <a href="https://portal.easytradesetup.com/support">portal &rarr; support</a>.
              A human replies within 24 hours and walks you through the fix.
            </p>
            <p>
              If we cannot make it work for your environment after a genuine support attempt,
              we will refund you in full. The policy protects against impulse-refunds and
              outcome-disappointment, not against genuine technical failure on our side.
            </p>

            <h2>What is not a refund situation</h2>
            <ul>
              <li>You changed your mind after install.</li>
              <li>Trading results disappointed you. The product is a chart tool. It does not
                  predict markets, and we make no profit claims. You decide every trade.</li>
              <li>You no longer have access to the original payment method.</li>
              <li>You bought it for someone else without their consent.</li>
            </ul>

            <h2>Chargebacks</h2>
            <p>
              We share order details, delivery confirmation, IP logs, and download timestamps
              with the payment processor on request. Chargebacks filed without first opening a
              support ticket are disputed in full.
            </p>

            <h2>Indian buyers</h2>
            <p>
              Indian Consumer Protection (E-Commerce) Rules 2020 permit a "no return" policy on
              digital goods that have been downloaded or accessed. By completing checkout you
              acknowledge the digital nature of the product and waive return rights once access
              is granted.
            </p>

            <h2>Contact</h2>
            <p>
              Support: <a href="https://portal.easytradesetup.com/support">portal &rarr; support</a>{" "}
              (preferred). Or email <a href="mailto:thomas@easytradesetup.com">thomas@easytradesetup.com</a>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
