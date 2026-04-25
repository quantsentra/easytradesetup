import Hero from "@/components/sections/Hero";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import Solution from "@/components/sections/Solution";
import WhatItShows from "@/components/sections/WhatItShows";
import WhoFor from "@/components/sections/WhoFor";
import WhyDifferent from "@/components/sections/WhyDifferent";
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
      <CleanVsNoisy />
      <Solution />
      <WhatItShows />
      <WhoFor />
      <WhyDifferent />
      <Bundle />
      <MultiMarket />
      <TheLoop />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
