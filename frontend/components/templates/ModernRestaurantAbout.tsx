"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Clock, MapPin, Instagram, Send, Phone, Star } from "lucide-react"

const themeColors = {
  primary: '#2d3436',
  secondary: '#dfe6e9',
  accent: '#e17055',
  background: '#fafafa',
  text: '#2d3436',
}

export function ModernRestaurantAbout({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Sleek Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/preview/${restaurant.slug}`} className="text-2xl font-black tracking-tighter uppercase">
            {restaurant.name}
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/preview/${restaurant.slug}`} className="text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">منو</Link>
            <Link href={`/preview/${restaurant.slug}/about`} className="text-sm font-bold uppercase tracking-widest hover:text-[#e17055] transition-colors">داستان ما</Link>
            <Link href={`/preview/${restaurant.slug}/contact`} className="text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">تماس</Link>
          </div>

          <div className="flex items-center gap-4">
             <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-black hover:text-white transition-all"
             >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20">
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={restaurant.coverImage || "/placeholder.jpg"} 
            className="absolute inset-0 w-full h-full object-cover"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white px-6 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#e17055] font-black uppercase tracking-[0.3em] text-sm mb-4"
            >
              since 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8"
            >
              داستان ما
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase tracking-tight leading-tight">
                  ترکیبی از هنر آشپزی <br />
                  <span className="text-[#e17055]">و مدرنیته</span>
                </h2>
                <div className="h-1 w-20 bg-black"></div>
              </div>
              <p className="text-xl opacity-60 leading-relaxed font-light">
                در {restaurant.name}، ما معتقدیم که هر وعده غذایی باید یک تجربه هنری باشد. 
                تیم سرآشپزان ما با بهره‌گیری از تکنیک‌های نوین و مواد اولیه ارگانیک، 
                طعم‌هایی را خلق می‌کنند که در ذهن شما ماندگار خواهد شد.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div>
                  <h4 className="text-3xl font-black mb-2">۱۰۰٪</h4>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40">مواد اولیه تازه</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black mb-2">۵۰+</h4>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-40">آیتم‌های منو</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-[4/5] bg-gray-100">
                 <img 
                  src={restaurant.logo || "/placeholder.jpg"} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  alt="Modern Restaurant Detail"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-[#e17055] p-10 text-white hidden md:block">
                <Star className="h-10 w-10 mb-4 fill-white" />
                <p className="text-xl font-black leading-tight italic">
                  "بهترین تجربه <br /> غذایی در شهر"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-32 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-12 bg-white border-b-4 border-black hover:border-[#e17055] transition-colors group">
              <Clock className="h-10 w-10 mb-8 group-hover:text-[#e17055] transition-colors" />
              <h3 className="text-xl font-black uppercase mb-4">زمان ما</h3>
              <p className="opacity-50 text-sm leading-loose">
                شنبه تا چهارشنبه: ۱۰:۰۰ الی ۲۳:۰۰ <br />
                آخر هفته‌ها: ۱۰:۰۰ الی ۲۴:۰۰
              </p>
            </div>
            <div className="p-12 bg-white border-b-4 border-black hover:border-[#e17055] transition-colors group">
              <MapPin className="h-10 w-10 mb-8 group-hover:text-[#e17055] transition-colors" />
              <h3 className="text-xl font-black uppercase mb-4">مکان ما</h3>
              <p className="opacity-50 text-sm leading-loose">
                {restaurant.address || "تهران، برج میلاد، طبقه گردان"}
              </p>
            </div>
            <div className="p-12 bg-white border-b-4 border-black hover:border-[#e17055] transition-colors group">
              <Phone className="h-10 w-10 mb-8 group-hover:text-[#e17055] transition-colors" />
              <h3 className="text-xl font-black uppercase mb-4">تماس</h3>
              <p className="opacity-50 text-sm leading-loose" dir="ltr">
                {restaurant.phone || "۰۲۱-۸۸۹۹۰۰۱۱"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-4xl font-black tracking-tighter uppercase">{restaurant.name}</div>
            <div className="flex gap-12">
               {restaurant.socialLinks?.instagram && (
                <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="opacity-50 hover:opacity-100 transition-opacity">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
               {restaurant.socialLinks?.telegram && (
                <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="opacity-50 hover:opacity-100 transition-opacity">
                  <Send className="h-6 w-6" />
                </a>
              )}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">
              © 2024 Powered by MenuSaz
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
