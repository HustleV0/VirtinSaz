import { MinimalCafeAbout } from "@/components/templates/MinimalCafeAbout"
import { ModernRestaurantAbout } from "@/components/templates/ModernRestaurantAbout"
import { TraditionalIranianAbout } from "@/components/templates/TraditionalIranianAbout"
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
  if (!site) return { title: "درباره ما" }
  return {
    title: `درباره ما | ${site.name}`,
    description: `درباره ${site.name} بیشتر بدانید`,
  }
}

export default async function AboutPage({ params }: PageProps) {
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
      our_story: siteData.settings?.our_story,
      working_hours_sat_wed: siteData.settings?.working_hours_sat_wed,
      working_hours_thu_fri: siteData.settings?.working_hours_thu_fri,
      address_line: siteData.settings?.address_line,
    }
  }

  switch (themeId) {
    case "minimal-cafe":
      return <MinimalCafeAbout restaurant={restaurantProps as any} />
    case "modern-restaurant":
      return <ModernRestaurantAbout restaurant={restaurantProps as any} />
    case "traditional-persian":
      return <TraditionalIranianAbout restaurant={restaurantProps as any} />
    default:
      return <MinimalCafeAbout restaurant={restaurantProps as any} />
  }
}
