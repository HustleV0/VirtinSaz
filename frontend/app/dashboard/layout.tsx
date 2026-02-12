"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Settings,
  Palette,
  UtensilsCrossed,
  FolderTree,
  CreditCard,
  Crown,
  Eye,
  Menu,
  LogOut,
  User,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
  ExternalLink,
  ShoppingCart,
  Puzzle,
  TrendingUp,
  Globe,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { useSiteStore } from "@/lib/store/use-site-store"
import { useEffect } from "react"

const sidebarItems = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "آنالیز و آمار",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    plugin: "analytics"
  },
  {
    title: "مدیریت پلاگین‌ها",
    href: "/dashboard/plugins",
    icon: Puzzle,
  },
  {
    title: "تنظیمات وبسایت",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "انتخاب قالب",
    href: "/dashboard/themes",
    icon: Palette,
  },
  {
    title: "محصولات",
    href: "/dashboard/cafe/menu",
    icon: UtensilsCrossed,
    plugin: "menu"
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/dashboard/cafe/categories",
    icon: FolderTree,
    plugin: "menu"
  },
  {
    title: "سفارشات",
    href: "/dashboard/cafe/orders",
    icon: ShoppingCart,
    plugin: "order"
  },
  {
    title: "درگاه پرداخت",
    href: "/dashboard/payments",
    icon: CreditCard,
    plugin: "ecommerce"
  },
  {
    title: "پرداختی‌ها",
    href: "/dashboard/payment-list",
    icon: CreditCard,
    plugin: "payment"
  },
  {
    title: "اشتراک",
    href: "/dashboard/subscription",
    icon: Crown,
  },
]

import { ScrollArea } from "@/components/ui/scroll-area"

