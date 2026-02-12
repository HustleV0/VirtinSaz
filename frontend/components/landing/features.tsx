"use client"

import { 
  Palette, 
  Smartphone, 
  Zap, 
  Shield, 
  BarChart3, 
  CreditCard,
  Globe,
  Headphones
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Palette,
    title: "قالب‌های زیبا",
    description: "از بین قالب‌های حرفه‌ای انتخاب کنید و به سلیقه خود شخصی‌سازی کنید.",
  },
  {
    icon: Smartphone,
    title: "واکنش‌گرا",
    description: "وبسایت شما در تمام دستگاه‌ها به زیبایی نمایش داده می‌شود.",
  },
  {
    icon: Zap,
    title: "سرعت بالا",
    description: "وبسایت‌های فوق سریع برای بهترین تجربه کاربری مشتریان شما.",
  },
  {
    icon: Shield,
    title: "امنیت کامل",
    description: "با SSL رایگان و سیستم امنیتی پیشرفته، داده‌های شما امن است.",
  },
  {
    icon: BarChart3,
    title: "آمار و گزارشات",
    description: "بازدید، محبوب‌ترین محصولات و رفتار کاربران را تحلیل کنید.",
  },
  {
    icon: CreditCard,
    title: "درگاه پرداخت",
    description: "اتصال آسان به درگاه‌های پرداخت معتبر ایرانی.",
  },
  {
    icon: Globe,
    title: "دامنه اختصاصی",
    description: "دامنه اختصاصی خود را متصل کنید یا از زیردامنه رایگان استفاده کنید.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی ما همیشه آماده کمک به شماست.",
  },
]

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="features" className="border-t border-border bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            همه چیز برای موفقیت شما
          </h2>
          <p className="text-lg text-muted-foreground">
            امکانات کاملی که برای مدیریت حرفه‌ای حضور آنلاین خود نیاز دارید.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
