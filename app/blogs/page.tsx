// "use client"

import { Suspense } from "react"
import { blogCategories } from "@/lib/blog-data"
import BlogPageClient from "./blog-page-client"
import BlogPageSkeleton from "./loading"

interface BlogPageProps {
  searchParams: {
    category?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string, search?: string }> }) {
  const { category = "All", search: searchTerm = "" } = await searchParams

  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageClient categories={blogCategories} initialCategory={category} initialSearchTerm={searchTerm} />
    </Suspense>
  )
}
