"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Globe,
  LayoutDashboard,
  ExternalLink,
  Package,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { CreateSiteFlow } from "@/components/dashboard/create-site-flow"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://dash.vofino.ir"

interface Site {
  id: number
  name: string
  slug: string
  logo: string | null
  product_count: number
  subscription_days_left: number
  is_trial: boolean
  category_name: string
  trial_ends_at: string
  subscription_ends_at: string
}

import { useSearchParams } from "next/navigation"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [isFetchingSites, setIsFetchingSites] = useState(true)
  const [showCreateFlow, setShowCreateFlow] = useState(false)
  const { user, token, isLoading } = useAuth()
  
  useEffect(() => {
    setMounted(true)
    if (token) {
      fetchSites()
    }
  }, [token])

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setShowCreateFlow(true)
    }
  }, [searchParams])

  const fetchSites = async () => {
    setIsFetchingSites(true)
    try {
      const data = await api.get("/sites/user-sites/")
      setSites(data)
    } catch (error) {
      toast.error("خطا در دریافت لیست سایت‌ها")
    } finally {
      setIsFetchingSites(false)
    }
  }

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (showCreateFlow || (sites.length === 0 && !isFetchingSites)) {
    return (
      <div className="space-y-4">
        {sites.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => setShowCreateFlow(false)}
            className="mb-4"
          >
            بازگشت به لیست سایت‌ها
          </Button>
        )}
        <CreateSiteFlow />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">داشبورد مدیریت سایت‌ها</h1>
          <p className="text-muted-foreground">
            لیست وبسایت‌های شما و وضعیت اشتراک آن‌ها
          </p>
        </div>
        <Button onClick={() => setShowCreateFlow(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن سایت جدید
        </Button>
      </div>

      {isFetchingSites ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="group relative overflow-hidden border-border/40 bg-card transition-all hover:border-primary/50 hover:shadow-xl dark:bg-card/50">
              <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-primary/50 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  {/* Logo/Avatar */}
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden shadow-inner group-hover:border-primary/20 transition-colors">
                    {site.logo ? (
                      <img src={site.logo.startsWith('http') ? site.logo : `${API_BASE_URL}${site.logo}`} alt={site.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <Globe className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2 text-center md:text-right">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                      <h3 className="text-2xl font-black tracking-tight">{site.name}</h3>
                      <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-none px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                        {site.category_name}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                        <Package className="h-4 w-4 text-primary/70" />
                        {site.product_count} محصول ثبت شده
                      </span>
                      <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md ltr" dir="ltr">
                        <Globe className="h-4 w-4 text-primary/70" />
                        {site.slug}.vofino.ir
                      </span>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div className="w-full md:w-auto px-6 py-4 md:py-0 md:px-6 border-y md:border-y-0 md:border-x border-border/40 flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-bold">نوع اشتراک:</span>
                      </div>
                      <Badge variant={site.subscription_days_left > 0 ? (site.is_trial ? "secondary" : "default") : "destructive"} className="shadow-sm">
                        {site.is_trial ? "آزمایشی رایگان" : "پلن حرفه‌ای"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-primary/60" />
                        <span className="text-sm font-bold">وضعیت:</span>
                      </div>
                      <span className="text-sm">
                        {site.subscription_days_left > 0 ? (
                          <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{site.subscription_days_left} روز تا پایان</span>
                        ) : (
                          <span className="font-black text-destructive bg-destructive/5 px-2 py-1 rounded-lg flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            منقضی شده
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                    <div className="grid grid-cols-2 md:flex gap-3 w-full">
                      <Link href={`/preview/${site.slug}`} target="_blank" className="w-full md:w-auto">
                        <Button variant="outline" size="lg" className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                          <ExternalLink className="h-4 w-4" />
                          مشاهده سایت
                        </Button>
                      </Link>
                      <Link href={`/dashboard/${site.slug}/analytics`} className="w-full md:w-auto">
                        <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/20">
                          <LayoutDashboard className="h-4 w-4" />
                          پنل مدیریت
                        </Button>
                      </Link>
                      <Link href={`/dashboard/${site.slug}/subscription`} className="col-span-2 w-full md:w-auto">
                        <Button variant="secondary" size="lg" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          تمدید اشتراک
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
