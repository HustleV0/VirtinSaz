"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { formatPrice } from "@/lib/mock-data"
import {
  Menu as MenuIcon,
  Phone,
  MapPin,
  Instagram,
  Send,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ChevronRight,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

// Modern Premium Restaurant Theme
const themeColors = {
  primary: '#0f172a',    // Dark Navy / Slate
  accent: '#f59e0b',     // Amber / Gold
  background: '#020617', // Very Dark
  surface: '#1e293b',    // Lighter Slate
  text: '#f8fafc',
  muted: '#94a3b8',
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
  const isCartEnabled = restaurant.activePlugins?.includes('shopping_cart')
  const { scrollY } = useScroll()
  
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]
  )
  
  const navBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  )

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
    <div className="min-h-screen font-sans selection:bg-amber-500 selection:text-white" style={{ backgroundColor: themeColors.background, color: themeColors.text }} dir="rtl">
      
      {/* Premium Glass Navigation */}
      <motion.nav 
        style={{ backgroundColor: navBackground, backdropFilter: navBlur }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-all"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/preview/${restaurant.slug}`} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="h-7 w-7 object-contain" />
              ) : (
                <Star className="h-5 w-5 text-white fill-white" />
              )}
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {restaurant.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['منو', 'درباره ما', 'تماس'].map((item, idx) => (
              <Link 
                key={item}
                href={`/preview/${restaurant.slug}${idx === 0 ? '' : idx === 1 ? '/about' : '/contact'}`} 
                className="text-sm font-medium hover:text-amber-500 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <Button 
                variant="ghost" 
                size="icon" 
                className={`relative rounded-full hover:bg-white/10 text-white ${!isCartEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isCartEnabled}
                onClick={() => setIsCartOpen(true)}
             >
              <ShoppingBag className="h-5 w-5" />
              {isCartEnabled && cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Link href={`/preview/${restaurant.slug}/contact`}>
              <Button className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full px-6">
                رزرو میز
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Immersive Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={restaurant.coverImage || "/placeholder.jpg"} 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-1.5 rounded-full text-sm font-medium">
                ✨ تجربه طعمی متفاوت در {restaurant.name}
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8">
                هنر آشپزی <br />
                <span className="text-amber-500">مدرن</span> و اصیل
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                {restaurant.description || "ما با استفاده از تازه‌ترین مواد اولیه و دستور پخت‌های منحصر به فرد، تجربه‌ای فراموش‌نشدنی را برای شما رقم می‌زنیم."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="h-14 px-10 rounded-full text-lg font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xl shadow-amber-500/20"
                  onClick={() => {
                    const element = document.getElementById('menu');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  مشاهده منو
                </Button>
                <Link href={`/preview/${restaurant.slug}/contact`}>
                  <Button className="h-14 px-10 rounded-full text-lg font-bold bg-white text-slate-950 hover:bg-white/90 shadow-xl shadow-white/10 transition-all">
                    رزرو آنلاین
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Featured Info Grid */}
      <section className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "آدرس ما", desc: restaurant.settings?.address_line || "تهران، خیابان ولیعصر" },
              { icon: Phone, title: "تماس مستقیم", desc: restaurant.phone || "۰۲۱-۱۲۳۴۵۶۷۸" },
              { icon: Clock, title: "ساعات کاری", desc: "همه‌روزه از ۱۱:۰۰ الی ۲۳:۳۰" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-6 group hover:bg-white/[0.08] transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Header & Search */}
      <section className="py-20 bg-slate-950/50" id="menu">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="text-center md:text-right">
              <h2 className="text-4xl md:text-5xl font-black mb-4">منوی رستوران</h2>
              <p className="text-slate-500">بهترین طعم‌ها را از میان دسته‌بندی‌های ما انتخاب کنید</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="جستجو در منو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            <Button
              onClick={() => setActiveCategory(null)}
              variant={activeCategory === null ? 'default' : 'outline'}
              className={`rounded-full px-8 h-12 shrink-0 border-white/10 ${activeCategory === null ? 'bg-amber-500 text-slate-950' : 'text-white hover:bg-white/5'}`}
            >
              همه غذاها
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id.toString())}
                variant={activeCategory === cat.id.toString() ? 'default' : 'outline'}
                className={`rounded-full px-8 h-12 shrink-0 border-white/10 ${activeCategory === cat.id.toString() ? 'bg-amber-500 text-slate-950' : 'text-white hover:bg-white/5'}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Product Grid - Glassmorphism Cards */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory || searchQuery || 'all'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12"
            >
              {filteredProducts.map((product, index) => {
                const isAvailable = product.is_available ?? product.isAvailable ?? true
                const discountPercentage = product.discount_percentage || 0
                const discountPrice = discountPercentage > 0 
                  ? product.price * (1 - discountPercentage / 100) 
                  : null

                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex flex-col h-full bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.08] transition-all hover:border-amber-500/30"
                  >
                    {/* Image Wrapper */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-50' : ''}`} 
                          alt={product.name} 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-slate-700" />
                        </div>
                      )}
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {discountPercentage > 0 && (
                        <div className="absolute top-5 left-5 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                          {discountPercentage}% تخفیف
                        </div>
                      )}

                      {product.isPopular && (
                        <div className="absolute top-5 right-5 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                          محبوب
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">{product.name}</h3>
                        <div className="flex flex-col items-end shrink-0">
                          {discountPrice ? (
                            <>
                              <span className="text-amber-500 font-bold text-lg">{formatPrice(discountPrice)}</span>
                              <span className="text-xs line-through text-slate-500">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-8 flex-1">
                        {product.description || "توضیحاتی برای این غذا ثبت نشده است."}
                      </p>

                      <div className="mt-auto">
                        {!isCartEnabled ? (
                          <Button 
                            disabled 
                            className="w-full h-14 bg-slate-800 text-slate-500 font-bold rounded-2xl opacity-50"
                          >
                            غیرفعال
                          </Button>
                        ) : isAvailable ? (
                          <Button 
                            className="w-full h-14 bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-white font-bold rounded-2xl transition-all border border-white/5"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="h-4 w-4 ml-2" />
                            افزودن به سبد
                          </Button>
                        ) : (
                          <Button disabled className="w-full h-14 bg-slate-800 text-slate-500 font-bold rounded-2xl">
                            ناموجود
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Cart Sheet - Dark Premium */}
      {isCartEnabled && (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col bg-slate-950 border-white/5 text-white">
              <SheetHeader className="p-8 border-b border-white/5 flex-row justify-between items-center space-y-0">
                  <SheetTitle className="text-2xl font-black text-white flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-amber-500" />
                    سبد سفارشات
                  </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-8">
                  {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500">
                          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 opacity-20" />
                          </div>
                          <p className="text-xl font-bold">سبد خرید شما خالی است</p>
                      </div>
                  ) : (
                      <div className="space-y-6">
                          {cart.map(item => (
                              <div key={item.id} className="flex gap-6 group">
                                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shrink-0">
                                      {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-1 flex flex-col justify-between py-1">
                                      <div className="flex justify-between items-start">
                                          <h4 className="font-bold">{item.name}</h4>
                                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                      </div>
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                                              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"><Minus className="h-3 w-3" /></button>
                                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"><Plus className="h-3 w-3" /></button>
                                          </div>
                                          <span className="font-bold text-amber-500">{formatPrice(item.price * item.quantity)}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              {cart.length > 0 && (
                  <div className="p-8 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-8">
                          <span className="text-slate-400 font-medium">مجموع کل قابل پرداخت</span>
                          <span className="text-3xl font-black text-amber-500">{formatPrice(cartTotal)}</span>
                      </div>
                      <Button 
                        className="w-full h-16 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xl font-black rounded-2xl shadow-xl shadow-amber-500/20" 
                        onClick={handleCheckout}
                      >
                          ثبت و پرداخت سفارش
                      </Button>
                  </div>
              )}
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full flex flex-col p-10 bg-slate-950 text-white border-none">
            <SheetHeader className="sr-only">
                <SheetTitle>{restaurant.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-10 mt-10">
                {['منو', 'درباره ما', 'تماس'].map((item, idx) => (
                  <Link 
                    key={item}
                    href={`/preview/${restaurant.slug}${idx === 0 ? '' : idx === 1 ? '/about' : '/contact'}`} 
                    className="text-5xl font-black hover:text-amber-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
            </nav>
            <div className="mt-auto pt-10 border-t border-white/5">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mb-6">شبکه‌های اجتماعی</p>
                <div className="flex gap-8">
                    {restaurant.socialLinks?.instagram && (
                      <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                        <Instagram className="h-7 w-7" />
                      </a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a href={`https://t.me/${restaurant.socialLinks.telegram}`} target="_blank" rel="noopener noreferrer" className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                        <Send className="h-7 w-7" />
                      </a>
                    )}
                </div>
            </div>
        </SheetContent>
      </Sheet>

      {/* Modern Premium Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center">
                        <Star className="h-6 w-6 text-slate-950 fill-slate-950" />
                      </div>
                      <span className="text-3xl font-black">{restaurant.name}</span>
                    </div>
                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                      {restaurant.description || "تجربه‌ای متفاوت از طعم و هنر آشپزی در محیطی مدرن و دلنشین."}
                    </p>
                </div>
                <div className="space-y-8">
                    <h4 className="text-amber-500 font-bold text-lg uppercase tracking-wider">اطلاعات تماس</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-slate-500 shrink-0 mt-1" />
                        <p className="text-slate-300 font-medium">{restaurant.settings?.address_line || "تهران، خیابان ولیعصر"}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-slate-500 shrink-0" />
                        <p className="text-slate-300 font-medium" dir="ltr">{restaurant.phone || "۰۲۱-۱۲۳۴۵۶۷۸"}</p>
                      </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-amber-500 font-bold text-lg uppercase tracking-wider">ساعات پذیرایی</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>شنبه - چهارشنبه</span>
                        <span className="font-bold">۱۱:۰۰ - ۲۳:۰۰</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>پنجشنبه - جمعه</span>
                        <span className="font-bold">۱۲:۰۰ - ۲۴:۰۰</span>
                      </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-sm text-slate-500">
                  © 2024 <span className="text-white font-bold">Vitrinsaz</span>. تمامی حقوق محفوظ است.
                </p>
                <div className="flex gap-6">
                    {[Instagram, Send, Phone].map((Icon, i) => (
                      <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}
