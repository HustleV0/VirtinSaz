"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ModernRestaurantAboutSkeleton() {
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

      <div className="pt-20">
        <Skeleton className="h-[60vh] w-full rounded-none" />
      </div>

      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-1 w-20" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Skeleton className="aspect-[4/5] w-full rounded-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-12 bg-white border-b-4 border-black space-y-8">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
