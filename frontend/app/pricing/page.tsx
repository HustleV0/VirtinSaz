"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/mock-data"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

interface BackendPlan {
  id: string
  name: string
  description: string
  billing_cycle: string
  price: string
  currency: string
  features_list: string[]
  limits: Record<string, any>
}

export default function PricingPage() {
  const [plans, setPlans] = useState<BackendPlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.get("/subscription/plans/")
        setPlans(data)
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      } finally {
        setIsLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [])

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
            {isLoadingPlans ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border bg-card p-8 flex flex-col ${
                      index === 1
                        ? "border-primary shadow-xl"
                        : "border-border"
                    }`}
                  >
                    {index === 1 && (
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
                          {formatPrice(Number(plan.price))}
                        </span>
                        <span className="text-muted-foreground">تومان</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        / {plan.billing_cycle === 'monthly' ? 'ماهانه' : plan.billing_cycle === 'yearly' ? 'سالانه' : 'مادام‌العمر'}
                      </p>
                    </div>

                    <Link href={`/dashboard/buy-subscription?planId=${plan.id}`}>
                      <Button
                        className="w-full"
                        variant={index === 1 ? "default" : "outline"}
                      >
                        شروع کنید
                      </Button>
                    </Link>

                    <ul className="mt-8 space-y-4 flex-1">
                      {plan.features_list.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

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
