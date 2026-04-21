'use client'
import { useState } from 'react'

const faqs = [
  { q: 'Do I need a paid TradingView account?', a: 'No. The Pine Script works on the free TradingView plan. You can add it to one chart without upgrading.' },
  { q: 'Will this work on stocks too?', a: "Optimised for Nifty & BankNifty index instruments. May work on liquid large-caps, but we recommend index-only for best results with this system." },
  { q: "I'm a complete beginner. Is this for me?", a: 'Yes. The PDF guide explains every indicator from scratch. If you can read a candlestick chart, you can follow this system.' },
  { q: 'How do I get the files after buying?', a: 'You receive an email instantly after payment with your download link. No waiting, no manual delivery.' },
  { q: 'Can I use this on the 5-minute chart?', a: 'Yes. The script works on any timeframe. We recommend 15-min for beginners — fewer false signals and less screen time required.' },
  { q: 'Is this for Options trading or Futures?', a: 'The signal generates on the Nifty/BankNifty index chart — usable for both Futures or ATM Options. The PDF includes guidance for both.' },
  { q: 'What is your refund policy?', a: "We don't offer refunds on digital products. Please read the description carefully before purchasing. Questions before buying? Email support@easytradesetup.com." },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left text-ink text-[14px] font-medium hover:text-ink transition-colors duration-150 gap-4"
      >
        <span>{q}</span>
        <span className={`text-ink-muted transition-transform duration-200 text-[20px] leading-none flex-shrink-0 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-250 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-[14px] text-ink-muted leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-32 border-t border-line bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="label">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-[40px] font-black tracking-[-0.03em] text-ink mb-12">Questions? Answered.</h2>
          <div className="bg-white border border-line rounded-2xl px-6 shadow-card divide-y divide-line">
            {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
