import Link from "next/link";

export default function RiskDisclosure() {
  return (
    <div className="bg-surface hairline-t">
      <div className="container-wide py-6 sm:py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-nano font-semibold text-muted-faint uppercase tracking-widest mb-2">
            Risk Disclosure
          </div>
          <p className="text-caption text-muted leading-relaxed">
            Trading in financial instruments — stocks, F&amp;O, commodities, forex, crypto — involves significant
            risk. Past performance of any strategy is not indicative of future results. EasyTradeSetup products
            are for educational purposes only and do not constitute investment advice. For Indian users: we are
            not SEBI-registered. Trade only with capital you can afford to lose. Full{" "}
            <Link href="/legal/disclaimer" className="link-apple">trading disclaimer</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
