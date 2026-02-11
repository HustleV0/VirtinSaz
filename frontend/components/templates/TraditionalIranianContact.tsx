"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Phone, MapPin, Instagram, Mail, Send } from "lucide-react"
import { toast } from "sonner"

const themeColors = {
  primary: '#1e3a5f',
  secondary: '#f8f4e8',
  accent: '#c9a959',
  background: '#fffef9',
  text: '#1e3a5f',
}

export function TraditionalIranianContact({ restaurant }: { restaurant: Restaurant }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("پیام شما با مهر و دوستی دریافت شد")
  }

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
            <Link href={`/preview/${restaurant.slug}/about`} className="font-medium hover:opacity-80 transition-opacity opacity-70">درباره ما</Link>
            <Link href={`/preview/${restaurant.slug}/contact`} className="font-medium hover:opacity-80 transition-opacity">تماس با ما</Link>
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

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: themeColors.primary }}>پل ارتباطی ما</h1>
            <div className="w-32 h-1 bg-[#c9a959] mx-auto mb-6"></div>
            <p className="text-xl opacity-70">مشتاق شنیدن نظرات، پیشنهادات و انتقادات شما عزیزان هستیم.</p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white p-10 rounded-2xl shadow-xl border-t-4 text-center" style={{ borderColor: themeColors.accent }}>
                <div className="space-y-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center shrink-0 shadow-inner" style={{ backgroundColor: themeColors.secondary }}>
                      <Phone className="h-7 w-7" style={{ color: themeColors.primary }} />
                    </div>
                    <div>
                      <p className="text-sm opacity-50 mb-2">شماره تماس</p>
                      <p className="font-bold text-2xl" dir="ltr">{restaurant.phone || "۰۲۱-۲۲۳۳۴۴۵۵"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center shrink-0 shadow-inner" style={{ backgroundColor: themeColors.secondary }}>
                      <MapPin className="h-7 w-7" style={{ color: themeColors.primary }} />
                    </div>
                    <div>
                      <p className="text-sm opacity-50 mb-2">نشانی رستوران</p>
                      <p className="font-bold text-xl leading-relaxed">{restaurant.settings.address_line || restaurant.address || "تهران، خیابان شریعتی، بالاتر از پل رومی"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                    {restaurant.socialLinks?.instagram && (
                      <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-12 w-12 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white transition-all" style={{ borderColor: themeColors.primary }}>
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {restaurant.socialLinks?.telegram && (
                      <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-12 w-12 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white transition-all" style={{ borderColor: themeColors.primary }}>
                        <Send className="h-5 w-5" />
                      </a>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

       {/* Footer */}
      <footer className="py-12 border-t mt-20" style={{ borderColor: themeColors.accent }}>
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-40 text-sm">
             تمامی حقوق محفوظ است | ۱۴۰۳
          </p>
        </div>
      </footer>
    </div>
  )
}
