import TopNav from "@/components/nav/TopNav";
import MarketsMarquee from "@/components/sections/MarketsMarquee";
import Footer from "@/components/nav/Footer";
import SiteDisclaimer from "@/components/nav/SiteDisclaimer";
import OfferBanner from "@/components/ui/OfferBanner";
import StickyBuyBar from "@/components/ui/StickyBuyBar";
import ExitIntent from "@/components/ui/ExitIntent";
import BackToTop from "@/components/ui/BackToTop";
import PageviewTracker from "@/components/analytics/PageviewTracker";
import { OrganizationJsonLd, WebSiteJsonLd, SiteNavigationJsonLd } from "@/components/seo/JsonLd";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <OfferBanner />
      <TopNav />
      <MarketsMarquee />
      <main id="main" className="above-bg">{children}</main>
      <Footer />
      <SiteDisclaimer />
      <StickyBuyBar />
      <ExitIntent />
      <BackToTop />
      <PageviewTracker />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SiteNavigationJsonLd />
    </>
  );
}
