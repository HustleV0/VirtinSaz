"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sleek Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <div className="hidden md:flex items-center gap-10">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full md:hidden" />
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="pt-20">
        <div className="flex flex-col lg:flex-row min-h-[80vh]">
          <div className="flex-1 relative min-h-[400px]">
            <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 py-20 bg-white">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-16 w-3/4 mb-8" />
            <Skeleton className="h-20 w-full mb-12" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-none" />
              <Skeleton className="h-14 w-40 rounded-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar Skeleton */}
      <section className="sticky top-20 z-40 bg-white border-b">
        <div className="container mx-auto px-6 h-16 flex items-center gap-8">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </section>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-10 w-full md:w-72" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-[4/5] w-full rounded-none" />
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-12 w-full rounded-none" />
              <Skeleton className="h-12 w-full rounded-none" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
