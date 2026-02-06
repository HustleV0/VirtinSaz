"use client"

import Link from "next/link"
import { Instagram, Send, Phone } from "lucide-react"
import { motion } from "framer-motion"

const footerLinks = {
  product: {
    title: "محصول",
    links: [
      { href: "/#features", label: "امکانات" },
      { href: "/pricing", label: "تعرفه‌ها" },
      { href: "/#templates", label: "قالب‌ها" },
      { href: "/#faq", label: "سوالات متداول" },
    ],
  },
  company: {
    title: "شرکت",
    links: [
      { href: "/about", label: "درباره ما" },
      { href: "/blog", label: "وبلاگ" },
      { href: "/contact", label: "تماس با ما" },
      { href: "/careers", label: "فرصت‌های شغلی" },
    ],
  },
  legal: {
    title: "قوانین",
    links: [
      { href: "/privacy", label: "حریم خصوصی" },
      { href: "/terms", label: "شرایط استفاده" },
      { href: "/refund", label: "شرایط بازگشت وجه" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">م</span>
              </div>
              <span className="text-xl font-bold">منوساز</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              پلتفرم ساخت وبسایت برای رستوران‌ها و کافه‌ها. به سادگی وبسایت حرفه‌ای
              خود را بسازید و کسب‌وکارتان را آنلاین کنید.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/menusaz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">اینستاگرام</span>
              </a>
              <a
                href="https://t.me/menusaz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">تلگرام</span>
              </a>
              <a
                href="tel:02112345678"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Phone className="h-5 w-5" />
                <span className="sr-only">تلفن</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © ۱۴۰۴ منوساز. تمامی حقوق محفوظ است.
          </p>
          <p className="text-sm text-muted-foreground">
            ساخته شده با عشق در ایران
          </p>
        </div>
      </motion.div>
    </footer>
  )
}
