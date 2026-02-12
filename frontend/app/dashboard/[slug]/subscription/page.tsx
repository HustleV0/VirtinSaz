"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Calendar, AlertCircle, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/mock-data"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Plan {
  id: string
  name: string
  description: string
  billing_cycle: string
  price: string
  currency: string
  features_list: string[]
  limits: Record<string, any>
}

interface Subscription {
  id: string
  plan: Plan
  status: string
  start_date: string
  end_date: string
  cancel_at: string | null
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch plans (Public)
      const plansData = await api.get("/subscription/plans/")
      setPlans(plansData)

      // Fetch current subscription (Private)
      try {
        const subData = await api.get("/subscription/me/")
        setCurrentSub(subData)
      } catch (error: any) {
        // If 401, user is not logged in or token expired
        console.warn("User is not authenticated for subscription data")
      }
    } catch (error) {
      console.error("Failed to fetch plans", error)
      toast.error("خطا در دریافت اطلاعات پلن‌ها")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید")
      router.push("/login")
      return
    }

    try {
      setPaymentLoading(planId)
      const result = await api.post("/subscription/zarinpal/request/", { plan_id: planId })
      if (result.url) {
        toast.success("در حال انتقال به درگاه پرداخت...")
        window.location.href = result.url
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در برقراری ارتباط با درگاه پرداخت")
    } finally {
      setPaymentLoading(null)
    }
  }

  const getPersianDate = (dateStr: string) => {
    if (!dateStr) return "---"
    return new Date(dateStr).toLocaleDateString("fa-IR")
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدیریت اشتراک</h1>
        <p className="text-muted-foreground">وضعیت اشتراک خود را مدیریت کنید</p>
      </div>

      {/* Current Subscription - Only show if currentSub exists or user is logged in */}
      {currentSub ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              اشتراک فعلی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{currentSub.plan?.name || "بدون اشتراک"}</h3>
                    <Badge
                      variant={
                        currentSub.status === "active" ? "default" : "destructive"
                      }
                    >
                      {currentSub.status === "active" ? "فعال" : 
                       currentSub.status === "past_due" ? "در انتظار پرداخت" : "نامعلوم"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{currentSub.plan?.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">تاریخ شروع</p>
                  <p className="font-medium">{getPersianDate(currentSub.start_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">تاریخ انقضا</p>
                  <p className="font-medium">{getPersianDate(currentSub.end_date)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">شما در حال حاضر اشتراک فعالی ندارید</p>
            <p className="text-sm text-muted-foreground mb-6">برای استفاده از امکانات پنل، یکی از پلن‌های زیر را انتخاب کنید</p>
            {!localStorage.getItem("access_token") && (
              <Button onClick={() => router.push("/login")}>ورود به حساب کاربری</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">پلن‌های موجود</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentSub?.plan?.id

            return (
              <Card key={plan.id} className={isCurrent ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{formatPrice(parseInt(plan.price))}</span>
                      <span className="text-muted-foreground">تومان</span>
                    </div>
                    <p className="text-sm text-muted-foreground">/ {plan.billing_cycle === 'monthly' ? 'ماهانه' : 'سالانه'}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {(plan.features_list || []).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || paymentLoading === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {paymentLoading === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrent ? "پلن فعلی" : "انتخاب پلن"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
