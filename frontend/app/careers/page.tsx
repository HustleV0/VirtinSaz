"use client"

import React from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Clock } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "توسعه‌دهنده Senior React",
    location: "تهران / دورکاری",
    type: "تمام وقت",
    category: "فنی",
  },
  {
    id: 2,
    title: "مدیر فروش و بازاریابی",
    location: "تهران",
    type: "تمام وقت",
    category: "فروش",
  },
  {
    id: 3,
    title: "پشتیبان مشتریان",
    location: "دورکاری",
    type: "پاره وقت",
    category: "پشتیبانی",
  },
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">به تیم منوساز بپیوندید</h1>
            <p className="text-muted-foreground text-lg">
              ما همیشه به دنبال افراد بااستعداد و باانگیزه هستیم تا با هم آینده صنعت رستوران‌داری را بسازیم.
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-3xl mx-auto">
            {jobs.map((job) => (
              <div key={job.id} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {job.category}
                    </div>
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <Button>ارسال رزومه</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 rounded-2xl bg-primary/5 p-8 text-center max-w-3xl mx-auto border border-primary/10">
            <h2 className="text-2xl font-bold mb-4">فرصت مورد نظر خود را پیدا نکردید؟</h2>
            <p className="text-muted-foreground mb-6">رزومه خود را برای ما بفرستید، شاید در آینده به هم نیاز داشتیم!</p>
            <Button variant="outline">ارسال رزومه عمومی</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
