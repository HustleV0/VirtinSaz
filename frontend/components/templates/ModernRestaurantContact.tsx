"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Restaurant } from "@/types"
import { ShoppingBag, Menu as MenuIcon, Phone, MapPin, Instagram, Send, Mail } from "lucide-react"
import { toast } from "sonner"

const themeColors = {
  primary: '#2d3436',
  secondary: '#dfe6e9',
  accent: '#e17055',
  background: '#fafafa',
  text: '#2d3436',
}

export function ModernRestaurantContact({ restaurant }: { restaurant: Restaurant }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("پیام شما با موفقیت ارسال شد")
  }

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
            <Link href={`/preview/${restaurant.slug}/about`} className="text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">داستان ما</Link>
            <Link href={`/preview/${restaurant.slug}/contact`} className="text-sm font-bold uppercase tracking-widest hover:text-[#e17055] transition-colors">تماس</Link>
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
      <section className="pt-40 pb-20 bg-black text-white">
        <div className="container mx-auto px-6">
           <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#e17055] font-black uppercase tracking-[0.3em] text-sm mb-6 block"
            >
              contact us
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12"
            >
              در ارتباط <br />
              <span className="text-white/20">باشید</span>
            </motion.h1>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32">
            {/* Info */}
            <div className="lg:w-1/3 space-y-20">
               <div className="space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#e17055]">تلفن</h3>
                    <p className="text-2xl font-black" dir="ltr">{restaurant.phone || "۰۲۱-۸۸۹۹۰۰۱۱"}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#e17055]">ایمیل</h3>
                    <p className="text-2xl font-black">{restaurant.email || `hello@${restaurant.slug}.ir`}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#e17055]">آدرس</h3>
                    <p className="text-2xl font-black leading-tight">
                      {restaurant.address || "تهران، برج میلاد، طبقه گردان"}
                    </p>
                  </div>
               </div>

               <div className="flex gap-8">
                  {restaurant.socialLinks?.instagram && (
                    <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="h-16 w-16 bg-black text-white flex items-center justify-center hover:bg-[#e17055] transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {restaurant.socialLinks?.telegram && (
                    <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="h-16 w-16 bg-black text-white flex items-center justify-center hover:bg-[#e17055] transition-colors">
                      <Send className="h-6 w-6" />
                    </a>
                  )}
               </div>
            </div>

            {/* Form */}
            <div className="lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40">نام کامل</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full bg-transparent border-b-2 border-black/10 py-4 focus:border-[#e17055] outline-none transition-all font-bold text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40">ایمیل</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full bg-transparent border-b-2 border-black/10 py-4 focus:border-[#e17055] outline-none transition-all font-bold text-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest opacity-40">پیام شما</label>
                  <textarea 
                    placeholder="Tell us something..."
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-black/10 py-4 focus:border-[#e17055] outline-none transition-all font-bold text-xl resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="h-20 px-16 rounded-none bg-black text-white hover:bg-[#e17055] transition-colors text-xl font-black uppercase tracking-widest"
                >
                  ارسال پیام
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6 mt-20">
        <div className="container mx-auto text-center">
           <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-30">
              © 2024 Powered by MenuSaz
            </p>
        </div>
      </footer>
    </div>
  )
}
