import Hero from "@/components/sections/Hero";
import Ticker from "@/components/ui/Ticker";
import Bundle from "@/components/sections/Bundle";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Ticker />
      <Hero />
      <Bundle />
      <HowItWorks />
      <Testimonials />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
