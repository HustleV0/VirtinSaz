"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Check, Layout, Palette } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { id: 1, title: "اطلاعات کاربری" },
  { id: 2, title: "تایید شماره موبایل" },
]

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: "",
    password: "",
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const sendOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/accounts/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: formData.phone }),
      })
      if (response.ok) {
        setTimer(60)
        setCurrentStep(2)
        toast.success("کد تایید ارسال شد")
      } else {
        const data = await response.json()
        toast.error(data.error || "خطا در ارسال کد")
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.name) return toast.error("نام الزامی است")
      if (!formData.phone) return toast.error("شماره موبایل الزامی است")
      if (!formData.password) return toast.error("رمز عبور الزامی است")
      await sendOTP()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 1) {
      handleNext()
      return
    }

    if (!formData.otp) {
      toast.error("کد تایید الزامی است")
      return
    }

    setIsLoading(true)
    try {
      // 1. Verify OTP first
      const verifyRes = await fetch("http://localhost:8000/api/accounts/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: formData.phone, code: formData.otp }),
      })

      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        toast.error(data.error || "کد تایید اشتباه است")
        setIsLoading(false)
        return
      }

      // 2. Then Register
      const response = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phone,
          full_name: formData.name,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        login(data.tokens.access, data.tokens.refresh, data)
        toast.success("ثبت‌نام با موفقیت انجام شد")
        router.push("/dashboard")
      } else {
        toast.error(data.error || "خطا در ثبت‌نام")
      }
    } catch (error) {
      toast.error("خطا در ثبت‌نام")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به خانه
          </Link>

          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">م</span>
            </div>
            <span className="text-2xl font-bold">منوساز</span>
          </Link>

          <h1 className="text-2xl font-bold">ایجاد حساب کاربری</h1>
          <p className="mt-2 text-muted-foreground">
            حساب کاربری دارید؟{" "}
            <Link href="/login" className="text-primary hover:underline">
              وارد شوید
            </Link>
          </p>

          <div className="mt-8 flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-6 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {steps[currentStep - 1].title}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="علی محمدی"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">رمز عبور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="حداقل ۸ کاراکتر"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={8}
                      dir="ltr"
                      className="pl-10 text-left"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">کد تایید ارسال شده را وارد کنید</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="------"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    required
                    dir="ltr"
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      ارسال مجدد کد تا {timer} ثانیه دیگر
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={sendOTP}
                      className="text-primary"
                      disabled={isLoading}
                    >
                      ارسال مجدد کد
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  قبلی
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading
                  ? "در حال انجام..."
                  : currentStep === 2
                    ? "ثبت‌نام و ورود"
                    : "دریافت کد تایید"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden flex-1 bg-primary lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold">
            وبسایت رستوران خود را در چند دقیقه بسازید
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            با منوساز، به سادگی وبسایت حرفه‌ای برای رستوران یا کافه خود بسازید و
            مشتریان بیشتری جذب کنید.
          </p>
        </div>
      </div>
    </div>
  )
}
