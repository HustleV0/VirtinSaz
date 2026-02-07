"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

export function Hero() {
  const { user, isLoading } = useAuth()
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>بیش از ۵۰۰ رستوران فعال</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl"
          >
            وبسایت رستوران خود را
            <br />
            <span className="text-muted-foreground">در چند دقیقه</span> بسازید
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl"
          >
            با ویترین ساز به سادگی وبسایت حرفه‌ای برای رستوران یا کافه خود بسازید.
            منوی آنلاین، سفارش آنلاین و مدیریت کامل در یک پلتفرم.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {!isLoading && user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8">
                  <LayoutDashboard className="h-4 w-4" />
                  پنل مدیریت
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" className="gap-2 px-8">
                  شروع رایگان
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="gap-2 px-8 bg-transparent">
              <Play className="h-4 w-4" />
              مشاهده دمو
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">بدون نیاز به کدنویسی</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">راه‌اندازی در ۵ دقیقه</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">پشتیبانی ۲۴/۷</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="mr-4 text-xs text-muted-foreground">cafe-lezzat.vitrinsaz.ir</span>
            </div>
            <div className="aspect-[16/9] overflow-hidden rounded-b-lg bg-muted">
              <div className="flex h-full flex-col">
                {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                    <div className="h-4 w-24 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 w-16 rounded bg-muted-foreground/20" />
                    <div className="h-4 w-16 rounded bg-muted-foreground/20" />
                    <div className="h-4 w-16 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                {/* Mock Hero */}
                <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-background to-muted p-8">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-6 w-48 rounded bg-muted-foreground/30" />
                    <div className="mx-auto mb-2 h-4 w-64 rounded bg-muted-foreground/20" />
                    <div className="mx-auto h-4 w-48 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                {/* Mock Products */}
                <div className="grid grid-cols-4 gap-4 bg-background p-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className="mb-2 aspect-square rounded bg-muted" />
                      <div className="mb-1 h-3 w-full rounded bg-muted-foreground/20" />
                      <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
