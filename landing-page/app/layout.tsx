import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'EasyTradeSetup — Golden Indicator for TradingView | NSE F&O',
  description:
    'The Golden Indicator — proprietary TradingView Pine Script for Nifty, BankNifty & global markets. Clear BUY/SELL signals, trade logic PDF, daily market updates. ₹2,499 one-time.',
  keywords: [
    'Nifty intraday strategy',
    'BankNifty trading system',
    'TradingView Pine Script India',
    'NSE F&O strategy',
    'Golden Indicator TradingView',
    'intraday trading system India',
    'Nifty 50 trading strategy',
    'F&O trading system',
    'NSE trading system buy sell signal',
    'TradingView indicator Nifty BankNifty',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'EasyTradeSetup — Golden Indicator for TradingView',
    description: 'Proprietary Pine Script for Nifty & global markets. Clear BUY/SELL signals. ₹2,499 one-time payment.',
    url: 'https://www.easytradesetup.com',
    siteName: 'EasyTradeSetup',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasyTradeSetup — Golden Indicator for TradingView',
    description: 'Proprietary Pine Script for Nifty & global markets. ₹2,499 one-time.',
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
      name: 'Golden Indicator Pack',
      description:
        'Proprietary TradingView Pine Script v5 for Nifty, BankNifty & global markets. Includes indicator script, trade logic PDF, risk calculator, and daily market updates.',
      brand: { '@type': 'Brand', name: 'EasyTradeSetup' },
      offers: [
        {
          '@type': 'Offer',
          name: 'Golden Indicator Pack',
          price: '2499',
          priceCurrency: 'INR',
          availability: 'https://schema.org/PreOrder',
          url: 'https://www.easytradesetup.com/#pricing',
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${mono.variable}`}>
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
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#ECECEC',
              borderRadius: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
