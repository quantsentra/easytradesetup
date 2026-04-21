import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Talk to a <span className="italic text-gold">person.</span></>}
        lede="Direct line to the founder. No ticket queue, no chatbot."
      />
      <section className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-10">
            <div className="label-kicker">Email</div>
            <a
              href="mailto:hello@easytradesetup.com"
              className="mt-4 block font-display text-3xl text-gold hover:underline underline-offset-4"
            >
              hello@easytradesetup.com
            </a>
            <p className="mt-4 text-sm text-cream-muted">Response within 24 hours on business days.</p>
          </div>
          <div className="glass-card p-10">
            <div className="label-kicker">Before you write</div>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-muted">
              <li>— For install issues, check <a href="/docs/install" className="text-gold underline">docs/install</a> first.</li>
              <li>— For refund requests, include order ID and reason.</li>
              <li>— For bulk licensing (trading rooms, academies), mention team size.</li>
            </ul>
          </div>
        </div>

        <form
          action="/api/lead"
          method="POST"
          className="mt-10 glass-card p-10"
        >
          <div className="label-kicker">Quick message</div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-mono text-cream-dim">Name</span>
              <input
                name="name"
                required
                className="bg-ink-soft border border-ink-border rounded-lg px-4 py-3 text-cream placeholder-cream-dim focus:outline-none focus:border-gold transition-colors"
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-mono text-cream-dim">Email</span>
              <input
                name="email"
                type="email"
                required
                className="bg-ink-soft border border-ink-border rounded-lg px-4 py-3 text-cream placeholder-cream-dim focus:outline-none focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-xs font-mono text-cream-dim">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              className="bg-ink-soft border border-ink-border rounded-lg px-4 py-3 text-cream placeholder-cream-dim focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="What would you like to ask?"
            />
          </label>
          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-cream text-ink px-6 py-3 font-medium hover:bg-gold transition-colors"
          >
            Send →
          </button>
        </form>
      </section>
    </>
  );
}
