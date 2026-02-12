import React from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "درباره ما | ویترین ساز",
  description: "ویترین ساز پلتفرمی نوآورانه برای حضور آنلاین و دیجیتال‌سازی تمامی کسب‌وکارها در ایران است.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            <h1 className="text-4xl font-bold text-center">درباره ما</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-xl text-muted-foreground text-center">
                ویترین ساز پلتفرمی نوآورانه برای حضور آنلاین و دیجیتال‌سازی تمامی کسب‌وکارها در ایران است.
              </p>
              <div className="mt-12 grid gap-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">داستان ما</h2>
                  <p>
                    ما فعالیت خود را با هدف ساده‌سازی فرآیند آنلاین شدن تمامی کسب‌وکارها آغاز کردیم. 
                    امروز صدها برند و کسب‌وکار از خدمات ما برای مدیریت حضور آنلاین و وبسایت اختصاصی خود استفاده می‌کنند.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold mb-4">مأموریت ما</h2>
                  <p>
                    مأموریت ما ارائه ابزارهای حرفه‌ای و در عین حال ساده برای رشد کسب‌وکارهای کوچک و بزرگ است. 
                    ما معتقدیم هر کسب‌وکاری شایسته داشتن یک ویترین آنلاین اختصاصی، مدرن و زیباست.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
