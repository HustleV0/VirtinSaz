"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantContactSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex gap-10">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full md:hidden" />
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-20 bg-black">
        <div className="container mx-auto px-6">
          <Skeleton className="h-4 w-32 bg-white/20 mb-6" />
          <Skeleton className="h-24 w-96 bg-white/20" />
        </div>
      </div>

      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32">
            <div className="lg:w-1/3 space-y-20">
              <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                ))}
              </div>
              <div className="flex gap-8">
                <Skeleton className="h-16 w-16 rounded-none" />
                <Skeleton className="h-16 w-16 rounded-none" />
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-12 w-full rounded-none" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-12 w-full rounded-none" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-32 w-full rounded-none" />
              </div>
              <Skeleton className="h-20 w-48 rounded-none" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
