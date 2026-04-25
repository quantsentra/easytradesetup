import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lede="Last updated: 2026-04-21" />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>1. What we collect</h2>
            <ul>
              <li><strong>Email address</strong> — to deliver your purchase and market updates.</li>
              <li><strong>Name</strong> — when you use the contact form.</li>
              <li><strong>Payment metadata</strong> — order ID, amount, timestamp. Card details are never stored on our
                servers; payment processing is handled by third-party providers.</li>
            </ul>

            <h2>2. How we use it</h2>
            <ul>
              <li>To deliver the product you purchased.</li>
              <li>To respond to your messages.</li>
              <li>To send daily market updates (customers only, until you unsubscribe).</li>
            </ul>

            <h2>3. What we don&apos;t do</h2>
            <ul>
              <li>Sell or rent your data to anyone.</li>
              <li>Track you across the web.</li>
              <li>Run third-party advertising pixels.</li>
            </ul>

            <h2>4. Your rights</h2>
            <p>
              Email <a href="mailto:hello@easytradesetup.com">hello@easytradesetup.com</a> to request data export or
              deletion. We&apos;ll respond within 30 days.
            </p>

            <h2>5. Cookies</h2>
            <p>
              We use only essential cookies required for site functionality. No analytics or tracking cookies are set
              without your consent.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
