"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UtensilsCrossed,
  FolderTree,
  Eye,
  TrendingUp,
  Clock,
  ArrowLeft,
  Plus,
  QrCode,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react"
import { mockDashboardStats, mockRestaurant, mockProducts, formatPrice, getPersianDate } from "@/lib/mock-data"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { CreateSiteFlow } from "@/components/dashboard/create-site-flow"
import { toast } from "sonner"

const statCards = [
  {
    title: "کل محصولات",
    value: mockDashboardStats.totalProducts,
    icon: UtensilsCrossed,
    href: "/dashboard/products",
  },
  {
    title: "دسته‌بندی‌ها",
    value: mockDashboardStats.totalCategories,
    icon: FolderTree,
    href: "/dashboard/categories",
  },
  {
    title: "بازدید امروز",
    value: mockDashboardStats.todayViews,
    icon: Eye,
    trend: "+12%",
  },
  {
    title: "کل بازدید",
    value: mockDashboardStats.totalViews,
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading || !mounted) {
    return <div className="flex items-center justify-center min-h-[50vh]">در حال بارگذاری...</div>
  }

  if (user && !user.has_site) {
    return <CreateSiteFlow />
  }

  const restaurantName = user?.restaurant_name || mockRestaurant.name
  const restaurantSlug = user?.site_slug || mockRestaurant.slug

  const quickActions = [
    {
      title: "افزودن محصول",
      description: "محصول جدید به منو اضافه کنید",
      href: "/dashboard/products/new",
      icon: Plus,
    },
    {
      title: "پیش‌نمایش وبسایت",
      description: "وبسایت خود را مشاهده کنید",
      href: `/preview/${restaurantSlug}`,
      icon: Eye,
      external: true,
    },
    {
      title: "اشتراک‌گذاری وبسایت",
      description: "لینک منو را بفرستید",
      href: "#",
      icon: Share2,
      action: () => {
        if (typeof window !== 'undefined') {
          const url = `${window.location.origin}/preview/${restaurantSlug}`;
          navigator.clipboard.writeText(url);
          toast.success("لینک کپی شد!");
        }
      }
    },
  ]

  const popularProducts = mockProducts.filter((p) => p.isPopular).slice(0, 5)
  const menuUrl = mounted ? `${window.location.origin}/preview/${restaurantSlug}` : '';
  const qrCodeUrl = mounted ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}` : '';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">سلام، {restaurantName}!</h1>
          <p className="text-muted-foreground">
            خلاصه‌ای از وضعیت وبسایت شما
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Link href={`/preview/${restaurantSlug}`} target="_blank">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              مشاهده منوی آنلاین
            </Button>
          </Link>
        </div>
      </div>

      {/* QR Code and Stats Grid Wrapper */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stats (2/3 width on large) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        {stat.trend && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.trend}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  {stat.href && (
                    <Link
                      href={stat.href}
                      className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      مشاهده همه
                      <ArrowLeft className="h-3 w-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* QR Code Card (1/3 width on large) */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="h-5 w-5 text-primary" />
              QR Code منوی شما
            </CardTitle>
            <CardDescription>
              مشتریان با اسکن این کد منو را می‌بینند
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center space-y-4 pt-4">
            <div className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-white p-4 transition-transform hover:scale-105 min-w-[160px] min-h-[160px] flex items-center justify-center">
              {mounted ? (
                <>
                  <img 
                    src={qrCodeUrl} 
                    alt="Menu QR Code" 
                    className="w-40 h-40"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <p className="text-[10px] font-bold text-primary bg-white px-2 py-1 rounded-full shadow-sm">اسکن کنید</p>
                  </div>
                </>
              ) : (
                <Skeleton className="w-40 h-40 rounded-lg" />
              )}
            </div>
            
            <div className="w-full space-y-2">
              <Button 
                variant="outline" 
                className="w-full gap-2 h-9 text-xs" 
                onClick={() => mounted && window.open(qrCodeUrl, '_blank')}
                disabled={!mounted}
              >
                <Download className="h-4 w-4" />
                دانلود تصویر کد
              </Button>
              <Button 
                variant="ghost" 
                className="w-full gap-2 h-9 text-xs bg-primary/5 text-primary hover:bg-primary/10" 
                onClick={() => {
                  if (mounted) {
                    navigator.clipboard.writeText(menuUrl);
                    alert("لینک کپی شد!");
                  }
                }}
                disabled={!mounted}
              >
                <Share2 className="h-4 w-4" />
                کپی لینک مستقیم
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription and Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              وضعیت اشتراک
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">پلن فعلی</p>
                <p className="text-lg font-semibold">حرفه‌ای</p>
              </div>
              <Badge variant={mockRestaurant.subscription.status === "active" ? "default" : "destructive"}>
                {mockRestaurant.subscription.status === "active" ? "فعال" : "منقضی"}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">روزهای باقی‌مانده</span>
                <span className="font-medium">{mockDashboardStats.subscriptionDaysLeft} روز</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min((mockDashboardStats.subscriptionDaysLeft / 180) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                تاریخ انقضا: {getPersianDate(mockRestaurant.subscription.endDate)}
              </span>
              <Link href="/dashboard/subscription">
                <Button variant="outline" size="sm">
                  تمدید اشتراک
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
            <CardDescription>اقدامات پرکاربرد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <div
                key={action.title}
                onClick={action.action}
                className="cursor-pointer"
              >
                <Link
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                  onClick={(e) => {
                    if (action.action) {
                      e.preventDefault();
                      action.action();
                    }
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Popular Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>محصولات محبوب</CardTitle>
            <CardDescription>پرفروش‌ترین محصولات شما</CardDescription>
          </div>
          <Link href="/dashboard/analytics">
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              مشاهده گزارش کامل
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {product.image && (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 truncate">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{formatPrice(product.price)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
