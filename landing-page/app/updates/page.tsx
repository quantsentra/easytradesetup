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
        title={<>Pre-market. Every trading day.</>}
        lede="Free for Golden Indicator customers. Delivered to your inbox by 8:45 AM IST."
      />

      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="space-y-4 max-w-[900px] mx-auto">
            {updates.map((u, i) => (
              <article key={i} className="card-apple p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-caption text-muted-faint">{u.date}</div>
                  <Badge tone="blue">{u.bias}</Badge>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Nifty</div>
                    <div className="mt-1 text-display-tile font-semibold text-ink tabular-nums">{u.nifty}</div>
                  </div>
                  <div>
                    <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">BankNifty</div>
                    <div className="mt-1 text-display-tile font-semibold text-ink tabular-nums">{u.bn}</div>
                  </div>
                </div>
                <p className="mt-6 text-body text-muted leading-relaxed">{u.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-caption text-muted-faint">
            Archive of past updates available to customers only.
          </p>
        </div>
      </section>
    </>
  );
}
