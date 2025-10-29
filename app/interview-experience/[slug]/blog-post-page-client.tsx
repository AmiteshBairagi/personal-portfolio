"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import BlogPostClient from "./blog-post-client"
import { useBlogStore } from "@/hooks/use-blog-store"
import type { BlogPost } from "@/lib/blog-types"

interface BlogPostPageClientProps {
  slug: string
}

export default function BlogPostPageClient({ slug }: BlogPostPageClientProps) {
  const { posts, isLoaded, initializeStore, getPostBySlug, getPostsByCategory } = useBlogStore()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  useEffect(() => {
    if (!isLoaded || posts.length === 0) return

    const foundPost = getPostBySlug(slug)

    if (!foundPost) {
      notFound()
      return
    }

    setPost(foundPost)

    // Get related posts (same category, excluding current post)
    const related = getPostsByCategory(foundPost.category)
      .filter((p) => p.id !== foundPost.id)
      .slice(0, 3)

    setRelatedPosts(related)
  }, [slug, posts, isLoaded, getPostBySlug, getPostsByCategory])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />
}
