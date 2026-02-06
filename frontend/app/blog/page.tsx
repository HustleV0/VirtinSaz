"use client"

import React from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "چگونه فروش رستوران خود را در سال ۱۴۰۴ دو برابر کنیم؟",
    excerpt: "استفاده از تکنولوژی‌های جدید و منوهای هوشمند می‌تواند تاثیر شگرفی بر رضایت مشتریان و میزان فروش داشته باشد...",
    author: "محمد ناصری",
    date: "۱۴ بهمن ۱۴۰۳",
    readTime: "۵ دقیقه",
    category: "کسب‌وکار",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "تاثیر طراحی منو بر انتخاب‌های مشتری",
    excerpt: "روانشناسی رنگ‌ها و چیدمان آیتم‌ها در منو چگونه باعث افزایش سفارش غذاهای خاص می‌شود؟",
    author: "سارا حسینی",
    date: "۱۰ بهمن ۱۴۰۳",
    readTime: "۸ دقیقه",
    category: "طراحی",
    image: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "راهنمای کامل راه‌اندازی منوی دیجیتال QR",
    excerpt: "در این مقاله گام به گام با نحوه ساخت و مدیریت منوهای دیجیتال آشنا می‌شویم و مزایای آن را بررسی می‌کنیم.",
    author: "امیر علی‌زاده",
    date: "۵ بهمن ۱۴۰۳",
    readTime: "۶ دقیقه",
    category: "آموزشی",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=800",
  },
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">وبلاگ منوساز</h1>
            <p className="text-muted-foreground text-lg">آخرین مقالات، اخبار و آموزش‌های دنیای رستوران‌داری</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h2 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                        {post.author[0]}
                      </div>
                      <span className="text-xs font-medium">{post.author}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <Link href={`/blog/${post.id}`}>
                        ادامه مطلب
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
