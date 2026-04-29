import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lede="Last updated: 2026-04-28" />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>1. What we collect</h2>
            <ul>
              <li><strong>Email address</strong> — to deliver your purchase and market updates.</li>
              <li><strong>Name</strong> — when you use the contact form.</li>
              <li><strong>Payment metadata</strong> — order ID, amount, timestamp. Card details are never stored on our
                servers; payment processing is handled by third-party providers.</li>
              <li><strong>Anonymous usage data</strong> — page views, click patterns, scroll depth, device / browser /
                country, and aggregated session recordings (no keystrokes, no form input). Used solely to improve the
                site. Details in section 6.</li>
            </ul>

            <h2>2. How we use it</h2>
            <ul>
              <li>To deliver the product you purchased.</li>
              <li>To respond to your messages.</li>
              <li>To send daily market updates (customers only, until you unsubscribe).</li>
              <li>To understand which pages help visitors decide and which confuse them, so we can improve copy, layout,
                and the buyer flow.</li>
            </ul>

            <h2>3. What we don&apos;t do</h2>
            <ul>
              <li>Sell or rent your data to anyone.</li>
              <li>Run third-party advertising pixels.</li>
              <li>Record keystrokes, passwords, or anything you type into form fields. Inputs are auto-masked before they
                ever leave your browser.</li>
              <li>Build cross-site profiles or share data with ad networks.</li>
            </ul>

            <h2>4. Your rights</h2>
            <p>
              Email <a href="mailto:welcome@easytradesetup.com">welcome@easytradesetup.com</a> to request data export or
              deletion. We&apos;ll respond within 30 days.
            </p>

            <h2>5. Cookies</h2>
            <p>
              We use a small number of first-party cookies required for site functionality (currency preference, sign-in
              session) and a Microsoft Clarity cookie for the anonymous analytics described in section 6. We do not run
              advertising cookies and do not share data with third-party ad networks.
            </p>

            <h2>6. Analytics &amp; session recording</h2>
            <p>
              We use <strong>Vercel Analytics</strong> for aggregated page views and Web Vitals, and{" "}
              <strong>Microsoft Clarity</strong> for heatmaps and anonymous session recordings. Clarity captures the
              same events your browser already exposes — clicks, scrolls, taps, page transitions — plus a video-style
              replay of mouse / scroll movement so we can see where the design is working and where it isn&apos;t.
            </p>
            <p>
              <strong>Clarity does not capture text you type into form fields, passwords, or payment information.</strong>{" "}
              All input is auto-masked at the browser before transmission. Recordings are stored by Microsoft for up to
              30 days and used only by us, only to improve this site. Read Microsoft&apos;s{" "}
              <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">
                privacy statement
              </a>{" "}
              for the processor side.
            </p>
            <p>
              If you would prefer not to be recorded, install a browser extension that blocks{" "}
              <code>clarity.ms</code>, or contact us at{" "}
              <a href="mailto:welcome@easytradesetup.com">welcome@easytradesetup.com</a> and we will exclude your sessions
              going forward.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
