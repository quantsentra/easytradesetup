import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact — Golden Indicator support",
  description:
    "Get in touch with the EasyTradeSetup team. Email hello@easytradesetup.com — founder replies within 24 hours. Refund, install, feature requests.",
  keywords: ["EasyTradeSetup contact", "Golden Indicator support", "TradingView indicator help"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact EasyTradeSetup",
    description: "Founder replies within 24 hours. hello@easytradesetup.com",
    url: "https://www.easytradesetup.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageBreadcrumbs name="Contact" path="/contact" />
      <PageHeader
        eyebrow="Contact"
        title={<>Talk to a person.</>}
        lede="Direct line to the founder. No ticket queue, no chatbot."
      />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-apple p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">Email</div>
              <a
                href="mailto:hello@easytradesetup.com"
                className="mt-4 block h-tile text-blue-link hover:underline underline-offset-2"
              >
                hello@easytradesetup.com
              </a>
              <p className="mt-4 text-caption text-muted">Response within 24 hours on business days.</p>
            </div>
            <div className="card-apple p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Before you write</div>
              <ul className="mt-5 space-y-3 text-caption text-muted">
                <li>— For install issues, check <a href="/docs/install" className="link-apple">docs/install</a> first.</li>
                <li>— For refund requests, include order ID and reason.</li>
                <li>— For bulk licensing (trading rooms, academies), mention team size.</li>
              </ul>
            </div>
          </div>

          <form action="/api/lead" method="POST" className="mt-6 card-apple p-10">
            <input type="hidden" name="source" value="contact" />
            {/* Honeypot — bots fill every field; real users never see this. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">Quick message</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-caption text-muted-faint">Name</span>
                <input
                  name="name"
                  required
                  className="bg-surface border border-rule rounded-lg px-4 py-3.5 md:py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-caption text-muted-faint">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="bg-surface border border-rule rounded-lg px-4 py-3.5 md:py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-2">
              <span className="text-caption text-muted-faint">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                className="bg-surface border border-rule rounded-lg px-4 py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors resize-none"
                placeholder="What would you like to ask?"
              />
            </label>
            <button
              type="submit"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
