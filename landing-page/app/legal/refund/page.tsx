import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Refund Policy" lede="Last updated: 2026-04-21" />
      <section className="container-x py-16">
        <Prose>
          <h2>7-day refund window</h2>
          <p>
            If the Pine Script fails to install, throws errors on your chart, or does not function as documented, you
            can request a full refund within 7 days of purchase.
          </p>

          <h2>How to request</h2>
          <ol>
            <li>Email <a href="mailto:hello@easytradesetup.com">hello@easytradesetup.com</a>.</li>
            <li>Include your order ID and a short description of the issue (screenshots help).</li>
            <li>Refund is processed within 5-7 business days to the original payment method.</li>
          </ol>

          <h2>Not eligible</h2>
          <ul>
            <li>Change of mind after successful install.</li>
            <li>Dissatisfaction with trading outcomes (the product is a tool, not a signal service).</li>
            <li>Requests made after 7 days from purchase date.</li>
          </ul>

          <h2>Why this policy</h2>
          <p>
            The product is a one-time digital download. A short refund window gives you enough time to install and
            evaluate, while protecting the business from serial refund abuse.
          </p>
        </Prose>
      </section>
    </>
  );
}
