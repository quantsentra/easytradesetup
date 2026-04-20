'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'Do I need a paid TradingView account?',
    a: 'No. The Pine Script works on the free TradingView plan. You can add it to one chart without upgrading.',
  },
  {
    q: 'Will this work on stocks too?',
    a: "It's optimised for Nifty & BankNifty index instruments. It may work on liquid large-cap stocks, but we recommend index-only for the best results with this system.",
  },
  {
    q: "I'm a complete beginner. Is this for me?",
    a: 'Yes. The PDF guide explains every indicator from scratch. If you can read a candlestick chart, you can follow this system.',
  },
  {
    q: 'How do I get the files after buying?',
    a: 'You receive an email instantly after payment with your download link. No waiting, no manual delivery.',
  },
  {
    q: 'Can I use this on the 5-minute chart?',
    a: 'Yes. The script works on any timeframe. We recommend 15-min for beginners — fewer false signals and less screen time required.',
  },
  {
    q: 'Is the strategy guide available in regional languages?',
    a: 'The Strategy PDF is in English, but the rules are simple and clearly numbered. Any trader, regardless of language background, can follow this system.',
  },
  {
    q: 'Is this for Options trading or Futures?',
    a: 'The signal generates on the Nifty/BankNifty index chart — you can use it for both Futures or ATM Options. The PDF includes guidance for both.',
  },
  {
    q: 'What is your refund policy?',
    a: "We don't offer refunds on digital products. Please read the strategy description carefully before purchasing. If you have questions before buying, email support@easytradesetup.com.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left text-ink font-medium text-sm hover:text-accent-blue transition-colors duration-200"
      >
        <span>{q}</span>
        <span className={`text-ink-muted transition-transform duration-200 text-lg flex-shrink-0 ml-4 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-ink-muted text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-14 sm:py-24 border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Questions? Answered.</h2>
        </div>

        <div className="bg-bg-surface border border-border rounded-card divide-y divide-border px-6">
          {faqs.map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  )
}
