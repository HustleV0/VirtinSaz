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
  title: "وفینو | سایت خود را در کمتر از 2 دقیقه بسازید",
  description:
    "با وفینو بدون نیاز به دانش فنی، سایت فروشگاهی، سایت رستورانی و سایت کافه خود را سریع راه اندازی کنید.",
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
