import Nav            from '@/components/Nav'
import Hero           from '@/components/sections/Hero'
import Pain           from '@/components/sections/Pain'
import Strategy       from '@/components/sections/Strategy'
import Includes       from '@/components/sections/Includes'
import Pricing        from '@/components/sections/Pricing'
import FAQ            from '@/components/sections/FAQ'
import FooterSection  from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <Hero />
      <Pain />
      <Strategy />
      <Includes />
      <Pricing />
      <FAQ />
      <FooterSection />
    </main>
  )
}
