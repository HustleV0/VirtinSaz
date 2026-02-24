import React from "react"
import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/hooks/use-auth"
import { SiteProvider } from "@/hooks/site-context"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | وفینو",
    default: "وفینو | سایت خود را در کمتر از 2 دقیقه بسازید",
  },
  description:
    "وفینو، سایت ساز سریع برای ساخت سایت فروشگاهی، سایت رستورانی و سایت کافه. بدون دانش فنی در کمتر از 2 دقیقه سایت خود را راه اندازی کنید.",
  generator: "Vofino",
  keywords: [
    "وفینو",
    "Vofino",
    "سایت خود را در کمتر از 2 دقیقه بسازید",
    "سایت فروشگاهی",
    "سایت رستورانی",
    "سایت کافه",
    "سایت ساز",
    "ساخت وبسایت",
    "طراحی سایت",
  ],
  authors: [{ name: "Vofino Team" }],
  creator: "Vofino",
  publisher: "Vofino",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "وفینو | سایت خود را در کمتر از 2 دقیقه بسازید",
    description: "با وفینو سایت فروشگاهی، سایت رستورانی و سایت کافه خود را سریع و حرفه ای بسازید.",
    url: "https://vofino.ir",
    siteName: "وفینو",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "وفینو | سایت خود را در کمتر از 2 دقیقه بسازید",
    description: "پلتفرم ساخت سایت فروشگاهی، سایت رستورانی و سایت کافه با راه اندازی سریع.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
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
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
