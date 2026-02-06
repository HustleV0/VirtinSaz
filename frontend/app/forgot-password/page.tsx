"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, MailCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">م</span>
          </div>
          <span className="text-2xl font-bold text-foreground">منوساز</span>
        </Link>

        {!isSubmitted ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">فراموشی رمز عبور</h1>
              <p className="mt-2 text-muted-foreground">
                ایمیل خود را وارد کنید تا لینک بازیابی برای شما ارسال شود
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2 text-right">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="text-left"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
              </Button>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                بازگشت به صفحه ورود
                <ArrowRight className="h-4 w-4" />
              </Link>
            </form>
          </>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold">ایمیل ارسال شد</h2>
            <p className="mt-2 text-muted-foreground">
              لینک بازیابی رمز عبور به ایمیل <span className="font-medium text-foreground">{email}</span> ارسال شد.
              لطفاً صندوق ورودی خود را چک کنید.
            </p>
            <Button asChild className="mt-8 w-full">
              <Link href="/login">بازگشت به ورود</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
