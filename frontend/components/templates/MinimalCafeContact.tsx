"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Restaurant } from "@/types"
import { Phone, MapPin, Mail, Instagram, Send, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function MinimalCafeContact({ restaurant }: { restaurant: Restaurant }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("پیام شما با موفقیت ارسال شد")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/preview/${restaurant.slug}`} className="flex items-center gap-2">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
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

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href={`/preview/${restaurant.slug}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
              className="text-sm font-medium text-foreground"
            >
              تماس با ما
            </Link>
          </nav>

          <Link href={`/preview/${restaurant.slug}`} className="md:hidden">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight">با ما در ارتباط باشید</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              سوالی دارید یا می‌خواهید نظری بدهید؟ ما همیشه آماده شنیدن صدای شما هستیم.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="rounded-2xl border p-8 space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">تلفن تماس</h3>
                    <p className="mt-1 text-muted-foreground" dir="ltr">{restaurant.phone || "۰۲۱-۱۲۳۴۵۶۷۸"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">آدرس</h3>
                    <p className="mt-1 text-muted-foreground">{restaurant.address || "تهران، خیابان ولیعصر"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ایمیل</h3>
                    <p className="mt-1 text-muted-foreground">{restaurant.email || `info@${restaurant.slug}.ir`}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                {restaurant.socialLinks?.instagram && (
                  <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="flex h-14 w-14 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {restaurant.socialLinks?.telegram && (
                  <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="flex h-14 w-14 items-center justify-center rounded-full border bg-card text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <Send className="h-6 w-6" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-card p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">نام و نام خانوادگی</label>
                    <Input placeholder="مثلا: علی محمدی" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">شماره تماس</label>
                    <Input placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="rounded-xl" dir="ltr" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">موضوع</label>
                  <Input placeholder="چطور می‌توانیم به شما کمک کنیم؟" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">پیام شما</label>
                  <Textarea placeholder="پیام خود را اینجا بنویسید..." className="min-h-[150px] rounded-xl resize-none" required />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold">
                  ارسال پیام
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {restaurant.name}. ساخته شده با منوساز
          </p>
        </div>
      </footer>
    </div>
  )
}
