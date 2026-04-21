import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Market updates",
  description: "Daily pre-market notes — Nifty bias, key levels, expiry gamma. Free for customers.",
};

const updates = [
  {
    date: "2026-04-21",
    bias: "Neutral-to-bullish",
    nifty: "24,852",
    bn: "54,210",
    note: "Opening range forming above yesterday's high. Watch 24,880 for breakout confirmation. Expiry gamma clusters at 24,800 and 24,900.",
  },
  {
    date: "2026-04-20",
    bias: "Bullish",
    nifty: "24,740",
    bn: "53,980",
    note: "Strong session close. Session Timer marked high-volume zone between 10:15-11:00 IST. BankNifty leading on relative strength.",
  },
  {
    date: "2026-04-18",
    bias: "Range",
    nifty: "24,610",
    bn: "53,820",
    note: "Tight range day. Mean Reversion strategy preferred over momentum. Avoid breakout entries until volume confirms.",
  },
];

export default function UpdatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily Updates"
        title={<>Pre-market. <span className="italic text-gold">Every trading day.</span></>}
        lede="Free for Golden Indicator customers. Delivered to your inbox by 8:45 AM IST."
      />

      <section className="container-x py-16">
        <div className="space-y-4">
          {updates.map((u, i) => (
            <article key={i} className="glass-card p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-cream-dim">{u.date}</div>
                <Badge tone="gold">{u.bias}</Badge>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="label-kicker">Nifty</div>
                  <div className="mt-1 font-mono text-xl">{u.nifty}</div>
                </div>
                <div>
                  <div className="label-kicker">BankNifty</div>
                  <div className="mt-1 font-mono text-xl">{u.bn}</div>
                </div>
              </div>
              <p className="mt-6 text-cream-muted leading-relaxed">{u.note}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-cream-dim">
          Archive of past updates available to customers only.
        </p>
      </section>
    </>
  );
}
