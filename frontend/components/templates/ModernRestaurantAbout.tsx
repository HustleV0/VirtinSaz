"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Clock, MapPin, Instagram, Send, Phone, Star } from "lucide-react"

// Modern Premium Restaurant Theme
const themeColors = {
  primary: '#0f172a',    // Dark Navy / Slate
  accent: '#f59e0b',     // Amber / Gold
  background: '#020617', // Very Dark
  surface: '#1e293b',    // Lighter Slate
  text: '#f8fafc',
  muted: '#94a3b8',
}

export function ModernRestaurantAbout({ restaurant }: { restaurant: Restaurant }) {
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
                className={`text-sm font-medium transition-colors relative group ${idx === 1 ? 'text-amber-500' : 'text-white/70 hover:text-amber-500'}`}
              >
                {item}
                <span className={`absolute -bottom-1 right-0 h-0.5 bg-amber-500 transition-all ${idx === 1 ? 'w-full' : 'w-0 group-hover:w-full'}`} />
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
            <Link href={`/preview/${restaurant.slug}/contact`}>
              <Button className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full px-6 shadow-lg shadow-amber-500/20">
                رزرو میز
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
          <img 
            src={restaurant.coverImage || "/placeholder.jpg"} 
            className="w-full h-full object-cover scale-105"
            alt="About Hero"
          />
        </div>
        
        <div className="relative z-20 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-4"
          >
            EST. 2024
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8"
          >
            داستان ما
          </motion.h1>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full" />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  ترکیبی از <span className="text-amber-500">هنر آشپزی</span> <br />
                  و مدرنیته
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-light max-w-xl">
                  در {restaurant.name}، ما معتقدیم که هر وعده غذایی باید یک تجربه هنری باشد. 
                  تیم سرآشپزان ما با بهره‌گیری از تکنیک‌های نوین و مواد اولیه ارگانیک، 
                  طعم‌هایی را خلق می‌کنند که در ذهن شما ماندگار خواهد شد.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <h4 className="text-4xl font-black text-amber-500 mb-2">۱۰۰٪</h4>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">مواد اولیه تازه</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <h4 className="text-4xl font-black text-amber-500 mb-2">۵۰+</h4>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">آیتم‌های منو</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                 <img 
                  src={restaurant.logo || "/placeholder.jpg"} 
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Modern Restaurant Detail"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-amber-500 p-10 rounded-3xl text-slate-950 hidden md:block shadow-2xl shadow-amber-500/20">
                <Star className="h-10 w-10 mb-4 fill-slate-950" />
                <p className="text-xl font-black leading-tight italic">
                  "بهترین تجربه <br /> غذایی در شهر"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-32 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "زمان ما", desc: "شنبه تا چهارشنبه: ۱۰:۰۰ الی ۲۳:۰۰\nآخر هفته‌ها: ۱۰:۰۰ الی ۲۴:۰۰" },
              { icon: MapPin, title: "مکان ما", desc: restaurant.address || "تهران، برج میلاد، طبقه گردان" },
              { icon: Phone, title: "تماس", desc: restaurant.phone || "۰۲۱-۸۸۹۹۰۰۱۱", ltr: true }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-950 border border-white/5 hover:border-amber-500/50 transition-all group">
                <item.icon className="h-10 w-10 mb-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className={`text-slate-400 leading-loose whitespace-pre-line ${item.ltr ? 'font-mono' : ''}`} dir={item.ltr ? 'ltr' : 'rtl'}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Star className="h-4 w-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">{restaurant.name}</span>
            </div>
            
            <div className="flex gap-8">
               {restaurant.socialLinks?.instagram && (
                <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
               {restaurant.socialLinks?.telegram && (
                <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all">
                  <Send className="h-5 w-5" />
                </a>
              )}
            </div>
            
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">
              © 2024 Powered by VitrinSaz
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
