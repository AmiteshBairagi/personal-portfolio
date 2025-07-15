"use client"

import { ThemeProvider } from "@/contexts/theme-context"
import OptimizedNavbar from "@/components/optimized-navbar"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-dark-900">
        <OptimizedNavbar />

        <main className="pt-20">
          {/* Hero Section Skeleton */}
          <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                <Skeleton className="h-6 w-32 bg-slate-700" />
                <Skeleton className="h-4 w-24 bg-slate-700" />
                <Skeleton className="h-16 w-full bg-slate-700" />
                <Skeleton className="h-6 w-3/4 bg-slate-700" />
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-4 w-16 bg-slate-700" />
                </div>
              </div>
            </div>
          </section>

          {/* Image Skeleton */}
          <section className="py-12 bg-gray-50 dark:bg-dark-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </section>

          {/* Content Skeleton */}
          <section className="py-12 bg-white dark:bg-dark-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  )
}
