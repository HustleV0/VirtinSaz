import React from "react"
import type { Metadata, Viewport } from "next"
import { mockRestaurants } from "@/lib/mock-data"
import { ThemeProvider } from "@/components/theme-provider"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const response = await fetch(`http://localhost:8000/api/site/public/${slug}/`)
    if (response.ok) {
      const site = await response.json()
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
  } catch (error) {
    console.error("Metadata fetch error:", error)
  }

  const restaurant = mockRestaurants.find(r => r.slug === slug) || mockRestaurants[0]
  return {
    title: `${restaurant.name} | ویترین ساز`,
    description: restaurant.description,
  }
}

export async function generateViewport({ params }: { params: Promise<{ slug: string }> }): Promise<Viewport> {
  const { slug } = await params
  try {
    const response = await fetch(`http://localhost:8000/api/site/public/${slug}/`)
    if (response.ok) {
      const site = await response.json()
      return {
        themeColor: site.settings?.primaryColor || "#000000",
      }
    }
  } catch (error) {}

  const restaurant = mockRestaurants.find(r => r.slug === slug) || mockRestaurants[0]
  return {
    themeColor: restaurant.settings.primaryColor,
  }
}

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  await params // Ensure params are available if needed, though children might use them
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
