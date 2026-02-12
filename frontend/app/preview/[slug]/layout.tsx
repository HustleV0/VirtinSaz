import React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { api } from "@/lib/api"

async function getSiteData(slug: string) {
  try {
    return await api.get(`/sites/site/public/${slug}/`)
  } catch (error) {
    console.error("Layout metadata fetch error:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const site = await getSiteData(slug)
  
  if (!site) {
    return {
      title: "ویترین ساز",
    }
  }

  const logoUrl = site.logo 
    ? (site.logo.startsWith('http') ? site.logo : `http://localhost:8000${site.logo}`)
    : "/favicon.ico"
    
  return {
    title: `${site.name} | ویترین ساز`,
    description: site.settings?.description || "",
    icons: {
      icon: logoUrl,
    },
  }
}

export async function generateViewport({ params }: { params: Promise<{ slug: string }> }): Promise<Viewport> {
  const { slug } = await params
  const site = await getSiteData(slug)
  
  return {
    themeColor: site?.settings?.primaryColor || "#000000",
  }
}

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
