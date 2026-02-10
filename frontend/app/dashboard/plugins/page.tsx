"use client"

import React, { useEffect, useState } from "react"
import { useSiteStore } from "@/lib/store/use-site-store"
import { api } from "@/lib/api"
import { Plugin } from "@/types"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Puzzle, CheckCircle2, ShieldCheck } from "lucide-react"

export default function PluginsPage() {
  const [allPlugins, setAllPlugins] = useState<Plugin[]>([])
  const { site, activePlugins, togglePlugin, isLoading: isStoreLoading } = useSiteStore()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const data = await api.get('/sites/plugins/')
        setAllPlugins(data)
      } catch (error) {
        console.error("Failed to fetch all plugins", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlugins()
  }, [])

  const handleToggle = async (pluginKey: string, currentStatus: boolean) => {
    try {
      await togglePlugin(pluginKey, !currentStatus)
      toast({
        title: !currentStatus ? "پلاگین فعال شد" : "پلاگین غیرفعال شد",
        description: `پلاگین با موفقیت تغییر وضعیت داد.`,
      })
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در تغییر وضعیت پلاگین پیش آمد.",
        variant: "destructive"
      })
    }
  }

  if (loading || isStoreLoading) {
    return <div className="flex h-full items-center justify-center">در حال بارگذاری پلاگین‌ها...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">مدیریت پلاگین‌ها</h1>
        <p className="text-muted-foreground">
          قابلیت‌های جدید را به وبسایت خود اضافه یا حذف کنید.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allPlugins.map((plugin) => {
          const isActive = activePlugins.includes(plugin.key)
          // Required plugins by theme cannot be disabled manually
          const isRequiredByTheme = site?.required_plugins?.includes(plugin.key)

          return (
            <Card key={plugin.key} className={isActive ? "border-primary/50 bg-primary/5" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-background rounded-lg border">
                    <Puzzle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    {plugin.is_core && (
                      <Badge variant="secondary" className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Core
                      </Badge>
                    )}
                    {isActive && (
                      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        فعال
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4">{plugin.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {plugin.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRequiredByTheme && (
                  <p className="text-xs text-muted-foreground italic">
                    * این پلاگین توسط قالب فعلی شما الزامی است و غیرفعال نمی‌شود.
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <span className="text-sm font-medium">
                  {isActive ? "فعال" : "غیرفعال"}
                </span>
                <Switch 
                  checked={isActive}
                  onCheckedChange={() => handleToggle(plugin.key, isActive)}
                  disabled={isRequiredByTheme}
                />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
