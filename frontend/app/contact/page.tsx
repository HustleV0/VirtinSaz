import React from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Phone, Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/landing/ContactForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "تماس با ما | ویترین ساز",
  description: "سوالات، پیشنهادات و نظرات خود را با ما در میان بگذارید. پل‌های ارتباطی با ویترین ساز.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
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
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    نقشه گوگل در اینجا قرار می‌گیرد
                  </div>
                </div>
              </div>

              {/* Contact Form Island */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
