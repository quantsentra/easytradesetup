const markets = [
  "NIFTY",
  "BANKNIFTY",
  "SPX",
  "NASDAQ",
  "XAU / USD",
  "BTC / USD",
  "EUR / USD",
];

const proof = [
  { k: "TradingView", v: "Pine v5" },
  { k: "Payments", v: "Razorpay · Stripe" },
  { k: "Delivery", v: "Email · Instant" },
  { k: "Support", v: "Founder reply · 24h" },
];

export default function TrustStrip() {
  return (
    <section className="above-bg">
      <div className="container-wide py-10 sm:py-14">
        <div className="glass-card-soft p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-start">
            <div>
              <div className="eye">
                <span className="eye-dot" aria-hidden />
                Built in India · ships globally
              </div>
              <p
                className="mt-3 font-display text-[22px] sm:text-[26px] leading-[1.3] tracking-tight text-ink"
                lang="hi"
              >
                साफ चार्ट। बेहतर ट्रेड।
              </p>
              <p className="mt-1 text-caption text-ink-60">
                Clean chart. Better trades. Tuned first for NSE F&amp;O, then stress-tested across global indices, commodities, forex, and crypto.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {markets.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center rounded-full border border-rule-2 bg-white/5 px-2.5 py-1 text-nano font-mono font-semibold text-ink uppercase tracking-widest"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              {proof.map((p) => (
                <div key={p.k}>
                  <dt className="text-micro font-semibold text-ink-40 uppercase tracking-wider">
                    {p.k}
                  </dt>
                  <dd className="mt-1 text-caption text-ink font-medium">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
