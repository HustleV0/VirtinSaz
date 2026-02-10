"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ExternalLink,
  ShoppingCart,
  Puzzle,
  TrendingUp,
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
    title: "اشتراک",
    href: "/dashboard/subscription",
    icon: Crown,
  },
]

function SidebarContent({ onItemClick, restaurantName, phone, siteSlug, hasSite }: { onItemClick?: () => void, restaurantName?: string, phone?: string, siteSlug?: string | null, hasSite?: boolean }) {
  const pathname = usePathname()
  const slug = siteSlug || "your-restaurant"
  const { isPluginActive } = useSiteStore()

  return (
    <div className="flex h-full flex-col">
      {/* ... (بقیه کدها ثابت می‌ماند) */}
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">م</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ویترین ساز</span>
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
             <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div className="flex-1 truncate">
            <p className="truncate font-medium text-sidebar-foreground">
              {restaurantName || "رستوران من"}
            </p>
            {hasSite && (
              <p className="truncate text-xs text-sidebar-foreground/60" dir="ltr">
                {slug}.vitrinsaz.ir
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          
          // Hide most items if no site
          if (!hasSite && item.href !== "/dashboard" && item.href !== "/dashboard/subscription") {
            return null
          }

          // Check for plugin activity if item is plugin-dependent
          if (item.plugin && !isPluginActive(item.plugin)) {
            return null
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
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
      {hasSite && (
        <div className="border-t border-sidebar-border p-4">
          <Link href={`/preview/${slug}`} target="_blank">
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
  const { fetchSite, isLoading: isSiteLoading } = useSiteStore()

  useEffect(() => {
    if (user?.has_site) {
      fetchSite()
    }
  }, [user, fetchSite])

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
          restaurantName={user.restaurant_name} 
          phone={user.phone_number} 
          siteSlug={user.site_slug}
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
            restaurantName={user.restaurant_name} 
            phone={user.phone_number} 
            siteSlug={user.site_slug}
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
