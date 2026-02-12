"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-12">
        <div className="h-16 w-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
          <Send className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">پیام شما دریافت شد</h2>
        <p className="text-muted-foreground">همکاران ما به زودی با شما تماس خواهند گرفت.</p>
        <Button variant="outline" className="mt-8" onClick={() => setIsSubmitted(false)}>ارسال پیام جدید</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 text-right">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input id="name" placeholder="نام شما" required />
        </div>
        <div className="space-y-2 text-right">
          <Label htmlFor="email">ایمیل</Label>
          <Input id="email" type="email" placeholder="example@email.com" required dir="ltr" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <Label htmlFor="subject">موضوع</Label>
        <Input id="subject" placeholder="موضوع پیام" required />
      </div>
      <div className="space-y-2 text-right">
        <Label htmlFor="message">متن پیام</Label>
        <Textarea id="message" placeholder="پیام خود را اینجا بنویسید..." className="min-h-[150px]" required />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
        <Send className="mr-2 h-4 w-4" />
      </Button>
    </form>
  )
}
