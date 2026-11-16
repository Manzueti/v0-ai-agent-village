import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
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
          <main className="flex-1 overflow-auto relative scrollbar-hide">
            {/* Futurist backdrop: aurora glows + masked grid (decorative) */}
            <div aria-hidden className="app-backdrop pointer-events-none fixed inset-0 left-20">
              <div className="aurora aurora-a" />
              <div className="aurora aurora-b" />
              <div className="aurora aurora-c" />
              <div className="backdrop-grid" />
              <div className="backdrop-noise" />
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
        {/* Vercel Analytics only exists on Vercel deployments; elsewhere its script 404s. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
