import Hero from "@/components/sections/Hero";
import Ticker from "@/components/ui/Ticker";
import ToolsBento from "@/components/sections/ToolsBento";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import PricingTeaser from "@/components/sections/PricingTeaser";
import FAQTeaser from "@/components/sections/FAQTeaser";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <ToolsBento />
      <HowItWorks />
      <Testimonials />
      <PricingTeaser />
      <FAQTeaser />
      <FinalCTA />
    </>
  );
}
