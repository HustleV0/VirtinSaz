"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSiteStore } from "@/lib/store/use-site-store"
import { useToast } from "./use-toast"

export function useRequirePlugin(pluginKey: string) {
  const { isPluginActive, isLoading, site } = useSiteStore()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && site && !isPluginActive(pluginKey)) {
      toast({
        title: "دسترسی محدود",
        description: `برای دسترسی به این بخش باید پلاگین ${pluginKey} را فعال کنید.`,
        variant: "destructive"
      })
      router.push("/dashboard")
    }
  }, [pluginKey, isPluginActive, isLoading, site, router, toast])

  return { isLoading: isLoading || !site }
}
