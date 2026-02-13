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

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = await api.post("/accounts/login/", {
        username: formData.username,
        password: formData.password,
      })
      login(data.access, data.refresh, data.user)
      toast.success("خوش آمدید")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "شماره موبایل یا رمز عبور اشتباه است")
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

          <h1 className="text-2xl font-bold">ورود به حساب کاربری</h1>
          <p className="mt-2 text-muted-foreground">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-primary hover:underline">
              ثبت‌نام کنید
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="نام کاربری خود را وارد کنید"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">رمز عبور</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    فراموشی رمز عبور
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
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
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden flex-1 bg-primary lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold">خوش آمدید!</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            با ورود به حساب کاربری، به داشبورد مدیریت وبسایت خود دسترسی پیدا کنید
            و کسب‌وکارتان را مدیریت کنید.
          </p>
        </div>
      </div>
    </div>
  )
}
