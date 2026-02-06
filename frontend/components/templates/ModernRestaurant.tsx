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
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

// Modern Restaurant Colors
const themeColors = {
  primary: '#2d3436',
  secondary: '#dfe6e9',
  accent: '#e17055',
  background: '#fafafa',
  text: '#2d3436',
}

export function ModernRestaurant({ 
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

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Sleek Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/preview/${restaurant.id}`} className="flex items-center gap-2 text-2xl font-black tracking-tighter uppercase">
            {restaurant.logo && (
              <img src={restaurant.logo} alt={restaurant.name} className="h-10 w-10 object-cover rounded-sm" />
            )}
            {restaurant.name}
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/preview/${restaurant.id}`} className="text-sm font-bold uppercase tracking-widest hover:text-[#e17055] transition-colors">منو</Link>
            <Link href={`/preview/${restaurant.id}/about`} className="text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">داستان ما</Link>
            <Link href={`/preview/${restaurant.id}/contact`} className="text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">تماس</Link>
          </div>

          {/* Social and Contact - Desktop */}
          <div className="hidden items-center gap-4 md:flex border-x px-6">
            {restaurant.socialLinks?.instagram && (
              <a
                href={`https://instagram.com/${restaurant.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e17055] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a
                href={`https://t.me/${restaurant.socialLinks.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e17055] transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-2 mr-2 font-bold text-sm tracking-tighter"
                dir="ltr"
              >
                <Phone className="h-4 w-4 text-[#e17055]" />
                <span>{restaurant.phone}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-black hover:text-white transition-all"
                onClick={() => setIsCartOpen(true)}
             >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e17055] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="pt-20">
        <div className="flex flex-col lg:flex-row min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative min-h-[400px]"
          >
            <img 
                src={restaurant.coverImage || "/placeholder.jpg"} 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Modern Restaurant Hero"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-center px-10 lg:px-20 py-20 bg-white"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center justify-center rounded-md border text-xs font-medium bg-primary text-primary-foreground w-fit mb-6 px-4 py-1" 
              style={{ backgroundColor: themeColors.accent }}
            >
              خوش آمدید
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1]"
            >
              {restaurant.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl opacity-60 max-w-lg mb-12 leading-relaxed"
            >
              {restaurant.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button className="h-14 px-10 rounded-none text-lg font-bold" style={{ backgroundColor: themeColors.primary }}>رزرو میز</Button>
              <Button variant="outline" className="h-14 px-10 rounded-none text-lg font-bold border-2">تماس</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menu Categories Horizontal Scroll */}
      <section className="sticky top-20 z-40 bg-white border-b overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-6 h-16 flex items-center gap-8 min-w-max">
            <button 
                onClick={() => setActiveCategory(null)}
                className={`text-sm font-bold uppercase tracking-tighter transition-all ${activeCategory === null ? 'text-[#e17055] border-b-2 border-[#e17055]' : 'opacity-40 hover:opacity-100'} h-full px-2`}
            >
                همه دسته‌ها
            </button>
            {categories.map(cat => (
                <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id.toString())}
                    className={`text-sm font-bold uppercase tracking-tighter transition-all ${activeCategory === cat.id.toString() ? 'text-[#e17055] border-b-2 border-[#e17055]' : 'opacity-40 hover:opacity-100'} h-full px-2`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
      </section>

      {/* Main Menu Grid */}
      <main className="container mx-auto px-6 py-20">
        <div className="mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#e17055]">منوی انتخابی</span>
                    <h2 className="text-4xl font-black">غذاهای ما</h2>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30" />
                    <input 
                        type="text" 
                        placeholder="جستجو..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-black/10 py-2 pl-10 focus:border-[#e17055] outline-none transition-all"
                    />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory || searchQuery || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
              >
                  {filteredProducts.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                          <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100">
                              {product.image && (
                                  <img 
                                      src={product.image} 
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                      alt={product.name} 
                                  />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                      className="rounded-none h-12 px-8 font-bold bg-[#e17055]"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          addToCart(product);
                                      }}
                                  >
                                      افزودن به سبد
                                  </Button>
                              </div>
                              {product.isPopular && (
                                  <Badge className="absolute top-4 right-4 rounded-none bg-black">محبوب</Badge>
                              )}
                          </div>
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold group-hover:text-[#e17055] transition-colors">{product.name}</h3>
                              {restaurant.settings.showPrices && (
                                  <div className="flex flex-col items-end">
                                      {product.discountPrice ? (
                                          <>
                                              <span className="font-bold">{formatPrice(product.discountPrice)} {restaurant.settings.currency}</span>
                                              <span className="text-[10px] line-through opacity-30">{formatPrice(product.price)}</span>
                                          </>
                                      ) : (
                                          <span className="font-bold">{formatPrice(product.price)} {restaurant.settings.currency}</span>
                                      )}
                                  </div>
                              )}
                          </div>
                          <p className="text-sm opacity-50 line-clamp-2 leading-relaxed mb-6">{product.description}</p>
                          <Button 
                              className="w-full rounded-none h-12 font-bold uppercase tracking-widest text-xs" 
                              style={{ backgroundColor: themeColors.primary }}
                              onClick={() => addToCart(product)}
                          >
                              سفارش دهید
                          </Button>
                      </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
        </div>
      </main>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col rounded-none border-none [&>button]:text-white">
            <SheetHeader className="p-8 bg-black text-white flex-row justify-between items-center space-y-0">
                <SheetTitle className="text-2xl font-black uppercase tracking-tighter text-white">سبد خرید</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <ShoppingBag className="h-20 w-20 mb-4" />
                        <p className="text-xl font-bold">خالی است</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-6">
                                <div className="w-20 h-24 bg-gray-100 shrink-0">
                                    {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="font-bold">{item.name}</h4>
                                        <p className="text-sm opacity-50">{formatPrice(item.price)} {restaurant.settings.currency}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
                                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100">حذف</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {cart.length > 0 && (
                <div className="p-8 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold uppercase tracking-widest opacity-50">جمع کل</span>
                        <span className="text-2xl font-black">{formatPrice(cartTotal)} {restaurant.settings.currency}</span>
                    </div>
                    <Button className="w-full h-16 rounded-none text-lg font-black uppercase tracking-tighter" onClick={handleCheckout} style={{ backgroundColor: themeColors.primary }}>
                        نهایی کردن سفارش
                    </Button>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full flex flex-col p-10 bg-black text-white border-none [&>button]:text-white">
            <SheetHeader className="sr-only">
                <SheetTitle>{restaurant.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-8">
                <Link href={`/preview/${restaurant.slug}`} className="text-4xl font-black uppercase tracking-tighter hover:text-[#e17055]" onClick={() => setIsMenuOpen(false)}>منو</Link>
                <Link href={`/preview/${restaurant.slug}/about`} className="text-4xl font-black uppercase tracking-tighter opacity-40 hover:opacity-100" onClick={() => setIsMenuOpen(false)}>داستان ما</Link>
                <Link href={`/preview/${restaurant.slug}/contact`} className="text-4xl font-black uppercase tracking-tighter opacity-40 hover:opacity-100" onClick={() => setIsMenuOpen(false)}>تماس</Link>
            </nav>
            <div className="mt-auto">
                <p className="text-sm opacity-40 font-bold uppercase tracking-widest mb-4">دنبال کنید</p>
                <div className="flex gap-6">
                    {restaurant.socialLinks?.instagram && (
                      <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a href={`https://t.me/${restaurant.socialLinks.telegram}`} target="_blank" rel="noopener noreferrer">
                        <Send className="h-6 w-6" />
                      </a>
                    )}
                </div>
            </div>
        </SheetContent>
      </Sheet>

      {/* Modern Footer */}
      <footer className="bg-black text-white py-24">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-20">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter uppercase">{restaurant.name}</h2>
                    <p className="text-xl opacity-50 max-w-xl leading-relaxed">{restaurant.description}</p>
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#e17055] mb-2">موقعیت</p>
                        <p className="font-bold">{restaurant.address}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#e17055] mb-2">رزرو</p>
                        <p className="font-bold">{restaurant.phone}</p>
                    </div>
                </div>
            </div>
            <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs opacity-40 uppercase font-bold tracking-widest">© 2024 MENUSAZ - ALL RIGHTS RESERVED</p>
                <div className="flex gap-10">
                    {restaurant.socialLinks?.instagram && (
                      <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">اینستاگرام</a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a href={`https://t.me/${restaurant.socialLinks.telegram}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">تلگرام</a>
                    )}
                    {restaurant.socialLinks?.whatsapp && (
                      <a href={`https://wa.me/${restaurant.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">واتساپ</a>
                    )}
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}
