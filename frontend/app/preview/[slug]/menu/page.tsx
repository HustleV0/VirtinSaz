"use client"

import { useState, use, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Search, 
  ChevronRight,
  Flame,
  Leaf,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { api } from "@/lib/api"
import { useCartStore } from "@/lib/store/use-cart-store"
import { toast } from "sonner"

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isOrderSuccess, setIsOrderSuccess] = useState(false)

  const { 
    items: cartItems, 
    addItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getItemCount 
  } = useCartStore()

  useEffect(() => {
    fetchMenuData()
  }, [slug])

  const fetchMenuData = async () => {
    try {
      const data = await api.get(`/menu/public-data/${slug}/`)
      setCategories(data.categories)
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to fetch menu:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (getItemCount() === 0) return
    
    setIsSubmitting(true)
    try {
      await api.post('/orders/', {
        site_slug: slug,
        items: cartItems,
        // For preview, we use dummy data for contact info
        first_name: "مشتری",
        last_name: "تستی",
        phone_number: "09120000000",
        address: "ثبت شده از پیش‌نمایش"
      })
      
      clearCart()
      setIsOrderSuccess(true)
      toast.success("سفارش شما با موفقیت ثبت شد")
    } catch (error) {
      toast.error("خطا در ثبت سفارش")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || 
                           product.category === parseInt(selectedCategory)
    return matchesSearch && matchesCategory && product.is_available
  })

  const getCartItem = (productId: number) => {
    return cartItems.find((item: any) => item.id === productId)
  }

  const cartItemCount = getItemCount()
  const cartTotal = getTotalPrice()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isOrderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">سفارش با موفقیت ثبت شد!</h2>
        <p className="text-muted-foreground mb-8">
          ممنون از اعتماد شما. سفارش شما در حال بررسی است.
        </p>
        <Button onClick={() => setIsOrderSuccess(false)}>
          بازگشت به منو
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href={`/preview/${slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
              <span>بازگشت</span>
            </Link>
            <h1 className="font-bold">منوی دیجیتال</h1>
            
            {/* Cart Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative bg-transparent">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>سبد خرید</SheetTitle>
                  <SheetDescription>
                    {cartItemCount} محصول در سبد شما
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex-1 overflow-auto">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">سبد خرید شما خالی است</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              {item.quantity === 1 ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>جمع کل:</span>
                      <span>{cartTotal.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "در حال ثبت..." : "ثبت سفارش"}
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="جستجو در منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="container pb-3 overflow-auto scrollbar-thin">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-max">
              <TabsTrigger value="all">همه</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id.toString()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Menu Items */}
      <main className="container py-6">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">محصولی یافت نشد</h3>
            <p className="text-muted-foreground">
              عبارت دیگری را جستجو کنید یا دسته‌بندی را تغییر دهید
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories
              .filter(cat => selectedCategory === "all" || cat.id.toString() === selectedCategory)
              .map((category) => {
                const categoryProducts = filteredProducts.filter(
                  p => p.category === category.id
                )
                if (categoryProducts.length === 0) return null
                
                return (
                  <section key={category.id}>
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                      {category.name}
                      <Badge variant="secondary" className="text-xs">
                        {categoryProducts.length} محصول
                      </Badge>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {categoryProducts.map((product) => {
                        const cartItem = getCartItem(product.id)
                        const quantity = cartItem?.quantity || 0
                        return (
                          <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex gap-3 p-4">
                                {product.image && (
                                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.title}
                                      width={96}
                                      height={96}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold">{product.title}</h3>
                                  {product.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {product.description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between mt-3">
                                    <div className="font-bold">
                                      {product.price.toLocaleString("fa-IR")}
                                      <span className="text-xs text-muted-foreground font-normal mr-1">
                                        تومان
                                      </span>
                                    </div>
                                    
                                    {quantity === 0 ? (
                                      <Button 
                                        size="sm" 
                                        onClick={() => addItem(product)}
                                        className="gap-1"
                                      >
                                        <Plus className="h-4 w-4" />
                                        افزودن
                                      </Button>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-8 w-8 bg-transparent"
                                          onClick={() => updateQuantity(product.id, quantity - 1)}
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-6 text-center font-medium">
                                          {quantity}
                                        </span>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-8 w-8 bg-transparent"
                                          onClick={() => updateQuantity(product.id, quantity + 1)}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
          </div>
        )}
      </main>
    </div>
  )
}
