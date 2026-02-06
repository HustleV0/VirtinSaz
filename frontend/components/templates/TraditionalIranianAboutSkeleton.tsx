"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function TraditionalIranianAboutSkeleton() {
  return (
    <div className="min-h-screen bg-[#fffef9]">
      <header className="sticky top-0 z-50 border-b bg-[#fffef9] shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full md:hidden" />
          </div>
        </div>
      </header>

      <section className="py-24 border-b">
        <div className="container mx-auto px-4 text-center space-y-8">
          <Skeleton className="h-16 w-96 mx-auto max-w-full" />
          <Skeleton className="h-1 w-48 mx-auto" />
          <div className="space-y-4 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Skeleton className="h-10 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="aspect-square w-full max-w-md rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f8f4e8]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
