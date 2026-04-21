import Hero from "@/components/sections/Hero";
import WhoFor from "@/components/sections/WhoFor";
import CleanVsNoisy from "@/components/sections/CleanVsNoisy";
import Bundle from "@/components/sections/Bundle";
import HowItWorks from "@/components/sections/HowItWorks";
import Principles from "@/components/sections/Principles";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhoFor />
      <CleanVsNoisy />
      <Bundle />
      <HowItWorks />
      <Principles />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
