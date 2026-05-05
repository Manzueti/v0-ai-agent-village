import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

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
      <body className="antialiased font-mono selection:bg-[hsl(var(--neon-purple)/0.3)] selection:text-white">
        <div className="flex h-screen w-full overflow-hidden bg-background/40 backdrop-blur-[2px]">
          <Sidebar />
          <main className="flex-1 overflow-auto relative scrollbar-hide">
            <div className="absolute inset-0 starfield opacity-40 pointer-events-none" />
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
