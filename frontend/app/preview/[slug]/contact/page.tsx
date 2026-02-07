"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MinimalCafeContact } from "@/components/templates/MinimalCafeContact"
import { ModernRestaurantContact } from "@/components/templates/ModernRestaurantContact"
import { TraditionalIranianContact } from "@/components/templates/TraditionalIranianContact"
import { MinimalCafeContactSkeleton } from "@/components/templates/MinimalCafeContactSkeleton"
import { ModernRestaurantContactSkeleton } from "@/components/templates/ModernRestaurantContactSkeleton"
import { TraditionalIranianContactSkeleton } from "@/components/templates/TraditionalIranianContactSkeleton"
import { api } from "@/lib/api"
import Loading from "@/app/loading"

export default function ContactPage() {
  const params = useParams()
  const siteId = params?.slug as string
  const [loadingStage, setLoadingStage] = useState<"initial" | "skeleton" | "ready">("initial")
  const [siteData, setSiteData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const site = await api.get(`/site/public/${siteId}/`)
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
        return <MinimalCafeContactSkeleton />
      case "modern-restaurant":
        return <ModernRestaurantContactSkeleton />
      case "traditional-persian":
        return <TraditionalIranianContactSkeleton />
      default:
        return <MinimalCafeContactSkeleton />
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
