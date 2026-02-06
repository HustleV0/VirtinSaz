"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Restaurant } from "@/types"
import { Clock, MapPin, Instagram, Send, Phone, ArrowRight } from "lucide-react"

export function MinimalCafeAbout({ restaurant }: { restaurant: Restaurant }) {
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
              className="text-sm font-medium text-foreground"
            >
              درباره ما
            </Link>
            <Link
              href={`/preview/${restaurant.slug}/contact`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">درباره {restaurant.name}</h1>
            <p className="mt-4 text-xl text-muted-foreground">
              {restaurant.description}
            </p>
          </motion.div>

          {restaurant.coverImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 overflow-hidden rounded-2xl border bg-muted"
            >
              <img
                src={restaurant.coverImage}
                alt={restaurant.name}
                className="aspect-[2/1] w-full object-cover"
              />
            </motion.div>
          )}

          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">داستان ما</h2>
              <p className="leading-relaxed text-muted-foreground">
                ما در {restaurant.name} با عشق و علاقه به هنر آشپزی، تلاش می‌کنیم تا بهترین لحظات را برای شما رقم بزنیم. 
                استفاده از مواد اولیه تازه و با کیفیت، اولویت اصلی ما در تهیه غذاهاست.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                هدف ما فراتر از سرو یک وعده غذایی است؛ ما می‌خواهیم تجربه‌ای ماندگار از طعم و آرامش را به شما هدیه دهیم.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">ساعات کاری</h3>
                  <p className="mt-1 text-muted-foreground">شنبه تا چهارشنبه: ۱۰:۰۰ - ۲۳:۰۰</p>
                  <p className="text-muted-foreground">پنج‌شنبه و جمعه: ۱۰:۰۰ - ۲۴:۰۰</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">آدرس</h3>
                  <p className="mt-1 text-muted-foreground">{restaurant.address || "تهران، خیابان ولیعصر"}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground"
          >
            <h2 className="text-3xl font-bold">منتظر حضور گرم شما هستیم</h2>
            <p className="mt-4 opacity-90">همین حالا منوی ما را بررسی کنید و سفارش دهید</p>
            <Link href={`/preview/${restaurant.slug}`}>
              <Button size="lg" variant="secondary" className="mt-8 rounded-full px-8">
                مشاهده منو
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8">
            {restaurant.socialLinks?.instagram && (
              <a href={`https://instagram.com/${restaurant.socialLinks.instagram}`} className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {restaurant.socialLinks?.telegram && (
              <a href={`https://t.me/${restaurant.socialLinks.telegram}`} className="text-muted-foreground hover:text-foreground">
                <Send className="h-6 w-6" />
              </a>
            )}
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="text-muted-foreground hover:text-foreground">
                <Phone className="h-6 w-6" />
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {restaurant.name}. ساخته شده با منوساز
          </p>
        </div>
      </footer>
    </div>
  )
}
