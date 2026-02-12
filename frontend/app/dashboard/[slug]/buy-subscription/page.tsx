"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface Plan {
  id: string
  name: string
  price: string
  billing_cycle: string
  description: string
  features_list: string[]
}

export default function BuySubscriptionPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")
  const [plan, setPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans = await api.get("/subscription/plans/")
        const selectedPlan = plans.find((p: Plan) => p.id === planId) || plans[0]
        setPlan(selectedPlan)
      } catch (error) {
        console.error("Failed to fetch plan:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlan()
  }, [planId])

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">تکمیل سفارش</h1>
        <p className="mt-2 text-muted-foreground">شما در حال ارتقا به پلن {plan?.name} هستید</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Order Summary */}
        <Card className="flex flex-col h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              جزئیات پلن انتخاب شده
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-bold text-lg">{plan?.name}</p>
                <p className="text-sm text-muted-foreground">{plan?.description}</p>
              </div>
              <Badge variant="secondary">
                {plan?.billing_cycle === 'monthly' ? 'ماهانه' : plan?.billing_cycle === 'yearly' ? 'سالانه' : 'مادام‌العمر'}
              </Badge>
            </div>
            
            <ul className="space-y-2">
              {plan?.features_list.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">مبلغ قابل پرداخت:</span>
                <span className="text-2xl font-bold text-primary">
                  {plan ? formatPrice(Number(plan.price)) : 0} تومان
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-4 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            پرداخت امن و تضمین بازگشت وجه تا ۷ روز
          </CardFooter>
        </Card>

        {/* Payment Info */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              روش پرداخت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 text-center">
            <div className="rounded-full bg-primary/10 p-6 mx-auto w-fit">
              <Phone className="h-12 w-12 text-primary" />
            </div>
            
            <div className="space-y-4">
              <p className="text-lg font-medium leading-relaxed">
                در حال حاضر فعال‌سازی اشتراک از طریق تماس با واحد فروش انجام می‌شود.
              </p>
              
              <div className="bg-muted p-6 rounded-xl space-y-3">
                <p className="text-sm text-muted-foreground">با کارشناسان ما تماس بگیرید:</p>
                <div className="space-y-1">
                  <a href="tel:02112345678" className="block text-2xl font-bold tracking-widest text-primary hover:underline" dir="ltr">
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </a>
                  <a href="tel:09123456789" className="block text-2xl font-bold tracking-widest text-primary hover:underline" dir="ltr">
                    ۰۹۱۲-۳۴۵۶۷۸۹
                  </a>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                پس از تماس، اشتراک شما بلافاصله فعال خواهد شد.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full gap-2">
                <ArrowRight className="h-4 w-4" />
                بازگشت به داشبورد
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
