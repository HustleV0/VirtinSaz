"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function TraditionalIranianSkeleton() {
  return (
    <div className="min-h-screen bg-[#fffef9]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b shadow-sm bg-[#fffef9]">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full md:hidden" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="relative py-16 text-center">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto mb-8 h-32 w-32 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96 max-w-full" />
          <div className="mt-8 flex justify-center gap-4">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>
      </section>

      {/* Search and Filters Skeleton */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <Skeleton className="mx-auto h-14 w-full max-w-xl rounded-full mb-8" />
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Categories and Products Skeleton */}
        <div className="space-y-16">
          {[1, 2].map(section => (
            <div key={section} className="space-y-8">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48" />
                <div className="h-px flex-1 bg-muted" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 p-4 border rounded-2xl bg-white shadow-sm">
                    <Skeleton className="h-24 w-24 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between items-center pt-2">
                         <Skeleton className="h-6 w-16 rounded-full" />
                         <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
