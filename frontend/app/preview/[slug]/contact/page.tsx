"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { mockRestaurants } from "@/lib/mock-data"
import { MinimalCafeContact } from "@/components/templates/MinimalCafeContact"
import { ModernRestaurantContact } from "@/components/templates/ModernRestaurantContact"
import { TraditionalIranianContact } from "@/components/templates/TraditionalIranianContact"
import { MinimalCafeContactSkeleton } from "@/components/templates/MinimalCafeContactSkeleton"
import { ModernRestaurantContactSkeleton } from "@/components/templates/ModernRestaurantContactSkeleton"
import { TraditionalIranianContactSkeleton } from "@/components/templates/TraditionalIranianContactSkeleton"

export default function ContactPage() {
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
        return <MinimalCafeContactSkeleton />
      case "modern-restaurant":
        return <ModernRestaurantContactSkeleton />
      case "traditional-persian":
        return <TraditionalIranianContactSkeleton />
      default:
        return <MinimalCafeContactSkeleton />
    }
  }

  switch (themeId) {
    case "minimal-cafe":
      return <MinimalCafeContact restaurant={restaurant} />
    case "modern-restaurant":
      return <ModernRestaurantContact restaurant={restaurant} />
    case "traditional-persian":
      return <TraditionalIranianContact restaurant={restaurant} />
    default:
      return <MinimalCafeContact restaurant={restaurant} />
  }
}
