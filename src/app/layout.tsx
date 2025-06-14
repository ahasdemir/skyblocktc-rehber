import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkyBlockTC Rehber Paneli',
  description: 'SkyBlockTC sunucusu için yönetim paneli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}