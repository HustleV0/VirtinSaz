"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Calendar, AlertCircle } from "lucide-react"
import { mockPlans, mockRestaurant, formatPrice, getPersianDate } from "@/lib/mock-data"

export default function SubscriptionPage() {
  const currentPlan = mockPlans.find(
    (p) => p.id === mockRestaurant.subscription.planId
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">مدیریت اشتراک</h1>
        <p className="text-muted-foreground">
          وضعیت اشتراک خود را مدیریت کنید
        </p>
      </div>

      {/* Current Subscription */}
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
                  <h3 className="text-xl font-bold">{currentPlan?.name}</h3>
                  <Badge
                    variant={
                      mockRestaurant.subscription.status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {mockRestaurant.subscription.status === "active"
                      ? "فعال"
                      : "منقضی"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{currentPlan?.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => toast.info("بخش تغییر پلن به زودی فعال می‌شود")}>تغییر پلن</Button>
              <Button onClick={() => toast.success("در حال انتقال به درگاه پرداخت...")}>تمدید اشتراک</Button>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="mt-6 grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تاریخ شروع</p>
                <p className="font-medium">
                  {getPersianDate(mockRestaurant.subscription.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تاریخ انقضا</p>
                <p className="font-medium">
                  {getPersianDate(mockRestaurant.subscription.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تمدید خودکار</p>
                <p className="font-medium">
                  {mockRestaurant.subscription.autoRenew ? "فعال" : "غیرفعال"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">پلن‌های موجود</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {mockPlans.map((plan) => {
            const isCurrent = plan.id === mockRestaurant.subscription.planId

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.isPopular
                    ? "border-primary shadow-lg"
                    : isCurrent
                      ? "border-primary/50"
                      : ""
                }`}
              >
                {plan.isPopular && (
                  <Badge className="absolute -top-3 right-4">محبوب‌ترین</Badge>
                )}
                {isCurrent && (
                  <Badge variant="outline" className="absolute -top-3 left-4">
                    پلن فعلی
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground">تومان</span>
                    </div>
                    <p className="text-sm text-muted-foreground">/ ماهانه</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-6 w-full"
                    variant={isCurrent ? "outline" : plan.isPopular ? "default" : "outline"}
                    disabled={isCurrent}
                    onClick={() => toast.success(`پلن ${plan.name} انتخاب شد. در حال انتقال به درگاه پرداخت...`)}
                  >
                    {isCurrent ? "پلن فعلی" : "انتخاب پلن"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>تاریخچه پرداخت</CardTitle>
          <CardDescription>لیست پرداخت‌های اخیر شما</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">پلن حرفه‌ای - ۱ ماهه</p>
                  <p className="text-sm text-muted-foreground">
                    {getPersianDate(
                      new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
                    )}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{formatPrice(399000)} تومان</p>
                  <Badge variant="secondary" className="text-xs">
                    موفق
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
