"use client"

import { useState, use } from "react"
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
  X
} from "lucide-react"
import { mockProducts, mockCategories, mockRestaurant } from "@/lib/mock-data"

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])

  const restaurant = mockRestaurant

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.includes(searchQuery) || 
                         product.description?.includes(searchQuery)
    const matchesCategory = selectedCategory === "all" || 
                           product.categoryId === selectedCategory
    return matchesSearch && matchesCategory && product.isAvailable
  })

  const addToCart = (productId: string) => {
    const existing = cart.find(item => item.id === productId)
    if (existing) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { id: productId, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    const existing = cart.find(item => item.id === productId)
    if (existing && existing.quantity > 1) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ))
    } else {
      setCart(cart.filter(item => item.id !== productId))
    }
  }

  const getCartQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0
  }

  const cartTotal = cart.reduce((total, item) => {
    const product = mockProducts.find(p => p.id === item.id)
    return total + (product?.price || 0) * item.quantity
  }, 0)

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

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
            <h1 className="font-bold">{restaurant.name}</h1>
            
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
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">سبد خرید شما خالی است</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const product = mockProducts.find(p => p.id === item.id)
                        if (!product) return null
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              {product.image && (
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.price.toLocaleString("fa-IR")} تومان
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 bg-transparent"
                                onClick={() => removeFromCart(item.id)}
                              >
                                {item.quantity === 1 ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 bg-transparent"
                                onClick={() => addToCart(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>جمع کل:</span>
                      <span>{cartTotal.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    <Button className="w-full" size="lg">
                      ثبت سفارش
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      این یک نسخه دمو است. سفارش واقعی ثبت نمی‌شود.
                    </p>
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
              {mockCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
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
            {mockCategories
              .filter(cat => selectedCategory === "all" || cat.id === selectedCategory)
              .map((category) => {
                const categoryProducts = filteredProducts.filter(
                  p => p.categoryId === category.id
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
                        const quantity = getCartQuantity(product.id)
                        return (
                          <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex gap-3 p-4">
                                {/* Product Image */}
                                {product.image && (
                                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      width={96}
                                      height={96}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <div className="flex gap-1 shrink-0">
                                      {product.tags?.includes("پرفروش") && (
                                        <Flame className="h-4 w-4 text-orange-500" />
                                      )}
                                      {product.tags?.includes("گیاهی") && (
                                        <Leaf className="h-4 w-4 text-green-500" />
                                      )}
                                      {product.tags?.includes("ویژه") && (
                                        <Star className="h-4 w-4 text-yellow-500" />
                                      )}
                                    </div>
                                  </div>
                                  
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
                                    
                                    {/* Add to Cart */}
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
                                          onClick={() => removeFromCart(product.id)}
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
                                          onClick={() => addToCart(product.id)}
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

      {/* Floating Cart Button (Mobile) */}
      {cartItemCount > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <div className="fixed bottom-4 right-4 left-4 sm:hidden">
              <Button className="w-full h-14 gap-2 shadow-lg">
                <ShoppingBag className="h-5 w-5" />
                <span>مشاهده سبد خرید</span>
                <span className="bg-background/20 px-2 py-0.5 rounded text-sm">
                  {cartTotal.toLocaleString("fa-IR")} تومان
                </span>
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>سبد خرید</SheetTitle>
              <SheetDescription>
                {cartItemCount} محصول در سبد شما
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex-1 overflow-auto pb-24">
              <div className="space-y-4">
                {cart.map((item) => {
                  const product = mockProducts.find(p => p.id === item.id)
                  if (!product) return null
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.image && (
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-transparent"
                          onClick={() => removeFromCart(item.id)}
                        >
                          {item.quantity === 1 ? <X className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-transparent"
                          onClick={() => addToCart(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background border-t p-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>جمع کل:</span>
                <span>{cartTotal.toLocaleString("fa-IR")} تومان</span>
              </div>
              <Button className="w-full" size="lg">
                ثبت سفارش
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
