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
import { 
  Puzzle, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  X, 
  Settings2, 
  QrCode, 
  FileText, 
  Wallet,
  ShoppingBag,
  Bell,
  CreditCard,
  MessageSquare
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Empty, 
  EmptyHeader, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyMedia 
} from "@/components/ui/empty"
import { motion, AnimatePresence } from "framer-motion"

// Map plugin keys to specific icons for better UX
const getPluginIcon = (key: string) => {
  const iconProps = { className: "h-5 w-5 text-primary" }
  switch (key) {
    case 'qr_code':
    case 'qr-code':
      return <QrCode {...iconProps} />
    case 'blog':
      return <FileText {...iconProps} />
    case 'wallet':
      return <Wallet {...iconProps} />
    case 'ordering':
    case 'shop':
      return <ShoppingBag {...iconProps} />
    case 'notification':
      return <Bell {...iconProps} />
    case 'payment':
      return <CreditCard {...iconProps} />
    case 'comment':
    case 'support':
      return <MessageSquare {...iconProps} />
    default:
      return <Puzzle {...iconProps} />
  }
}

const PluginSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-32 mt-4" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </CardHeader>
        <CardFooter className="pt-0 flex justify-between items-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

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

  const PluginGrid = ({ plugins }: { plugins: Plugin[] }) => (
    <motion.div 
      layout
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {plugins.map((plugin) => {
          const isActive = activePlugins.includes(plugin.key)
          const isRequiredByTheme = site?.required_plugins?.includes(plugin.key)

          return (
            <motion.div
              key={plugin.key}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`group h-full transition-all duration-300 hover:shadow-md ${
                  isActive 
                    ? "border-primary/50 bg-primary/[0.02]" 
                    : "hover:border-primary/30"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border transition-colors duration-300 ${
                      isActive ? "bg-primary/10 border-primary/20" : "bg-background group-hover:bg-muted/50"
                    }`}>
                      {getPluginIcon(plugin.key)}
                    </div>
                    <div className="flex gap-2">
                      {plugin.is_core && (
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <ShieldCheck className="h-3 w-3" />
                          سیستمی
                        </Badge>
                      )}
                      {isActive && (
                        <Badge variant="default" className="gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 font-normal">
                          <CheckCircle2 className="h-3 w-3" />
                          فعال
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">{plugin.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-sm/relaxed">
                    {plugin.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  {plugin.is_core && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80 bg-muted/30 p-2 rounded-lg">
                      <Settings2 className="h-3 w-3 mt-0.5" />
                      این پلاگین برای عملکرد صحیح سیستم الزامی است.
                    </div>
                  )}
                  {isRequiredByTheme && !plugin.is_core && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80 bg-primary/5 p-2 rounded-lg border border-primary/10">
                      <Puzzle className="h-3 w-3 mt-0.5 text-primary" />
                      این پلاگین برای قالب فعلی شما الزامی است.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center border-t border-muted/50 mt-auto py-4">
                  <span className={`text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {isActive ? "در حال استفاده" : "غیرفعال"}
                  </span>
                  <Switch 
                    checked={isActive}
                    onCheckedChange={() => handleToggle(plugin.key, isActive)}
                    disabled={isRequiredByTheme || plugin.is_core}
                    className="data-[state=checked]:bg-primary"
                  />
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
      {plugins.length === 0 && !loading && (
        <div className="col-span-full py-12">
          <Empty className="border-none bg-transparent">
            <EmptyMedia variant="icon">
              <Search className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>پلاگینی پیدا نشد</EmptyTitle>
              <EmptyDescription>
                {searchQuery 
                  ? `هیچ پلاگینی با عبارت "${searchQuery}" مطابقت ندارد.`
                  : "در حال حاضر پلاگینی در این بخش وجود ندارد."}
              </EmptyDescription>
            </EmptyHeader>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                پاک کردن جستجو
              </Button>
            )}
          </Empty>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-l from-foreground to-foreground/70 bg-clip-text text-transparent">
            مدیریت پلاگین‌ها
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            قابلیت‌های جدید را به وبسایت خود اضافه کرده و کسب‌وکارتان را توسعه دهید.
          </p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="نام یا توضیحات پلاگین..."
            className="pr-10 pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary/50 transition-all rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" dir="rtl">
        <div className="flex items-center justify-between mb-6 border-b pb-1">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-semibold text-base transition-all"
            >
              همه پلاگین‌ها
              <Badge variant="secondary" className="mr-2 h-5 min-w-5 flex items-center justify-center rounded-full p-0 px-1 text-[10px]">
                {allPlugins.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-semibold text-base transition-all"
            >
              فعال شده
              <Badge variant="secondary" className="mr-2 h-5 min-w-5 flex items-center justify-center rounded-full p-0 px-1 text-[10px]">
                {activePlugins.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {loading || isStoreLoading ? (
          <PluginSkeleton />
        ) : (
          <>
            <TabsContent value="all" className="mt-0 focus-visible:outline-none">
              <PluginGrid plugins={filteredPlugins} />
            </TabsContent>
            <TabsContent value="active" className="mt-0 focus-visible:outline-none">
              <PluginGrid plugins={activeFilteredPlugins} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

