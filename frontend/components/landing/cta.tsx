"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

export function CTA() {
  const { user, isLoading } = useAuth()
  return (
    <section className="border-t border-border bg-secondary/30 py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            آماده شروع هستید؟
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            همین الان ثبت‌نام کنید و وبسایت حرفه‌ای خود را در چند دقیقه بسازید.
            ۷ روز اول رایگان!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                مشاهده تعرفه‌ها
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
