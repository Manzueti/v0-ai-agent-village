import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import FaroInitializer from '@/components/infrastructure/FaroInitializer'

export const metadata: Metadata = {
  title: 'CyberEmpire // Autonomous workforce',
  description: 'Enterprise infrastructure managed by autonomous AI operators.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        <FaroInitializer />
        <div className="flex h-screen w-full overflow-hidden">
          <Suspense fallback={<div className="w-20 h-screen bg-[hsl(var(--sidebar-background)/0.95)] flex-shrink-0" />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-auto relative scrollbar-hide bg-background">
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
