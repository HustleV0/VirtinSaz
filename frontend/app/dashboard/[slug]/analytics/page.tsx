"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Eye, 
  Users, 
  TrendingUp,
  Clock,
  MapPin,
  Loader2,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingDown,
  ChevronRight,
} from "lucide-react"
import { mockCategories, formatPrice } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const stats = [
  {
    title: "درآمد کل",
    value: "۴۵,۶۰۰,۰۰۰",
    change: "+۱۸%",
    trend: "up",
    icon: DollarSign,
    unit: "تومان",
    description: "نسبت به ماه گذشته",
  },
  {
    title: "تعداد سفارشات",
    value: "۳۴۲",
    change: "+۱۲%",
    trend: "up",
    icon: ShoppingBag,
    description: "۳۸ سفارش امروز",
  },
  {
    title: "بازدید کل",
    value: "۱۲,۴۵۶",
    change: "+۸%",
    trend: "up",
    icon: Eye,
    description: "+۱۵۰ بازدید در ساعت اخیر",
  },
  {
    title: "میانگین سبد خرید",
    value: "۱۳۳,۳۰۰",
    change: "-۳%",
    trend: "down",
    icon: TrendingUp,
    unit: "تومان",
    description: "نیاز به بهینه‌سازی",
  },
]

// Advanced mock data for comparison
const comparisonData = [
  { label: "شنبه", current: 4200000, previous: 3800000 },
  { label: "یکشنبه", current: 3800000, previous: 4100000 },
  { label: "دوشنبه", current: 5100000, previous: 4500000 },
  { label: "سه‌شنبه", current: 4900000, previous: 4200000 },
  { label: "چهارشنبه", current: 6200000, previous: 5800000 },
  { label: "پنج‌شنبه", current: 8500000, previous: 7200000 },
  { label: "جمعه", current: 9200000, previous: 8100000 },
]

