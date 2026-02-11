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
import { CreateSiteFlow } from "@/components/dashboard/create-site-flow"
import { toast } from "sonner"

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

export default function DashboardPage() {
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

  const fetchSites = async () => {
    setIsFetchingSites(true)
    try {
      const res = await fetch("http://localhost:8000/api/sites/user-sites/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setSites(data)
      } else {
        toast.error("خطا در دریافت لیست سایت‌ها")
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط با سرور")
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
        <div className="grid gap-4">
          {sites.map((site) => (
            <Card key={site.id} className="overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-4 gap-6">
                  {/* Logo/Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 overflow-hidden">
                    {site.logo ? (
                      <img src={site.logo.startsWith('http') ? site.logo : `http://localhost:8000${site.logo}`} alt={site.name} className="h-full w-full object-cover" />
                    ) : (
                      <Globe className="h-10 w-10 text-primary/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1 text-center md:text-right">
                    <h3 className="text-xl font-bold">{site.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {site.product_count} محصول
                      </span>
                      <span className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {site.category_name}
                        </Badge>
                      </span>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div className="w-full md:w-auto px-6 py-3 md:py-0 md:px-0 border-y md:border-y-0 md:border-x border-border/50 flex flex-row md:flex-col justify-around md:justify-center items-center md:items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">اشتراک:</span>
                      <Badge variant={site.subscription_days_left > 0 ? (site.is_trial ? "secondary" : "default") : "destructive"}>
                        {site.is_trial ? "آزمایشی (۲۴ ساعته)" : "ویژه"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {site.subscription_days_left > 0 ? (
                          <span className="font-bold text-primary">{site.subscription_days_left} روز باقی‌مانده</span>
                        ) : (
                          <span className="font-bold text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            منقضی شده
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link href={`/preview/${site.slug}`} target="_blank" className="flex-1 md:flex-none">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        مشاهده
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="flex-1 md:flex-none">
                      <Button size="sm" className="w-full gap-1">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        مدیریت
                      </Button>
                    </Link>
                    <Link href="/pricing" className="flex-1 md:flex-none">
                      <Button variant="secondary" size="sm" className="w-full">
                        خرید اشتراک
                      </Button>
                    </Link>
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
