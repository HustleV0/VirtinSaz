"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { mockRestaurants } from "@/lib/mock-data"
import { MinimalCafeAbout } from "@/components/templates/MinimalCafeAbout"
import { ModernRestaurantAbout } from "@/components/templates/ModernRestaurantAbout"
import { TraditionalIranianAbout } from "@/components/templates/TraditionalIranianAbout"
import { MinimalCafeAboutSkeleton } from "@/components/templates/MinimalCafeAboutSkeleton"
import { ModernRestaurantAboutSkeleton } from "@/components/templates/ModernRestaurantAboutSkeleton"
import { TraditionalIranianAboutSkeleton } from "@/components/templates/TraditionalIranianAboutSkeleton"

export default function AboutPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [loading, setLoading] = useState(true)
  const restaurant = mockRestaurants.find(r => r.slug === slug) || mockRestaurants[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const themeId = restaurant.settings.themeId

  if (loading) {
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

  switch (themeId) {
    case "minimal-cafe":
      return <MinimalCafeAbout restaurant={restaurant} />
    case "modern-restaurant":
      return <ModernRestaurantAbout restaurant={restaurant} />
    case "traditional-persian":
      return <TraditionalIranianAbout restaurant={restaurant} />
    default:
      return <MinimalCafeAbout restaurant={restaurant} />
  }
}
