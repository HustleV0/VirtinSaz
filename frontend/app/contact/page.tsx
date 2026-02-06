"use client"

import React, { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">تماس با ما</h1>
              <p className="text-muted-foreground">سوالات، پیشنهادات و نظرات خود را با ما در میان بگذارید</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">تلفن تماس</h3>
                      <p className="text-muted-foreground" dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">ایمیل پشتیبانی</h3>
                      <p className="text-muted-foreground">support@menusaz.ir</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">آدرس</h3>
                      <p className="text-muted-foreground">تهران، برج میلاد، طبقه ۴، واحد ۴۰۲</p>
                    </div>
                  </div>
                </div>

                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  {/* Mock Map */}
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    نقشه گوگل در اینجا قرار می‌گیرد
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                {!isSubmitted ? (
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
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                      <Send className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">پیام شما دریافت شد</h2>
                    <p className="text-muted-foreground">همکاران ما به زودی با شما تماس خواهند گرفت.</p>
                    <Button variant="outline" className="mt-8" onClick={() => setIsSubmitted(false)}>ارسال پیام جدید</Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
