"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function MinimalCafeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full md:hidden" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="container relative mx-auto -mt-12 px-4 md:-mt-20">
          <div className="rounded-xl border bg-card p-6 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="space-y-12">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-6">
              <Skeleton className="h-8 w-40" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col gap-4 rounded-xl border p-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-24" />
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
