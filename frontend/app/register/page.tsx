"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = await api.post("/accounts/register/", {
        username: formData.username,
        phone_number: formData.phone,
        full_name: formData.name,
        password: formData.password,
      })
      login(data.tokens.access, data.tokens.refresh, data)
      toast.success("ثبت‌نام با موفقیت انجام شد")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت‌نام")
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
              <span className="text-lg font-bold text-primary-foreground">و</span>
            </div>
            <span className="text-2xl font-bold">ویترین ساز</span>
          </Link>

          <h1 className="text-2xl font-bold">ایجاد حساب کاربری</h1>
          <p className="mt-2 text-muted-foreground">
            حساب کاربری دارید؟{" "}
            <Link href="/login" className="text-primary hover:underline">
              وارد شوید
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="نام کاربری (مثلاً ali123)"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  dir="ltr"
                  className="text-left"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام و ورود"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden flex-1 bg-primary lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold">
            وبسایت حرفه‌ای خود را در چند دقیقه بسازید
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            با ویترین ساز، به سادگی وبسایت مدرن و خاص برای برند خود بسازید و
            حضور آنلاین قدرتمندی داشته باشید.
          </p>
        </div>
      </div>
    </div>
  )
}
