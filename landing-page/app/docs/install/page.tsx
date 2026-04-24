import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Install Golden Indicator on TradingView",
  description:
    "Step-by-step guide to install Golden Indicator on TradingView. Pine v5, works on free + paid plans. 90-second setup with screenshots.",
  keywords: [
    "install TradingView indicator",
    "Pine Script install guide",
    "add Pine v5 to TradingView",
    "Golden Indicator setup",
  ],
  alternates: { canonical: "/docs/install" },
  openGraph: {
    title: "Install Golden Indicator on TradingView",
    description: "Pine v5 setup in 90 seconds. Works on the free plan.",
    url: "https://easytradesetup.com/docs/install",
    type: "article",
  },
};

export default function InstallPage() {
  return (
    <>
      <PageBreadcrumbs name="Install" path="/docs/install" />
      <PageHeader eyebrow="Docs / Install" title="Install on TradingView" lede="Ninety seconds, start to finish." />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>Before you start</h2>
            <ul>
              <li>A TradingView account (the free tier works).</li>
              <li>The <code>Golden-Indicator.pine</code> file from your purchase email.</li>
            </ul>

            <h2>Step 1 — Open Pine Editor</h2>
            <p>
              Log into TradingView, open any chart, then click <strong>Pine Editor</strong> at the bottom of the screen.
            </p>

            <h2>Step 2 — Paste the script</h2>
            <p>
              Open <code>Golden-Indicator.pine</code> in any text editor, select all (<code>Ctrl+A</code>), copy
              (<code>Ctrl+C</code>), and paste into the Pine Editor — replacing the default template.
            </p>

            <h2>Step 3 — Save and add to chart</h2>
            <p>
              Click <strong>Save</strong>, give it any name, then click <strong>Add to chart</strong>. The indicator will
              render immediately.
            </p>

            <h2>Step 4 — Pin it</h2>
            <p>
              Open the indicator settings (gear icon), tune inputs to your market and timeframe, then click the
              <strong> favorites star</strong> to pin it across all charts.
            </p>

            <h3>Troubleshooting</h3>
            <ul>
              <li><strong>&ldquo;script has errors&rdquo;</strong> — ensure you pasted the full file, no missing lines.</li>
              <li><strong>Signals look different from the preview</strong> — Pine Script repaints on non-final bars. Use bar-close signals only.</li>
              <li><strong>Nothing shows on chart</strong> — try a lower timeframe (15m/5m) with at least 500 bars loaded.</li>
            </ul>
          </Prose>
        </div>
      </section>
    </>
  );
}
