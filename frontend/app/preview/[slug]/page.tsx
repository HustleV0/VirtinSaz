import { Metadata } from "next"
import { MinimalCafe } from "@/components/templates/MinimalCafe"
import { TraditionalIranian } from "@/components/templates/TraditionalIranian"
import { ModernRestaurant } from "@/components/templates/ModernRestaurant"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSiteData(slug: string) {
  try {
    const [site, menu] = await Promise.all([
      api.get(`/sites/site/public/${slug}/`),
      api.get(`/menu/public-data/${slug}/`)
    ])
    return { site, menu }
  } catch (error) {
    console.error("Error fetching site data:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getSiteData(slug)
  
  if (!data || !data.site) {
    return {
      title: "سایت یافت نشد",
    }
  }

  const { site } = data
  const title = site.meta_title || `${site.name} | ${site.category_name || "ویترین ساز"}`
  const description = site.meta_description || site.settings?.description || `مشاهده منو و اطلاعات ${site.name}`

  const schema = {
    "@context": "https://schema.org",
    "@type": site.schema_type || "Restaurant",
    "name": site.name,
    "description": description,
    "url": `https://vofino.ir/preview/${slug}`,
    "logo": site.logo,
    "image": site.cover_image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": site.settings?.address_line,
    },
    "telephone": site.settings?.phone,
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: site.logo ? [site.logo] : [],
    },
    other: {
      "structured-data": JSON.stringify(schema),
    },
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getSiteData(slug)

  if (!data || !data.site) {
    notFound()
  }

  const { site: siteData, menu: menuData } = data
  const themeId = siteData.source_identifier || "minimal-cafe"

  const restaurantProps = {
    id: siteData.id,
    name: siteData.name,
    slug: siteData.slug || siteData.id.toString(),
    description: siteData.settings?.description,
    logo: siteData.logo,
    coverImage: siteData.cover_image,
    phone: siteData.settings?.phone,
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
    },
    activePlugins: siteData.active_plugins || []
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": siteData.schema_type || "Restaurant",
    "name": siteData.name,
    "description": siteData.meta_description || siteData.settings?.description,
    "url": `https://vofino.ir/preview/${slug}`,
    "logo": siteData.logo,
    "image": siteData.cover_image,
  }

  let ThemeComponent;
  switch (themeId) {
    case "minimal-cafe":
      ThemeComponent = <MinimalCafe restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
      break;
    case "traditional-persian":
      ThemeComponent = <TraditionalIranian restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
      break;
    case "modern-restaurant":
      ThemeComponent = <ModernRestaurant restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
      break;
    default:
      ThemeComponent = <MinimalCafe restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {ThemeComponent}
    </>
  )
}
