import React from "react"
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/hooks/use-auth'
import { SiteProvider } from '@/hooks/site-context'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | ویترین ساز',
    default: 'ویترین ساز | ساخت وبسایت سریع، مدرن و حرفه‌ای',
  },
  description: 'پلتفرم پیشرفته ساخت وبسایت برای تمامی کسب‌وکارها. بدون نیاز به دانش فنی، سایت حرفه‌ای خود را با تم‌های آماده و شخصی‌سازی شده در کمتر از ۵ دقیقه راه اندازی کنید.',
  generator: 'VirtinSaz',
  keywords: [
    'ساخت وبسایت', 
    'سایت ساز', 
    'طراحی سایت', 
    'ساخت سایت سریع', 
    'وبسایت شرکتی', 
    'وبسایت شخصی', 
    'فروشگاه آنلاین',
    'دیجیتال مارکتینگ',
    'ویترین ساز'
  ],
  authors: [{ name: 'VirtinSaz Team' }],
  creator: 'VirtinSaz',
  publisher: 'VirtinSaz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ویترین ساز | ساخت وبسایت سریع و مدرن',
    description: 'پلتفرم ساخت وبسایت حرفه‌ای برای انواع کسب‌وکارها و اشخاص',
    url: 'https://vofino.ir',
    siteName: 'ویترین ساز',
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ویترین ساز | ساخت وبسایت سریع و مدرن',
    description: 'پلتفرم ساخت وبسایت حرفه‌ای برای انواع کسب‌وکارها و اشخاص',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" 
          crossOrigin="anonymous"
        />
      </head>
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
