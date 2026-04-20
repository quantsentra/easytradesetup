import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EasyTradeSetup — Nifty & BankNifty Intraday Trading System',
  description:
    'Proven 3-confirmation intraday system for Nifty & BankNifty. TradingView Pine Script + Strategy PDF. Starting at ₹999. Clear BUY/SELL signals, no guesswork.',
  keywords: [
    'Nifty intraday strategy',
    'BankNifty trading system',
    'BankNifty buy sell signal',
    'TradingView Pine Script India',
    'NSE F&O strategy',
    'Nifty options trading setup',
    'intraday trading system India',
    'TradingView indicator India',
    'pine script indicator NSE',
    'BankNifty intraday strategy',
    'Nifty 50 trading strategy',
    'F&O trading system',
    'Nifty trading strategy Hindi',
    'intraday trading India Hindi',
    'NSE trading system buy sell signal',
    'TradingView indicator Nifty BankNifty',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'EasyTradeSetup — Nifty & BankNifty Intraday System | From ₹999',
    description: '3-confirmation system. Clear BUY/SELL signals on TradingView. Proven setup for Nifty & BankNifty.',
    url: 'https://www.easytradesetup.com',
    siteName: 'EasyTradeSetup',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasyTradeSetup — Nifty & BankNifty Intraday System',
    description: '3-confirmation system. Clear BUY/SELL signals on TradingView. Starting at ₹999.',
  },
  alternates: {
    canonical: 'https://www.easytradesetup.com',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'EasyTradeSetup',
      url: 'https://easytradesetup.com',
    },
    {
      '@type': 'Product',
      name: 'ETS Intraday Momentum Pack',
      description:
        'A 3-confirmation intraday trading system for Nifty & BankNifty. Includes TradingView Pine Script, Strategy PDF, and Quick-Start Checklist.',
      brand: { '@type': 'Brand', name: 'EasyTradeSetup' },
      offers: [
        {
          '@type': 'Offer',
          name: 'Basic',
          price: '999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://quantsentra.gumroad.com/l/ets-basic',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '1999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://quantsentra.gumroad.com/l/ets-pro',
        },
        {
          '@type': 'Offer',
          name: 'Expert',
          price: '3999',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://quantsentra.gumroad.com/l/ets-expert',
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#161B22',
              border: '1px solid #30363D',
              color: '#E6EDF3',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
