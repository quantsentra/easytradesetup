export default function SiteDisclaimer() {
  return (
    <aside aria-label="Risk disclaimer" className="site-disclaimer">
      <div className="container-wide">
        <div className="site-disclaimer-inner">
          <p>
            <strong>Educational, not investment advice.</strong>{" "}
            EasyTradeSetup sells a TradingView Pine v5 indicator and supporting docs. We are not
            a SEBI-registered research analyst, broker, fund manager, or investment adviser. We do
            not run signal services, copy-trading, or managed accounts. Trading futures, options,
            equities, commodities, and crypto involves substantial risk of loss. Past chart
            behaviour shown in our materials is illustrative and not a forecast of future results.
            You decide every trade.
          </p>
          <p className="mt-2">
            Indian users: please review the SEBI disclosure on the{" "}
            <a href="/legal/disclaimer" className="underline hover:text-ink-60">disclaimer page</a>{" "}
            before purchase. Trading is conducted through your own broker; we do not place,
            recommend, or solicit trades on your behalf.
          </p>
        </div>
      </div>
    </aside>
  );
}
