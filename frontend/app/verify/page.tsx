"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Home, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/mock-data"
import Link from "next/link"

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  const status = searchParams.get("status")
  const amount = searchParams.get("amount")
  const orderId = Math.floor(Math.random() * 1000000).toString()

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">در حال تایید تراکنش...</p>
      </div>
    )
  }

  const isSuccess = status === "success"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4" dir="rtl">
      <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            {isSuccess ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? "سفارش با موفقیت ثبت شد" : "خطا در ثبت سفارش"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {isSuccess ? (
            <>
              <p className="text-muted-foreground">
                تراکنش شما با موفقیت انجام شد و سفارش برای رستوران ارسال گردید.
              </p>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">شماره سفارش:</span>
                  <span className="font-mono font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مبلغ پرداختی:</span>
                  <span className="font-bold">{formatPrice(Number(amount))} تومان</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              متأسفانه خطایی در فرآیند پرداخت رخ داده است. لطفاً دوباره تلاش کنید.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link href="/preview/cafe-lezzat">
              <ShoppingBag className="ml-2 h-4 w-4" />
              بازگشت به منو
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <Home className="ml-2 h-4 w-4" />
              صفحه اصلی
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
