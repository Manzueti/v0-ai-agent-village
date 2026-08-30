import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import FaroInitializer from '@/components/infrastructure/FaroInitializer'

export const metadata: Metadata = {
  title: 'CyberEmpire // Autonomous AI Company',
  description: 'A human-governed company operated by coordinated AI agents across strategy, growth, finance, product, engineering, and operations.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-mono selection:bg-[hsl(var(--neon-purple)/0.3)] selection:text-white">
        <FaroInitializer />
        <div className="flex h-screen w-full overflow-hidden">
          <Suspense fallback={<div className="w-20 h-screen bg-[hsl(var(--sidebar-background)/0.95)] flex-shrink-0" />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-auto relative scrollbar-hide">
            {/* Dungeon map background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/dungeon-map.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "local",
              }}
            />
            {/* Dark overlay keeps text readable */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(2,2,12,0.72)" }} />
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