function SidebarContent({ onItemClick, restaurantName, phone, siteSlug, hasSite }: { onItemClick?: () => void, restaurantName?: string, phone?: string, siteSlug?: string | null, hasSite?: boolean }) {
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const urlSlug = params?.slug as string
  const { isPluginActive, sites } = useSiteStore()

  const handleSiteChange = (newSlug: string) => {
    if (newSlug === "all") {
      router.push("/dashboard")
      if (onItemClick) onItemClick()
      return
    }

    if (newSlug === urlSlug) return
    
    if (urlSlug) {
      const newPathname = pathname.replace(`/dashboard/${urlSlug}`, `/dashboard/${newSlug}`)
      router.push(newPathname)
    } else {
      const pathAfterDashboard = pathname.replace("/dashboard", "")
      if (pathAfterDashboard && pathAfterDashboard !== "/") {
        const cleanPath = pathAfterDashboard.startsWith("/") ? pathAfterDashboard : `/${pathAfterDashboard}`
        router.push(`/dashboard/${newSlug}${cleanPath}`)
      } else {
        router.push(`/dashboard/${newSlug}/analytics`)
      }
    }
    if (onItemClick) onItemClick()
  }

  const currentSite = sites.find(s => s.slug === urlSlug)

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">و</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ویترین ساز</span>
        </Link>
      </div>

      {/* Site Switcher */}
      <div className="border-b border-sidebar-border p-4">
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full h-auto justify-start gap-3 px-2 py-2 hover:bg-sidebar-accent group"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground group-hover:bg-sidebar-primary/10 group-hover:text-sidebar-primary transition-colors">
                 <Globe className="h-5 w-5" />
              </div>
              <div className="flex-1 truncate text-right">
                <p className="truncate font-medium text-sidebar-foreground">
                  {currentSite?.name || "همه سایت‌ها"}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60" dir="ltr">
                  {urlSlug ? `${urlSlug}.vitrinsaz.ir` : "مدیریت مرکزی"}
                </p>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" side="bottom">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground text-right">
              وبسایت‌های من
            </div>
            <DropdownMenuItem 
              onClick={() => handleSiteChange("all")}
              className={cn(
                "flex flex-col items-start gap-0.5 py-2 cursor-pointer text-right w-full",
                !urlSlug && "bg-sidebar-accent"
              )}
            >
              <span className="font-medium">همه سایت‌ها</span>
              <span className="text-xs text-muted-foreground">مشاهده لیست کلی</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <ScrollArea className={cn("flex flex-col", sites.length > 5 ? "h-[200px]" : "h-auto")} dir="rtl">
              {sites.map((site) => (
                <DropdownMenuItem 
                  key={site.id} 
                  onClick={() => handleSiteChange(site.slug)}
                  className={cn(
                    "flex flex-col items-start gap-0.5 py-2 cursor-pointer text-right w-full",
                    site.slug === urlSlug && "bg-sidebar-accent"
                  )}
                >
                  <span className="font-medium">{site.name}</span>
                  <span className="text-xs text-muted-foreground" dir="ltr">{site.slug}.vitrinsaz.ir</span>
                </DropdownMenuItem>
              ))}
            </ScrollArea>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-right w-full">
              <Link href="/dashboard?create=true" className="flex items-center gap-2 cursor-pointer text-primary font-medium py-2">
                <Plus className="h-4 w-4" />
                <span>افزودن سایت جدید</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          let href = item.href
          if (urlSlug && href.startsWith("/dashboard") && href !== "/dashboard") {
            const pathAfterDashboard = href.replace("/dashboard", "")
            href = `/dashboard/${urlSlug}${pathAfterDashboard}`
          }

          const isActive = pathname === href
          
          // Hide site-specific items if no site is selected, 
          // EXCEPT for items that have global versions
          const globalAllowed = ["/dashboard", "/dashboard/profile"]
          if (!urlSlug && !globalAllowed.includes(item.href)) {
            return null
          }

          if (item.plugin && !isPluginActive(item.plugin)) {
            return null
          }
          
          return (
            <Link
              key={item.href}
              href={href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Preview Button */}
      {urlSlug && (
        <div className="border-t border-sidebar-border p-4">
          <Link href={`/preview/${urlSlug}`} target="_blank">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              پیش‌نمایش وبسایت
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  const { site, fetchSite, fetchAllSites, isLoading: isSiteLoading } = useSiteStore()
  const pathname = usePathname()
  const params = useParams()
  const urlSlug = params?.slug as string
  const isDashboardRoot = pathname === "/dashboard"

  useEffect(() => {
    if (user?.has_site) {
      fetchSite(urlSlug)
      fetchAllSites()
    }
  }, [user, fetchSite, fetchAllSites, urlSlug])

  if (isAuthLoading || (user?.has_site && isSiteLoading)) {
    return <div className="flex min-h-screen items-center justify-center">در حال بارگذاری...</div>
  }

  if (!user) return null

  const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`) : null

  return (
    <div className="flex min-h-screen bg-background text-right" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-l border-sidebar-border bg-sidebar lg:block">
        <SidebarContent 
          restaurantName={site?.name || user.restaurant_name} 
          phone={user.phone_number} 
          siteSlug={site?.slug || user.site_slug}
          hasSite={user.has_site}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="right" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
          <SheetDescription className="sr-only">
            دسترسی سریع به بخش‌های مختلف پنل مدیریت
          </SheetDescription>
          <SidebarContent 
            onItemClick={() => setIsSidebarOpen(false)} 
            restaurantName={site?.name || user.restaurant_name} 
            phone={user.phone_number} 
            siteSlug={site?.slug || user.site_slug}
            hasSite={user.has_site}
          />
        </SheetContent>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
            {/* Mobile Menu Button */}
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">منو</span>
              </Button>
            </SheetTrigger>

            {/* Breadcrumb - Desktop */}
            <div className="hidden lg:block" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt={user.full_name} />
                      <AvatarFallback>
                        {user.full_name?.slice(0, 2) || "کاربر"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.full_name || "کاربر"}</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="ml-2 h-4 w-4" />
                      پروفایل
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="ml-2 h-4 w-4" />
                      تنظیمات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </Sheet>
    </div>
  )
}
