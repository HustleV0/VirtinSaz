"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { MinimalCafe } from "@/components/templates/MinimalCafe"
import { TraditionalIranian } from "@/components/templates/TraditionalIranian"
import { ModernRestaurant } from "@/components/templates/ModernRestaurant"
import { MinimalCafeSkeleton } from "@/components/templates/MinimalCafeSkeleton"
import { ModernRestaurantSkeleton } from "@/components/templates/ModernRestaurantSkeleton"
import { TraditionalIranianSkeleton } from "@/components/templates/TraditionalIranianSkeleton"
import Loading from "@/app/loading"
import { api } from "@/lib/api"

export default function PreviewPage() {
  const params = useParams()
  const siteId = params?.slug as string
  const [loadingStage, setLoadingStage] = useState<"initial" | "skeleton" | "ready">("initial")
  const [siteData, setSiteData] = useState<any>(null)
  const [menuData, setMenuData] = useState<{categories: any[], products: any[]}>({categories: [], products: []})
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [site, menu] = await Promise.all([
          api.get(`/site/public/${siteId}/`),
          api.get(`/menu/public-data/${siteId}/`)
        ])
        setSiteData(site)
        setMenuData(menu)
        setLoadingStage("skeleton")
      } catch (error) {
        console.error("Error fetching site data:", error)
        setLoadingStage("ready") // Show fallback or error
      }
    }
    
    if (siteId) {
      fetchData()
    }
  }, [siteId])

  useEffect(() => {
    if (loadingStage === "skeleton") {
      const timer = setTimeout(() => {
        setLoadingStage("ready")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [loadingStage])

  if (loadingStage === "initial") {
    return <Loading />
  }

  if (!siteData) {
    return <div className="flex h-screen items-center justify-center">سایت مورد نظر یافت نشد.</div>
  }

  const themeId = siteData.source_identifier || "minimal-cafe"

  if (loadingStage === "skeleton") {
    switch (themeId) {
      case "minimal-cafe":
        return <MinimalCafeSkeleton />
      case "traditional-persian":
        return <TraditionalIranianSkeleton />
      case "modern-restaurant":
        return <ModernRestaurantSkeleton />
      default:
        return <MinimalCafeSkeleton />
    }
  }

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
    }
  }

  console.log("Rendering site with theme:", themeId);

  switch (themeId) {
    case "minimal-cafe":
      return <MinimalCafe restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
    case "traditional-persian":
      return <TraditionalIranian restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
    case "modern-restaurant":
      return <ModernRestaurant restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
    default:
      return <MinimalCafe restaurant={restaurantProps as any} categories={menuData.categories} products={menuData.products} />
  }
}
