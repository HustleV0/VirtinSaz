"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Phone, MapPin, Instagram, Send, Mail, Star } from "lucide-react"
import { toast } from "sonner"

// Modern Premium Restaurant Theme
const themeColors = {
  primary: '#0f172a',    // Dark Navy / Slate
  accent: '#f59e0b',     // Amber / Gold
  background: '#020617', // Very Dark
  surface: '#1e293b',    // Lighter Slate
  text: '#f8fafc',
  muted: '#94a3b8',
}

export function ModernRestaurantContact({ restaurant }: { restaurant: Restaurant }) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("پیام شما با موفقیت ارسال شد")
  }

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
            {['منو', 'داستان ما', 'تماس'].map((item, idx) => (
              <Link 
                key={item}
                href={`/preview/${restaurant.slug}${idx === 0 ? '' : idx === 1 ? '/about' : '/contact'}`} 
                className={`text-sm font-medium transition-colors relative group ${idx === 2 ? 'text-amber-500' : 'text-white/70 hover:text-amber-500'}`}
              >
                {item}
                <span className={`absolute -bottom-1 right-0 h-0.5 bg-amber-500 transition-all ${idx === 2 ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-white/10 text-white"
             >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Button className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full px-6 shadow-lg shadow-amber-500/20">
              رزرو میز
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6 text-center md:text-right">
           <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-6 block"
            >
              CONTACT US
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12"
            >
              در ارتباط <br />
              <span className="text-white/10">باشید</span>
            </motion.h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Info */}
            <div className="lg:w-1/3 space-y-16">
               <div className="space-y-10">
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">تلفن</h3>
                    <p className="text-2xl font-bold font-mono" dir="ltr">{restaurant.phone || "۰۲۱-۸۸۹۹۰۰۱۱"}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">ایمیل</h3>
                    <p className="text-2xl font-bold">{restaurant.email || `hello@${restaurant.slug}.ir`}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 mb-4">آدرس</h3>
                    <p className="text-2xl font-bold leading-tight">
                      {restaurant.address || "تهران، برج میلاد، طبقه گردان"}
                    </p>
                  </div>
               </div>

               <div className="flex gap-4">
                  {restaurant.socialLinks?.instagram && (
                    <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {restaurant.socialLinks?.telegram && (
                    <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                      <Send className="h-6 w-6" />
                    </a>
                  )}
               </div>
            </div>

            {/* Form */}
            <div className="lg:w-2/3">
              <div className="p-10 md:p-16 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 mr-2">نام کامل</label>
                      <input 
                        type="text" 
                        placeholder="نام خود را وارد کنید"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-amber-500/50 focus:bg-white/10 outline-none transition-all font-bold text-lg"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-40 mr-2">ایمیل</label>
                      <input 
                        type="email" 
                        placeholder="ایمیل خود را وارد کنید"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-amber-500/50 focus:bg-white/10 outline-none transition-all font-bold text-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mr-2">پیام شما</label>
                    <textarea 
                      placeholder="پیام خود را اینجا بنویسید..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-amber-500/50 focus:bg-white/10 outline-none transition-all font-bold text-lg resize-none"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full h-20 rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all text-xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20"
                  >
                    ارسال پیام
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-20 px-6 mt-20">
        <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Star className="h-4 w-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">{restaurant.name}</span>
            </div>
           <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">
              © 2024 Powered by VitrinSaz
            </p>
        </div>
      </footer>
    </div>
  )
}
