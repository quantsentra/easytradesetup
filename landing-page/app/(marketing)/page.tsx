import Hero from "@/components/sections/Hero";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import Bundle from "@/components/sections/Bundle";
import MultiMarket from "@/components/sections/MultiMarket";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser, { homeFaqs } from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";
import {
  ProductJsonLd,
  SoftwareApplicationJsonLd,
  FAQPageJsonLd,
} from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <ProductJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd
        faqs={homeFaqs.map(([q, a]) => ({ q, a }))}
      />
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