// Mock data for top products by category
const productSalesData = [
  { id: "1", name: "اسپرسو", sales: 120, categoryId: "1", revenue: 5400000, trend: "up" },
  { id: "2", name: "کاپوچینو", sales: 95, categoryId: "1", revenue: 6175000, trend: "down" },
  { id: "3", name: "لاته", sales: 80, categoryId: "1", revenue: 5600000, trend: "up" },
  { id: "5", name: "آیس لاته", sales: 110, categoryId: "2", revenue: 8800000, trend: "up" },
  { id: "6", name: "اسموتی توت‌فرنگی", sales: 75, categoryId: "2", revenue: 7125000, trend: "down" },
  { id: "7", name: "چیزکیک", sales: 65, categoryId: "3", revenue: 5525000, trend: "up" },
  { id: "8", name: "تیرامیسو", sales: 50, categoryId: "3", revenue: 4500000, trend: "up" },
  { id: "9", name: "صبحانه انگلیسی", sales: 40, categoryId: "4", revenue: 6000000, trend: "down" },
  { id: "10", name: "پنکیک", sales: 55, categoryId: "4", revenue: 5225000, trend: "up" },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      alert("گزارش با موفقیت آماده شد و در حال دانلود است.")
    }, 1500)
  }

  const topProducts = useMemo(() => {
    const filtered = selectedCategory === "all" 
      ? productSalesData 
      : productSalesData.filter(p => p.categoryId === selectedCategory)
    
    return filtered
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({
        ...p,
        percentage: (p.sales / Math.max(...filtered.map(x => x.sales))) * 100
      }))
  }, [selectedCategory])

  const maxVal = Math.max(...comparisonData.flatMap(d => [d.current, d.previous]))

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">پیشخوان تحلیل و آنالیز</h1>
          <p className="text-muted-foreground mt-1">
            بررسی دقیق عملکرد فروش، ترافیک و محبوبیت محصولات
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Download className="ml-2 h-4 w-4" />}
            خروجی اکسل
          </Button>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] h-9">
              <Calendar className="ml-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="بازه زمانی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">امروز</SelectItem>
              <SelectItem value="7days">۷ روز گذشته</SelectItem>
              <SelectItem value="30days">۳۰ روز گذشته</SelectItem>
              <SelectItem value="90days">۳ ماه گذشته</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-bold",
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black">{stat.value}</p>
                  {stat.unit && <span className="text-xs text-muted-foreground font-medium">{stat.unit}</span>}
                </div>
                <p className="text-sm font-bold text-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-right">مقایسه عملکرد درآمد</CardTitle>
              <CardDescription className="text-right flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-primary" /> این دوره
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-primary/20" /> دوره قبل
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-end gap-2 px-2 pb-2">
              {comparisonData.map((day) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="w-full flex items-end justify-center gap-1 h-full max-h-[280px]">
                    <div 
                      className="w-1/3 bg-primary/10 rounded-t-sm transition-all group-hover:bg-primary/20"
                      style={{ height: `${(day.previous / maxVal) * 100}%` }}
                    />
                    <div 
                      className="w-1/2 bg-primary rounded-t-sm relative transition-all group-hover:brightness-110"
                      style={{ height: `${(day.current / maxVal) * 100}%` }}
                    >
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-popover border text-popover-foreground text-[10px] px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        <p className="text-muted-foreground mb-1">مقایسه {day.label}</p>
                        <p className="font-bold text-sm">{formatPrice(day.current)} تومان</p>
                        <p className="text-green-600 font-medium">+{Math.round(((day.current - day.previous) / day.previous) * 100)}% رشد</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{day.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-right">تحلیل محصولات</CardTitle>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {mockCategories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardDescription className="text-right">بررسی محبوبیت و سودآوری</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-2">
              {topProducts.map((product, index) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold text-muted-foreground w-4">#{index + 1}</div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.sales} سفارش</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "flex items-center justify-end gap-0.5 text-[10px] font-bold",
                        product.trend === "up" ? "text-green-600" : "text-red-600"
                      )}>
                        {product.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {product.trend === "up" ? "+۵%" : "-۲%"}
                      </div>
                      <p className="text-xs font-black">{formatPrice(product.revenue)} <span className="text-[9px] font-normal">ت</span></p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-700",
                        index === 0 ? "bg-primary" : index === 1 ? "bg-primary/80" : "bg-primary/60"
                      )}
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full mt-6 text-xs h-8 gap-2">
                  مشاهده گزارش کامل محصولات
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-right mb-4">گزارش جامع فروش محصولات</DialogTitle>
                </DialogHeader>
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">نام محصول</TableHead>
                      <TableHead className="text-right">تعداد فروش</TableHead>
                      <TableHead className="text-right">درآمد (تومان)</TableHead>
                      <TableHead className="text-right">روند</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSalesData.sort((a, b) => b.sales - a.sales).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium text-right">{product.name}</TableCell>
                        <TableCell className="text-right font-bold">{product.sales}</TableCell>
                        <TableCell className="text-right">{formatPrice(product.revenue)}</TableCell>
                        <TableCell className="text-right">
                          <div className={cn(
                            "flex items-center gap-1 text-[10px] font-bold",
                            product.trend === "up" ? "text-green-600" : "text-red-600"
                          )}>
                            {product.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {product.trend === "up" ? "صعودی" : "نزولی"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-right">تحلیل ترافیک و ورودی</CardTitle>
              <CardDescription className="text-right font-medium text-green-600">رشد ۱۲٪ نسبت به هفته گذشته</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">+۱۵٪</span>
              </div>
              <div>
                <p className="text-2xl font-black">۱۲,۴۵۶</p>
                <p className="text-xs text-muted-foreground font-bold">بازدید کل صفحه منو</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                 <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">+۸٪</span>
              </div>
              <div>
                <p className="text-2xl font-black">۸,۲۳۴</p>
                <p className="text-xs text-muted-foreground font-bold">بازدیدکننده یکتا</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/5 space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold">ساعت‌های اوج بازدید</p>
                <p className="text-[10px] text-muted-foreground">میانگین روزانه</p>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[20, 35, 45, 80, 100, 90, 60, 40, 25, 15, 10, 5].map((v, i) => (
                  <div 
                    key={i} 
                    className={cn("flex-1 rounded-t-sm", v > 70 ? "bg-primary" : "bg-primary/20")} 
                    style={{ height: `${v}%` }} 
                  />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-muted-foreground font-bold px-1">
                <span>۱۲ ظهر</span>
                <span>۴ عصر</span>
                <span>۸ شب</span>
                <span>۱۲ شب</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <Tabs defaultValue="locations" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-right">منابع و موقعیت</CardTitle>
              <TabsList className="grid w-[160px] grid-cols-2 h-8">
                <TabsTrigger value="locations" className="text-xs">شهرها</TabsTrigger>
                <TabsTrigger value="sources" className="text-xs">منابع</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="locations" className="space-y-4 mt-2">
                {[
                  { city: "تهران", visitors: 4523, percent: 65, color: "bg-primary" },
                  { city: "مشهد", visitors: 1234, percent: 18, color: "bg-blue-500" },
                  { city: "اصفهان", visitors: 987, percent: 14, color: "bg-orange-500" },
                  { city: "سایر", visitors: 231, percent: 3, color: "bg-slate-400" },
                ].map((location) => (
                  <div key={location.city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{location.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{location.visitors.toLocaleString("fa-IR")} نفر</span>
                        <span className="font-black text-primary">{location.percent}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full", location.color)}
                        style={{ width: `${location.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="sources" className="space-y-5 mt-4">
                {[
                  { name: "اسکن QR مستقیم", val: 55 },
                  { name: "اینستاگرام", val: 25 },
                  { name: "گوگل (جستجو)", val: 15 },
                  { name: "سایر", val: 5 },
                ].map((source) => (
                  <div key={source.name} className="flex items-center gap-4">
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold">{source.name}</span>
                        <span className="text-xs font-black">{source.val}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${source.val}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
