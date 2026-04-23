import Hero from "@/components/sections/Hero";
import MarketsMarquee from "@/components/sections/MarketsMarquee";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import WhoFor from "@/components/sections/WhoFor";
import Bundle from "@/components/sections/Bundle";
import MultiMarket from "@/components/sections/MultiMarket";
import TheLoop from "@/components/sections/TheLoop";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <ProductJsonLd />
      <Hero />
      <MarketsMarquee />
      <CleanVsNoisy />
      <WhoFor />
      <Bundle />
      <MultiMarket />
      <TheLoop />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
