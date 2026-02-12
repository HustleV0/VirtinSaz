"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantContactSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-white" dir="rtl">
      {/* Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
            <Skeleton className="h-6 w-32 bg-white/10" />
          </div>
          <div className="hidden md:flex gap-10">
            <Skeleton className="h-4 w-12 bg-white/10" />
            <Skeleton className="h-4 w-12 bg-white/10" />
            <Skeleton className="h-4 w-12 bg-white/10" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            <Skeleton className="h-10 w-10 rounded-full bg-white/10 md:hidden" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <div className="pt-40 pb-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6 text-center md:text-right space-y-6">
          <Skeleton className="h-4 w-32 bg-white/10 rounded-full mx-auto md:mx-0" />
          <Skeleton className="h-24 md:h-48 w-3/4 bg-white/10 mx-auto md:mx-0" />
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Info Cards Skeleton */}
            <div className="lg:w-1/3 space-y-10">
               {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-[2rem] bg-white/5 border border-white/10" />
               ))}
               <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl bg-white/5" />
                  <Skeleton className="h-16 w-16 rounded-2xl bg-white/5" />
               </div>
            </div>

            {/* Form Skeleton */}
            <div className="lg:w-2/3">
              <div className="p-10 md:p-16 rounded-[3rem] bg-white/5 border border-white/10">
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Skeleton className="h-3 w-20 bg-white/10" />
                      <Skeleton className="h-14 w-full rounded-2xl bg-white/10" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-3 w-20 bg-white/10" />
                      <Skeleton className="h-14 w-full rounded-2xl bg-white/10" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-20 bg-white/10" />
                    <Skeleton className="h-32 w-full rounded-2xl bg-white/10" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-2xl bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
