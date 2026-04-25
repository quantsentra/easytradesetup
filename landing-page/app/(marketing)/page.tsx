import Hero from "@/components/sections/Hero";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import Bundle from "@/components/sections/Bundle";
import MultiMarket from "@/components/sections/MultiMarket";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <ProductJsonLd />
      <Hero />
      <CleanVsNoisy />
      <Bundle />
      <MultiMarket />
      <FAQTeaser />
      <PricingTeaser />
      <FinalCTA />
    </>
  );
}
