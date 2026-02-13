import { api } from "@/lib/api"
import { ClientMenu } from "@/components/menu/ClientMenu"
import { Metadata } from "next"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getMenuData(slug: string) {
  try {
    const [menuData, siteData] = await Promise.all([
      api.get(`/menu/public-data/${slug}/`),
      api.get(`/sites/site/public/${slug}/`)
    ])
    return { 
      categories: menuData.categories, 
      products: menuData.products,
      activePlugins: siteData.active_plugins || []
    }
  } catch (error) {
    console.error("Failed to fetch menu or site data:", error)
    return { categories: [], products: [], activePlugins: [] }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const site = await api.get(`/sites/site/public/${slug}/`)
    return {
      title: `منوی ${site.name} | ویترین ساز`,
      description: `مشاهده منوی آنلاین ${site.name}`,
    }
  } catch {
    return { title: "منو یافت نشد" }
  }
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params
  const { categories, products, activePlugins } = await getMenuData(slug)

  return (
    <ClientMenu 
      slug={slug} 
      categories={categories} 
      products={products} 
      activePlugins={activePlugins}
    />
  )
}
