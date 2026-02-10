"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MinimalCafeAbout } from "@/components/templates/MinimalCafeAbout"
import { ModernRestaurantAbout } from "@/components/templates/ModernRestaurantAbout"
import { TraditionalIranianAbout } from "@/components/templates/TraditionalIranianAbout"
import { MinimalCafeAboutSkeleton } from "@/components/templates/MinimalCafeAboutSkeleton"
import { ModernRestaurantAboutSkeleton } from "@/components/templates/ModernRestaurantAboutSkeleton"
import { TraditionalIranianAboutSkeleton } from "@/components/templates/TraditionalIranianAboutSkeleton"
import { api } from "@/lib/api"
import Loading from "@/app/loading"

export default function AboutPage() {
  const params = useParams()
  const siteId = params?.slug as string
  const [loadingStage, setLoadingStage] = useState<"initial" | "skeleton" | "ready">("initial")
  const [siteData, setSiteData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const site = await api.get(`/sites/site/public/${siteId}/`)
        setSiteData(site)
        setLoadingStage("skeleton")
      } catch (error) {
        console.error("Error fetching site data:", error)
        setLoadingStage("ready")
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
      }, 1000)
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
        return <MinimalCafeAboutSkeleton />
      case "modern-restaurant":
        return <ModernRestaurantAboutSkeleton />
      case "traditional-persian":
        return <TraditionalIranianAboutSkeleton />
      default:
        return <MinimalCafeAboutSkeleton />
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
