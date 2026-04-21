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
            Trading in F&amp;O instruments involves significant financial risk. Past performance of any strategy
            is not indicative of future results. EasyTradeSetup products are for educational purposes only and
            do not constitute SEBI-registered investment advice. Trade only with capital you can afford to lose.
            See the full{" "}
            <Link href="/legal/disclaimer" className="link-apple">trading disclaimer</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
