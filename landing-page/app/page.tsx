import dynamic          from 'next/dynamic'
import Nav            from '@/components/Nav'
import Hero           from '@/components/sections/Hero'
import TrustBar       from '@/components/sections/TrustBar'
import Pain           from '@/components/sections/Pain'
import HowItWorks     from '@/components/sections/HowItWorks'
import Strategy       from '@/components/sections/Strategy'
import ChartDemo      from '@/components/sections/ChartDemo'
import VideoShowcase  from '@/components/sections/VideoShowcase'
import Includes       from '@/components/sections/Includes'
import MarketUpdates  from '@/components/sections/MarketUpdates'
import Testimonials   from '@/components/sections/Testimonials'
import Pricing        from '@/components/sections/Pricing'
import FAQ            from '@/components/sections/FAQ'
import LeadCapture    from '@/components/sections/LeadCapture'
import FooterSection  from '@/components/sections/FooterSection'
import StickyMobileCTA from '@/components/StickyMobileCTA'

const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <CommandPalette />
      <Nav />
      <Hero />
      <TrustBar />
      <Pain />
      <HowItWorks />
      <Strategy />
      <ChartDemo />
      <VideoShowcase />
      <Includes />
      <MarketUpdates />
      <Testimonials />
      <Pricing />
      <FAQ />
      <LeadCapture />
      <FooterSection />
      <StickyMobileCTA />
    </main>
  )
}
