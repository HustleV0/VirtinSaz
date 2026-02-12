"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-white" dir="rtl">
      {/* Premium Glass Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
            <Skeleton className="h-6 w-32 bg-white/10" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Skeleton className="h-4 w-12 bg-white/10" />
            <Skeleton className="h-4 w-12 bg-white/10" />
            <Skeleton className="h-4 w-12 bg-white/10" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            <Skeleton className="h-10 w-32 rounded-full bg-white/10 hidden md:block" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full rounded-none bg-white/5" />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-3xl">
            <Skeleton className="h-8 w-48 mb-6 rounded-full bg-white/10" />
            <Skeleton className="h-16 md:h-24 w-3/4 mb-8 bg-white/10" />
            <Skeleton className="h-20 w-full mb-10 bg-white/10" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-full bg-white/10" />
              <Skeleton className="h-14 w-40 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Info Grid Skeleton */}
      <section className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-6">
                <Skeleton className="h-12 w-12 rounded-2xl bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-20 bg-[#020617]/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="space-y-4 text-center md:text-right w-full md:w-auto">
              <Skeleton className="h-12 w-48 bg-white/10 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-64 bg-white/10 mx-auto md:mx-0" />
            </div>
            <Skeleton className="h-14 w-full md:w-96 rounded-2xl bg-white/10" />
          </div>

          {/* Categories Bar Skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-12 w-28 rounded-full bg-white/10 shrink-0" />
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full bg-white/10 rounded-none" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-1/2 bg-white/10" />
                    <Skeleton className="h-6 w-1/4 bg-white/10" />
                  </div>
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <div className="pt-4 flex gap-3">
                    <Skeleton className="h-12 flex-1 rounded-2xl bg-white/10" />
                    <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
