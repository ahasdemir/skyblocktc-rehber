import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkyBlockTC Rehber Paneli',
  description: 'Skyblocktc için rehber kullanımına açılmış yardımcı paneli.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gray-100`}>
        <main className="w-full min-h-screen p-0 m-0 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
} 