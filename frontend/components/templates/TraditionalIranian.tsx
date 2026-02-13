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
  ChevronLeft,
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

// Traditional Persian Restaurant Colors
const themeColors = {
  primary: '#1e3a5f',
  secondary: '#f8f4e8',
  accent: '#c9a959',
  background: '#fffef9',
  text: '#1e3a5f',
}

export function TraditionalIranian({ 
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
  const isCartEnabled = restaurant.activePlugins?.includes('shopping_cart')

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
      !activeCategory || 
      product.category?.toString() === activeCategory || 
      product.categoryId?.toString() === activeCategory
    const title = product.title || product.name || ""
    const matchesSearch = title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Banner/Cover Image */}
      {restaurant.coverImage && (
        <div className="w-full h-64 overflow-hidden relative">
          <img 
            src={restaurant.coverImage} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: themeColors.background, borderColor: themeColors.accent }}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          {/* Logo - Centered approach for traditional look */}
          <Link href={`/preview/${restaurant.slug}`} className="flex items-center gap-3">
            {restaurant.logo ? (
              <img
                src={restaurant.logo || "/placeholder.svg"}
                alt={restaurant.name}
                className="h-12 w-12 rounded-full border-2 p-0.5 object-cover"
                style={{ borderColor: themeColors.accent }}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2" style={{ borderColor: themeColors.accent, backgroundColor: themeColors.primary }}>
                <span className="text-xl font-bold" style={{ color: themeColors.secondary, fontFamily: 'var(--font-serif)' }}>
                  {restaurant.name[0]}
                </span>
              </div>
            )}
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{restaurant.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href={`/preview/${restaurant.slug}`} className="font-medium hover:opacity-80 transition-opacity">منو</Link>
            <Link href={`/preview/${restaurant.slug}/about`} className="font-medium hover:opacity-80 transition-opacity opacity-70">درباره ما</Link>
            <Link href={`/preview/${restaurant.slug}/contact`} className="font-medium hover:opacity-80 transition-opacity opacity-70">تماس با ما</Link>
          </nav>

          {/* Social and Contact - Desktop */}
          <div className="hidden items-center gap-4 md:flex border-r border-l px-6 mx-4" style={{ borderColor: `${themeColors.accent}40` }}>
            {restaurant.socialLinks?.instagram && (
              <a
                href={`https://instagram.com/${restaurant.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: themeColors.primary }}
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a
                href={`https://t.me/${restaurant.socialLinks.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: themeColors.primary }}
              >
                <Send className="h-5 w-5" />
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-2 mr-2 font-bold"
                dir="ltr"
                style={{ color: themeColors.primary }}
              >
                <Phone className="h-4 w-4" />
                <span>{restaurant.phone}</span>
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isCartEnabled && (
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full border" style={{ borderColor: themeColors.accent }}>
                    <ShoppingBag className="h-6 w-6" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-6 w-6 justify-center rounded-full p-0 text-xs" style={{ backgroundColor: themeColors.accent, color: themeColors.primary }}>
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-full flex-col sm:max-w-md p-0" style={{ backgroundColor: themeColors.background }}>
                  <SheetHeader className="p-6 border-b" style={{ borderColor: themeColors.accent }}>
                    <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                      <ShoppingBag className="h-6 w-6" />
                      سبد خرید
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto px-6 min-h-0">
                    {cart.length === 0 ? (
                      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
                        <ShoppingBag className="h-16 w-16 opacity-20" />
                        <p className="text-lg">سبد خرید شما خالی است</p>
                      </div>
                    ) : (
                      <div className="space-y-6 py-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0" style={{ borderColor: `${themeColors.accent}40` }}>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover border" style={{ borderColor: themeColors.accent }} />
                            )}
                            <div className="flex-1">
                              <h4 className="text-lg font-bold">{item.name}</h4>
                              <p className="text-sm opacity-70">{formatPrice(item.price)} {restaurant.settings.currency}</p>
                              <div className="mt-3 flex items-center gap-3">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, -1)} style={{ borderColor: themeColors.accent }}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center font-bold">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, 1)} style={{ borderColor: themeColors.accent }}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="flex flex-col gap-4 border-t p-6 mt-auto" style={{ borderColor: themeColors.accent }}>
                      <div className="flex w-full items-center justify-between text-xl font-bold">
                        <span>مجموع:</span>
                        <span>{formatPrice(cartTotal)} {restaurant.settings.currency}</span>
                      </div>
                      <Button className="w-full text-lg h-14 rounded-xl" onClick={handleCheckout} style={{ backgroundColor: themeColors.primary, color: themeColors.secondary }}>
                        تایید و پرداخت
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-12 w-12 rounded-full border" style={{ borderColor: themeColors.accent }}>
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full flex flex-col p-0 border-none" style={{ backgroundColor: themeColors.background }}>
                <SheetHeader className="p-10 border-b relative overflow-hidden" style={{ borderColor: themeColors.accent, backgroundColor: themeColors.secondary }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                  <SheetTitle className="text-3xl font-bold text-center relative z-10" style={{ color: themeColors.primary, fontFamily: 'var(--font-serif)' }}>{restaurant.name}</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 flex flex-col items-center justify-center gap-8 p-10">
                  <Link href={`/preview/${restaurant.slug}`} className="text-2xl font-bold hover:opacity-70 transition-all border-b-2 pb-2" style={{ borderColor: themeColors.accent }} onClick={() => setIsMenuOpen(false)}>صفحه اصلی (منو)</Link>
                  <Link href={`/preview/${restaurant.slug}/about`} className="text-2xl font-bold opacity-60 hover:opacity-100 hover:scale-110 transition-all" onClick={() => setIsMenuOpen(false)}>درباره ما</Link>
                  <Link href={`/preview/${restaurant.slug}/contact`} className="text-2xl font-bold opacity-60 hover:opacity-100 hover:scale-110 transition-all" onClick={() => setIsMenuOpen(false)}>تماس با ما</Link>
                  
                  <div className="mt-10 flex gap-6">
                    {restaurant.socialLinks?.instagram && (
                      <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-12 w-12 rounded-full border flex items-center justify-center" style={{ borderColor: themeColors.accent, color: themeColors.primary }}>
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-12 w-12 rounded-full border flex items-center justify-center" style={{ borderColor: themeColors.accent, color: themeColors.primary }}>
                        <Send className="h-6 w-6" />
                      </a>
                    )}
                    {restaurant.phone && (
                      <a href={`tel:${restaurant.phone}`} className="h-12 w-12 rounded-full border flex items-center justify-center" style={{ borderColor: themeColors.accent, color: themeColors.primary }}>
                        <Phone className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </nav>
                <div className="p-6 text-center text-xs opacity-40 border-t" style={{ borderColor: `${themeColors.accent}40` }}>
                  ساخته شده با عشق در ویترین ساز
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section - Traditional Style */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 py-16 text-center relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8 h-32 w-32 rounded-full border-4 p-1 shadow-2xl" 
            style={{ borderColor: themeColors.accent }}
          >
            {restaurant.logo ? (
              <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full" style={{ backgroundColor: themeColors.primary }}>
                <span className="text-4xl font-bold" style={{ color: themeColors.secondary }}>{restaurant.name[0]}</span>
              </div>
            )}
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-4xl font-bold md:text-5xl" 
            style={{ color: themeColors.primary }}
          >
            {restaurant.name}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl text-lg opacity-80"
          >
            {restaurant.description}
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}>
                <Button variant="outline" className="rounded-full px-6 border-2" style={{ borderColor: themeColors.accent, color: themeColors.primary }}>
                  <Phone className="ml-2 h-4 w-4" />
                  تماس با ما
                </Button>
              </a>
            )}
            <a href="#menu">
              <Button className="rounded-full px-8 h-11" style={{ backgroundColor: themeColors.accent, color: themeColors.primary }}>
                مشاهده منو
              </Button>
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main id="menu" className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative mx-auto max-w-xl mb-8">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="جستجو در منوی سنتی ما..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 bg-transparent py-4 pr-12 pl-6 text-lg focus:outline-none transition-all"
              style={{ borderColor: themeColors.accent }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              className="rounded-full px-6 border-2"
              style={{ 
                backgroundColor: activeCategory === null ? themeColors.primary : 'transparent',
                color: activeCategory === null ? themeColors.secondary : themeColors.primary,
                borderColor: themeColors.primary
              }}
              onClick={() => setActiveCategory(null)}
            >
              همه دسته‌ها
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id.toString() ? "default" : "outline"}
                className="rounded-full px-6 border-2"
                style={{ 
                  backgroundColor: activeCategory === category.id.toString() ? themeColors.primary : 'transparent',
                  color: activeCategory === category.id.toString() ? themeColors.secondary : themeColors.primary,
                  borderColor: themeColors.primary
                }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8"
          >
            {categories.map((category) => {
              const categoryProducts = filteredProducts.filter((p) => 
                p.category?.toString() === category.id.toString() || 
                p.categoryId?.toString() === category.id.toString()
              )
              if (categoryProducts.length === 0) return null
              if (activeCategory && activeCategory !== category.id.toString()) return null

              return (
                <section key={category.id}>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-1" style={{ backgroundColor: themeColors.accent }}></div>
                    <h2 className="text-3xl font-bold" style={{ color: themeColors.primary }}>{category.name}</h2>
                    <div className="h-px flex-1" style={{ backgroundColor: themeColors.accent }}></div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} restaurant={restaurant} onAddToCart={() => addToCart(product)} />
                    ))}
                  </div>
                </section>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 text-center border-t-2" style={{ backgroundColor: themeColors.secondary, borderColor: themeColors.accent }}>
        <div className="container mx-auto px-4">
          <h3 className="mb-4 text-2xl font-bold" style={{ color: themeColors.primary }}>{restaurant.name}</h3>
          <p className="mb-6 opacity-80">{restaurant.settings.address_line || restaurant.address}</p>
          <div className="flex justify-center gap-6 mb-8">
            {restaurant.socialLinks?.instagram && (
              <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="hover:opacity-70 transition-opacity">
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="hover:opacity-70 transition-opacity">
                <Send className="h-6 w-6" />
              </a>
            )}
          </div>
          <p className="text-sm opacity-60">ساخته شده با عشق در ویترین ساز</p>
        </div>
      </footer>
    </div>
  )
}

function ProductCard({ product, restaurant, onAddToCart }: { product: any, restaurant: any, onAddToCart: () => void }) {
  const title = product.title || product.name
  const description = product.description
  const price = product.price
  const isAvailable = product.is_available ?? product.isAvailable ?? true
  const isPopular = product.is_popular ?? product.isPopular
  const discountPercentage = product.discount_percentage || 0
  const isCartEnabled = restaurant.activePlugins?.includes('shopping_cart')
  
  const discountPrice = discountPercentage > 0 
    ? price * (1 - discountPercentage / 100) 
    : null

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`flex overflow-hidden rounded-2xl border-2 bg-white transition-all hover:shadow-xl ${!isAvailable ? 'opacity-70 grayscale-[0.5]' : ''}`} 
      style={{ borderColor: themeColors.accent }}
    >
      <div className="w-1/3 relative aspect-square">
        {product.image ? (
          <img src={product.image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: themeColors.secondary }}>
            <span className="opacity-20 font-bold text-xs">بدون تصویر</span>
          </div>
        )}
        {isPopular && (
          <div className="absolute top-0 right-0 rounded-bl-xl px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: themeColors.accent, color: themeColors.primary }}>
            محبوب
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold">ناموجود</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight" style={{ color: themeColors.primary }}>{title}</h3>
            {discountPercentage > 0 && isAvailable && (
              <Badge className="bg-red-500 hover:bg-red-600 text-[10px] px-1.5 h-5">{discountPercentage}%</Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs opacity-70 leading-relaxed">{description}</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
          {restaurant.settings.showPrices && (
            <div className="flex flex-col">
              {discountPrice ? (
                <>
                  <span className="text-[10px] line-through opacity-50 mb-0.5">{formatPrice(price)}</span>
                  <span className="font-bold text-lg leading-none" style={{ color: themeColors.primary }}>{formatPrice(discountPrice)} <span className="text-[10px] font-normal">{restaurant.settings.currency}</span></span>
                </>
              ) : (
                <span className="font-bold text-lg leading-none" style={{ color: themeColors.primary }}>{formatPrice(price)} <span className="text-[10px] font-normal">{restaurant.settings.currency}</span></span>
              )}
            </div>
          )}
          {isCartEnabled && (
            <Button 
              size="sm" 
              className="h-9 w-9 rounded-full p-0 shadow-lg" 
              disabled={!isAvailable} 
              onClick={onAddToCart}
              style={{ backgroundColor: themeColors.primary, color: themeColors.secondary }}
            >
              {isAvailable ? <Plus className="h-5 w-5" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
