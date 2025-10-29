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

export default function BlogPage({ searchParams }: BlogPageProps) {
  const category = searchParams.category || "All"
  const searchTerm = searchParams.search || ""

  return (
    <Suspense fallback={<BlogPageSkeleton />}>
      <BlogPageClient categories={blogCategories} initialCategory={category} initialSearchTerm={searchTerm} />
    </Suspense>
  )
}
