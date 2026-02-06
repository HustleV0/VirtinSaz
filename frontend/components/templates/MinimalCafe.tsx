"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  mockCategories,
  mockProducts,
  formatPrice,
} from "@/lib/mock-data"
import type { Restaurant } from "@/types"
import {
  Menu as MenuIcon,
  Phone,
  MapPin,
  Instagram,
  Send,
  Star,
  Search,
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

export function MinimalCafe({ 
  restaurant, 
  categories = [], 
  products = [] 
}: { 
  restaurant: any, 
  categories?: any[], 
  products?: any[] 
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.title || product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push(`/verify?status=success&amount=${cartTotal}`)
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory || product.category === activeCategory || product.categoryId === activeCategory
    const title = product.title || product.name || ""
    const matchesSearch = title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularProducts = products.filter((p) => p.isPopular || p.is_popular)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href={`/preview/${restaurant.slug}`} className="flex items-center gap-2">
            {restaurant.logo ? (
              <img
                src={restaurant.logo || "/placeholder.svg"}
                alt={restaurant.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">
                  {restaurant.name[0]}
                </span>
              </div>
            )}
            <span className="text-xl font-bold">{restaurant.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href={`/preview/${restaurant.slug}`}
              className="text-sm font-medium text-foreground"
            >
              منو
            </Link>
            <Link
              href={`/preview/${restaurant.slug}/about`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              درباره ما
            </Link>
            <Link
              href={`/preview/${restaurant.slug}/contact`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              تماس با ما
            </Link>
          </nav>

          {/* Social and Contact - Desktop */}
          <div className="hidden items-center gap-2 md:flex border-r border-l px-4 mx-4">
            {restaurant.socialLinks?.instagram && (
              <a
                href={`https://instagram.com/${restaurant.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a
                href={`https://t.me/${restaurant.socialLinks.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-1 mr-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                dir="ltr"
              >
                <Phone className="h-4 w-4" />
                <span>{restaurant.phone}</span>
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    سبد خرید
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">سبد خرید شما خالی است</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 rounded-lg border p-3"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.price)} تومان
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-4 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <SheetFooter className="flex-col gap-4 border-t pt-6">
                    <div className="flex w-full items-center justify-between font-bold">
                      <span>مجموع:</span>
                      <span>{formatPrice(cartTotal)} تومان</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      تایید و پرداخت
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="text-right">
                <SheetHeader>
                  <SheetTitle className="text-right">{restaurant.name}</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4">
                  <Link
                    href={`/preview/${restaurant.slug}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    منو
                  </Link>
                  <Link
                    href={`/preview/${restaurant.slug}/about`}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    درباره ما
                  </Link>
                  <Link
                    href={`/preview/${restaurant.slug}/contact`}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تماس با ما
                  </Link>
                </nav>

                <div className="mt-8 flex flex-col gap-4 border-t pt-8">
                  <div className="flex items-center gap-4">
                    {restaurant.socialLinks?.instagram && (
                      <a
                        href={`https://instagram.com/${restaurant.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a
                        href={`https://t.me/${restaurant.socialLinks.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                      >
                        <Send className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="flex items-center gap-2 text-lg font-medium"
                      dir="ltr"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <span>{restaurant.phone}</span>
                    </a>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        <div
          className="h-[40vh] min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: restaurant.coverImage
              ? `url(${restaurant.coverImage})`
              : undefined,
            backgroundColor: restaurant.coverImage ? undefined : "var(--muted)",
          }}
        />
        <div className="container relative mx-auto -mt-12 px-4 md:-mt-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="h-20 w-20 rounded-xl border-4 border-background object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-background bg-primary shadow-md">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {restaurant.name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                  <p className="text-muted-foreground">{restaurant.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {restaurant.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${restaurant.socialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="icon">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {restaurant.socialLinks?.telegram && (
                  <a
                    href={`https://t.me/${restaurant.socialLinks.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`}>
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="جستجو در منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              همه
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory || searchQuery || 'all'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Popular Products */}
            {!activeCategory && !searchQuery && popularProducts.length > 0 && (
              <section className="mb-12">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  محبوب‌ترین‌ها
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {popularProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      restaurant={restaurant}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Products by Category */}
            {activeCategory || searchQuery ? (
              <section>
                <h2 className="mb-4 text-xl font-bold">
                  {searchQuery ? "نتایج جستجو" : categories.find((c) => c.id.toString() === activeCategory)?.name}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      restaurant={restaurant}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </div>
              </section>
            ) : (
              categories.map((category) => {
                const categoryProducts = filteredProducts.filter(
                  (p) => (p.category === category.id || p.categoryId === category.id.toString())
                )
                if (categoryProducts.length === 0) return null

                return (
                  <section key={category.id} className="mb-12">
                    <h2 className="mb-4 text-xl font-bold">{category.name}</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          restaurant={restaurant}
                          onAddToCart={() => addToCart(product)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })
            )}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">محصولی یافت نشد</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    {restaurant.name[0]}
                  </span>
                </div>
              )}
              <span className="font-bold">{restaurant.name}</span>
            </div>

            {restaurant.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {restaurant.address}
              </div>
            )}

            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {restaurant.phone}
              </a>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              ساخته شده با{" "}
              <Link href="/" className="text-primary hover:underline">
                منوساز
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({
  product,
  restaurant,
  onAddToCart,
}: {
  product: any
  restaurant: any
  onAddToCart: () => void
}) {
  const title = product.title || product.name
  const isAvailable = product.is_available ?? product.isAvailable
  const isPopular = product.is_popular ?? product.isPopular

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image && (
          <img
            src={product.image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        {isPopular && (
          <Badge className="absolute right-2 top-2 gap-1">
            <Star className="h-3 w-3 fill-current" />
            محبوب
          </Badge>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="secondary">ناموجود</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{title}</h3>
          </div>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.tags.map((tag: any) => (
                <span
                  key={typeof tag === 'string' ? tag : tag.id}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}

          {restaurant.settings.showPrices && (
            <div className="mt-3 flex items-center gap-2">
              {product.discount_percentage ? (
                <>
                  <span className="font-bold text-primary">
                    {formatPrice(product.price * (1 - product.discount_percentage / 100))} {restaurant.settings.currency || "تومان"}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-bold">
                  {formatPrice(product.price)} {restaurant.settings.currency || "تومان"}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          className="mt-4 w-full gap-2"
          size="sm"
          disabled={!isAvailable}
          onClick={onAddToCart}
        >
          <Plus className="h-4 w-4" />
          سفارش
        </Button>
      </div>
    </motion.div>
  )
}
