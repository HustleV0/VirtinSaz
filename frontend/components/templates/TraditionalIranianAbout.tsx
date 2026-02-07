"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Clock, MapPin, Instagram, Phone, Star, Send } from "lucide-react"

const themeColors = {
  primary: '#1e3a5f',
  secondary: '#f8f4e8',
  accent: '#c9a959',
  background: '#fffef9',
  text: '#1e3a5f',
}

export function TraditionalIranianAbout({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: themeColors.background, borderColor: themeColors.accent }}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href={`/preview/${restaurant.slug}`} className="flex items-center gap-3">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
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

          <nav className="hidden items-center gap-8 md:flex">
            <Link href={`/preview/${restaurant.slug}`} className="font-medium hover:opacity-80 transition-opacity opacity-70">منو</Link>
            <Link href={`/preview/${restaurant.slug}/about`} className="font-medium hover:opacity-80 transition-opacity">درباره ما</Link>
            <Link href={`/preview/${restaurant.slug}/contact`} className="font-medium hover:opacity-80 transition-opacity opacity-70">تماس با ما</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full border" style={{ borderColor: themeColors.accent }}>
              <ShoppingBag className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden h-12 w-12 rounded-full border" style={{ borderColor: themeColors.accent }}>
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden border-b" style={{ borderColor: themeColors.accent }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-serif)', color: themeColors.primary }}
          >
            اصالت و طعم
          </motion.h1>
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#c9a959] to-transparent mx-auto mb-8"></div>
          <p className="text-xl max-w-2xl mx-auto opacity-80 leading-loose">
            سفری به اعماق فرهنگ و تمدن ایران با طعم‌هایی که از نسل‌های پیشین به یادگار مانده است.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>داستان ما</h2>
              <p className="text-lg leading-loose opacity-80">
                در {restaurant.name}، ما نه تنها غذا سرو می‌کنیم، بلکه روایتی از میهمان‌نوازی اصیل ایرانی را بازگو می‌کنیم. 
                هر بشقاب غذا با دقت و وسواسی مثال‌زدنی، با استفاده از مرغوب‌ترین برنج ایرانی و گوشت تازه تهیه می‌شود.
              </p>
              <p className="text-lg leading-loose opacity-80">
                افتخار ما این است که لبخند رضایت را بر لبان میهمانانمان بنشانیم و لحظاتی خوش در محیطی سنتی و دلنشین برایشان فراهم آوریم.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="rounded-full px-8 h-12" style={{ backgroundColor: themeColors.primary, color: themeColors.secondary }}>
                  مشاهده منو
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-full border-8 overflow-hidden shadow-2xl p-2" style={{ borderColor: themeColors.accent }}>
                <img 
                  src={restaurant.coverImage || "/placeholder.jpg"} 
                  className="w-full h-full object-cover rounded-full"
                  alt="Traditional Iranian Kitchen"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border-2" style={{ borderColor: themeColors.accent }}>
                <div className="flex gap-1 text-[#c9a959] mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="font-bold">برترین رستوران سال</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" style={{ backgroundColor: themeColors.secondary }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2" style={{ borderColor: themeColors.accent }}>
                <Clock className="h-8 w-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold">میزبانی ما</h3>
              <p className="opacity-70">همه روزه از ساعت ۱۰ صبح تا ۱۱ شب پذیرای شما هستیم.</p>
            </div>
            <div className="space-y-4">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2" style={{ borderColor: themeColors.accent }}>
                <MapPin className="h-8 w-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold">نشانی ما</h3>
              <p className="opacity-70">{restaurant.address || "تهران، خیابان شریعتی، بالاتر از پل رومی"}</p>
            </div>
            <div className="space-y-4">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2" style={{ borderColor: themeColors.accent }}>
                <Phone className="h-8 w-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold">تماس با ما</h3>
              <p className="opacity-70" dir="ltr">{restaurant.phone || "۰۲۱-۲۲۳۳۴۴۵۵"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t" style={{ borderColor: themeColors.accent }}>
        <div className="container mx-auto px-4 text-center">
           <div className="flex justify-center gap-6 mb-8">
            {restaurant.socialLinks?.instagram && (
              <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-12 w-12 rounded-full border flex items-center justify-center hover:bg-[#c9a959]/10 transition-colors" style={{ borderColor: themeColors.accent }}>
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-12 w-12 rounded-full border flex items-center justify-center hover:bg-[#c9a959]/10 transition-colors" style={{ borderColor: themeColors.accent }}>
                <Send className="h-6 w-6" />
              </a>
            )}
          </div>
          <p className="opacity-50 font-medium">
             © ۱۴۰۳ {restaurant.name} | ساخته شده در ویترین ساز
          </p>
        </div>
      </footer>
    </div>
  )
}
