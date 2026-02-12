import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Templates } from "@/components/landing/templates"
import { Stats } from "@/components/landing/stats"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'ویترین ساز | ساخت وبسایت حرفه‌ای در ۵ دقیقه',
  description: 'با ویترین ساز بدون نیاز به دانش فنی، سایت مدرن و خاص خود را بسازید. دارای تم‌های آماده و قابلیت شخصی‌سازی کامل برای تمامی کسب‌وکارها.',
}

export const revalidate = 3600

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <Templates />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
