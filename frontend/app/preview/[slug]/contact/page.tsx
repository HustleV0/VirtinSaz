import { MinimalCafeContact } from "@/components/templates/MinimalCafeContact"
import { ModernRestaurantContact } from "@/components/templates/ModernRestaurantContact"
import { TraditionalIranianContact } from "@/components/templates/TraditionalIranianContact"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSiteData(slug: string) {
  try {
    return await api.get(`/sites/site/public/${slug}/`)
  } catch (error) {
    console.error("Error fetching site data:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const site = await getSiteData(slug)
  if (!site) return { title: "تماس با ما" }
  return {
    title: `تماس با ما | ${site.name}`,
    description: `پل‌های ارتباطی با ${site.name}`,
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { slug } = await params
  const siteData = await getSiteData(slug)

  if (!siteData) {
    notFound()
  }

  const themeId = siteData.source_identifier || "minimal-cafe"

  const restaurantProps = {
    id: siteData.id,
    name: siteData.name,
    slug: siteData.slug || siteData.id.toString(),
    description: siteData.settings?.description,
    logo: siteData.logo,
    coverImage: siteData.cover_image,
    phone: siteData.settings?.phone,
    address: siteData.settings?.address,
    email: siteData.settings?.email,
    socialLinks: {
      instagram: siteData.settings?.instagram,
      telegram: siteData.settings?.telegram,
      whatsapp: siteData.settings?.whatsapp,
    },
    settings: {
      themeId: themeId,
      primaryColor: siteData.settings?.primaryColor || "#000000",
      showPrices: siteData.settings?.showPrices ?? true,
      address_line: siteData.settings?.address_line,
    }
  }

  switch (themeId) {
    case "minimal-cafe":
      return <MinimalCafeContact restaurant={restaurantProps as any} />
    case "modern-restaurant":
      return <ModernRestaurantContact restaurant={restaurantProps as any} />
    case "traditional-persian":
      return <TraditionalIranianContact restaurant={restaurantProps as any} />
    default:
      return <MinimalCafeContact restaurant={restaurantProps as any} />
  }
}
