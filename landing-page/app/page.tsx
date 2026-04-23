import Hero from "@/components/sections/Hero";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import WhoFor from "@/components/sections/WhoFor";
import Bundle from "@/components/sections/Bundle";
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
      <WhoFor />
      <Bundle />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
