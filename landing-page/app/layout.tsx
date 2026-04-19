import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EasyTradeSetup — Nifty & BankNifty Intraday System',
  description:
    'Trade Nifty & BankNifty with a proven 3-indicator system. TradingView Pine Script + Strategy PDF. Clear signals. No guesswork.',
  keywords: ['Nifty intraday strategy', 'BankNifty trading system', 'TradingView Pine Script India', 'NSE F&O strategy'],
  openGraph: {
    title: 'EasyTradeSetup — Nifty & BankNifty Intraday System',
    description: 'Trade with 3 confirmations. Clear BUY/SELL signals on TradingView.',
    url: 'https://easytradesetup.com',
    siteName: 'EasyTradeSetup',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
