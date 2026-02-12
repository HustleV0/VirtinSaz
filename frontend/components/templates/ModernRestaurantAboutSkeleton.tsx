"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantAboutSkeleton() {
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
      <div className="pt-20">
        <div className="relative h-[70vh] w-full">
          <Skeleton className="h-full w-full rounded-none bg-white/5" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-6">
            <Skeleton className="h-4 w-32 bg-white/10 rounded-full" />
            <Skeleton className="h-16 md:h-24 w-64 bg-white/10" />
            <Skeleton className="h-1 w-24 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Narrative Section Skeleton */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4 bg-white/10" />
                <Skeleton className="h-20 w-full bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <Skeleton className="h-32 rounded-3xl bg-white/5 border border-white/10" />
                <Skeleton className="h-32 rounded-3xl bg-white/5 border border-white/10" />
              </div>
            </div>
            <div className="flex-1 w-full">
              <Skeleton className="aspect-[4/5] w-full rounded-[2rem] bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Skeleton */}
      <section className="py-32 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-950 border border-white/5 space-y-8">
                <Skeleton className="h-10 w-10 bg-white/10 rounded-lg" />
                <Skeleton className="h-6 w-32 bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
