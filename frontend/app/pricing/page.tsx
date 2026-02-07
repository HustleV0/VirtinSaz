import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { mockPlans, formatPrice } from "@/lib/mock-data"

export const metadata = {
  title: "تعرفه‌ها | ویترین ساز",
  description: "پلن مناسب کسب‌وکار خود را انتخاب کنید",
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-24">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                پلن مناسب خود را انتخاب کنید
              </h1>
              <p className="text-lg text-muted-foreground">
                با ۷ روز ضمانت بازگشت وجه. بدون ریسک شروع کنید.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {mockPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border bg-card p-8 ${
                    plan.isPopular
                      ? "border-primary shadow-xl"
                      : "border-border"
                  }`}
                >
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 right-8">
                      محبوب‌ترین
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground">تومان</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      / ماهانه
                    </p>
                  </div>

                  <Link href="/register">
                    <Button
                      className="w-full"
                      variant={plan.isPopular ? "default" : "outline"}
                    >
                      شروع کنید
                    </Button>
                  </Link>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* FAQ Link */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground">
                سوالی دارید؟{" "}
                <Link href="/#faq" className="text-primary hover:underline">
                  سوالات متداول را ببینید
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
