import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'FinGuard AI - Financial Wellness Dashboard',
  description: 'Comprehensive financial wellness dashboard with AI-powered insights',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  )
}
