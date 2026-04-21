import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>Built by one trader, for other traders.</>}
      />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>Why EasyTradeSetup exists</h2>
            <p>
              Most TradingView indicators are either beautiful charts with no logic, or dense code with no explanation.
              Golden Indicator is the opposite: simple on the chart, documented in the code, coherent in the logic.
            </p>

            <h2>What we don&apos;t do</h2>
            <ul>
              <li>We don&apos;t sell trading signals.</li>
              <li>We don&apos;t run a Telegram pump group.</li>
              <li>We don&apos;t promise returns.</li>
              <li>We don&apos;t charge recurring fees.</li>
            </ul>

            <h2>What we do</h2>
            <ul>
              <li>Write one good Pine Script, and keep improving it.</li>
              <li>Document every setup so you can replicate, not copy.</li>
              <li>Reply to emails within 24 hours.</li>
              <li>Ship pre-market notes every trading day.</li>
            </ul>

            <h2>The product roadmap</h2>
            <p>
              Lean. Always. One indicator, one price, lifetime updates. New strategies are added to the library as they
              prove themselves. Everything else stays out.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
