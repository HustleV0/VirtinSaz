import React from "react"
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/hooks/use-auth'
import { SiteProvider } from '@/hooks/site-context'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'ویترین ساز | ساخت وبسایت رستوران و کافه',
  description: 'پلتفرم ساخت وبسایت برای رستوران‌ها و کافه‌ها. به سادگی وبسایت خود را بسازید و مدیریت کنید.',
  generator: 'v0.app',
  keywords: ['رستوران', 'کافه', 'منو آنلاین', 'وبسایت رستوران', 'ساخت وبسایت'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SiteProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </SiteProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
