import Hero from "@/components/sections/Hero";
import WhoFor from "@/components/sections/WhoFor";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import VideoDemo from "@/components/sections/VideoDemo";
import Bundle from "@/components/sections/Bundle";
import HowItWorks from "@/components/sections/HowItWorks";
import Principles from "@/components/sections/Principles";
import Insights from "@/components/sections/Insights";
import FounderNote from "@/components/sections/FounderNote";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <>
      <ProductJsonLd />
      <Hero />
      <WhoFor />
      <CleanVsNoisy />
      <VideoDemo />
      <Bundle />
      <HowItWorks />
      <Insights />
      <Principles />
      <FounderNote />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
