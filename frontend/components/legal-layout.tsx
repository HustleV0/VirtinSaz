import React from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function LegalPage({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm">
              <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-right" dir="rtl">
                {content}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
