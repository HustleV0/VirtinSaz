"use client"

import React, { useEffect, useState, useMemo } from "react"
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
import { Puzzle, CheckCircle2, ShieldCheck, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PluginsPage() {
  const [allPlugins, setAllPlugins] = useState<Plugin[]>([])
  const { site, activePlugins, togglePlugin, isLoading: isStoreLoading } = useSiteStore()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredPlugins = useMemo(() => {
    return allPlugins.filter(plugin => 
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [allPlugins, searchQuery])

  const activeFilteredPlugins = useMemo(() => {
    return filteredPlugins.filter(plugin => activePlugins.includes(plugin.key))
  }, [filteredPlugins, activePlugins])

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

  const PluginGrid = ({ plugins }: { plugins: Plugin[] }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plugins.map((plugin) => {
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
                      سیستمی
                    </Badge>
                  )}
                  {isActive && (
                    <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      فعال
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="mt-4">{plugin.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {plugin.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRequiredByTheme && (
                <p className="text-xs text-muted-foreground italic">
                  * این پلاگین توسط قالب فعلی شما الزامی است.
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
      {plugins.length === 0 && (
        <div className="col-span-full py-12 text-center text-muted-foreground">
          پلاگینی یافت نشد.
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت پلاگین‌ها</h1>
          <p className="text-muted-foreground">
            قابلیت‌های جدید را به وبسایت خود اضافه یا حذف کنید.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="جستجوی پلاگین..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" dir="rtl">
        <TabsList className="mb-4">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="active">پلاگین‌های فعال</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PluginGrid plugins={filteredPlugins} />
        </TabsContent>
        <TabsContent value="active">
          <PluginGrid plugins={activeFilteredPlugins} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
