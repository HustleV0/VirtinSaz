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
  Loader2
} from "lucide-react"
import { api } from "@/lib/api"

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [cartData, setCartData] = useState<any>(null)

  useEffect(() => {
    fetchMenuData()
    fetchCart()
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

  const fetchCart = async () => {
    try {
      const data = await api.get(`/orders/cart/?site_slug=${slug}`)
      setCartData(data)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const addToCart = async (productId: number) => {
    try {
      await api.post(`/orders/cart/add_item/`, {
        site_slug: slug,
        product_id: productId,
        quantity: 1
      })
      fetchCart()
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await api.post(`/orders/cart/update_quantity/`, {
        site_slug: slug,
        item_id: itemId,
        quantity: quantity
      })
      fetchCart()
    } catch (error) {
      console.error("Failed to update quantity:", error)
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
    return cartData?.items.find((item: any) => item.product === productId)
  }

  const cartItemCount = cartData?.items.reduce((total: number, item: any) => total + item.quantity, 0) || 0
  const cartTotal = cartData?.total_amount || 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  {!cartData || cartData.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">سبد خرید شما خالی است</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartData.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.product_name_snapshot}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.price_snapshot.toLocaleString("fa-IR")} تومان
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
                {cartData && cartData.items.length > 0 && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>جمع کل:</span>
                      <span>{cartTotal.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    <Button className="w-full" size="lg">
                      ثبت سفارش
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
                                        onClick={() => addToCart(product.id)}
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
                                          onClick={() => updateQuantity(cartItem.id, quantity - 1)}
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
                                          onClick={() => updateQuantity(cartItem.id, quantity + 1)}
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
