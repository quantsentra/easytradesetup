import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Trading Disclaimer" };

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Trading Disclaimer" lede="Please read carefully before using Golden Indicator." />
      <section className="container-x py-16">
        <Prose>
          <h2>High-risk activity</h2>
          <p>
            Trading in stocks, futures, options, commodities, forex, and crypto involves substantial risk and is not
            suitable for every investor. You can lose some or all of your invested capital. Do not trade with money you
            cannot afford to lose.
          </p>

          <h2>Not investment advice</h2>
          <p>
            EasyTradeSetup is a provider of charting software. We are not a SEBI-registered research analyst or
            investment advisor. Nothing we publish — the indicator, the strategies, the market updates — constitutes
            investment advice or a recommendation to buy or sell any security.
          </p>

          <h2>No performance guarantees</h2>
          <p>
            Past performance of any trading strategy or signal does not guarantee future results. Backtested performance
            has inherent limitations, including look-ahead bias and the absence of actual execution costs.
          </p>

          <h2>Your responsibility</h2>
          <ul>
            <li>You alone are responsible for your trading decisions.</li>
            <li>Consult a qualified advisor before making any investment decision.</li>
            <li>Understand the products you trade — leverage, margin, expiry mechanics, circuit limits.</li>
            <li>Only risk capital you can afford to lose.</li>
          </ul>

          <h2>Jurisdiction</h2>
          <p>
            Our product is primarily intended for users in India who trade on NSE and BSE. If you access it from
            elsewhere, you are responsible for compliance with your local laws and exchange regulations.
          </p>
        </Prose>
      </section>
    </>
  );
}
