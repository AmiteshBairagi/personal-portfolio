"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import PostDisplay from "./post-display"
import { useBlogStore } from "@/hooks/use-blog-store"
import type { BlogPost } from "@/lib/blog-types"

interface PageClientProps {
  slug: string
}

export default function PageClient({ slug }: PageClientProps) {
  const { posts, isLoaded, getPostBySlug, getPostsByCategory, fetchPostsByCategory, isLoading: storeIsLoading } = useBlogStore()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiAttempted, setApiAttempted] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true)
      
      // First try to find the post in the store
      let foundPost = getPostBySlug(slug)
      
      if (foundPost) {
        setPost(foundPost)
        const related = getPostsByCategory(foundPost.category)
          .filter((p) => p.id !== foundPost.id)
          .slice(0, 3)
        setRelatedPosts(related)
        setIsLoading(false)
        return
      }

      // If not found locally and we haven't tried API yet, fetch from API
      if (!apiAttempted) {
        try {
          console.log(`Fetching posts from API for slug: ${slug}`)
          await fetchPostsByCategory("All")
          setApiAttempted(true)
          
          // Wait a moment for store to update, then check again
          setTimeout(() => {
            const refreshedPost = getPostBySlug(slug)
            if (refreshedPost) {
              setPost(refreshedPost)
              const related = getPostsByCategory(refreshedPost.category)
                .filter((p) => p.id !== refreshedPost.id)
                .slice(0, 3)
              setRelatedPosts(related)
            } else {
              console.error(`Post not found with slug: ${slug}`)
              notFound()
            }
            setIsLoading(false)
          }, 100)
          return
        } catch (error) {
          console.error("Failed to fetch posts from API:", error)
          setApiAttempted(true)
        }
      }

      // If we get here, post was not found
      setIsLoading(false)
      notFound()
    }

    loadPost()
  }, [slug, getPostBySlug, getPostsByCategory, fetchPostsByCategory, apiAttempted])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return <PostDisplay post={post} relatedPosts={relatedPosts} />
}
