import TopNav from "@/components/nav/TopNav";
import MarketsMarquee from "@/components/sections/MarketsMarquee";
import Footer from "@/components/nav/Footer";
import OfferBanner from "@/components/ui/OfferBanner";
import StickyBuyBar from "@/components/ui/StickyBuyBar";
import ExitIntent from "@/components/ui/ExitIntent";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <OfferBanner />
      <TopNav />
      <MarketsMarquee />
      <main id="main" className="above-bg">{children}</main>
      <Footer />
      <StickyBuyBar />
      <ExitIntent />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
    </>
  );
}
