"use client"

import { useState, useEffect, useCallback } from "react"
import { blogDataManager, type BlogPost } from "@/lib/data/blog-data-manager"

interface UseBlogReturn {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null

  // CRUD operations
  createPost: (postData: Partial<BlogPost>, imageFile?: File) => Promise<BlogPost | null>
  updatePost: (id: string, updates: Partial<BlogPost>, imageFile?: File) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  toggleFeatured: (id: string) => Promise<boolean>
  togglePublished: (id: string) => Promise<boolean>

  // Helpers
  refreshData: () => Promise<void>
  getPostById: (id: string) => BlogPost | null
  getPublishedPosts: () => BlogPost[]
  getFeaturedPosts: (limit?: number) => BlogPost[]
}

export function useBlogRealTime(): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all posts from API
  const refreshData = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      const data = await blogDataManager.getAllBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error("Error fetching blog data:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load on mount
  useEffect(() => {
    refreshData()
  }, [refreshData])

  // CRUD
  const createPost = useCallback(
    async (postData: Partial<BlogPost>, imageFile?: File): Promise<BlogPost | null> => {
      try {
        setError(null)
        const newPost = await blogDataManager.createBlogPost(postData, imageFile)
        if (newPost) {
          await refreshData()
          return newPost
        }
        return null
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create blog post")
        return null
      }
    },
    [refreshData],
  )

  const updatePost = useCallback(
    async (id: string, updates: Partial<BlogPost>, imageFile?: File): Promise<BlogPost | null> => {
      try {
        setError(null)
        const updatedPost = await blogDataManager.updateBlogPost(id, updates, imageFile)
        if (updatedPost) {
          await refreshData()
          return updatedPost
        }
        return null
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update blog post")
        return null
      }
    },
    [refreshData],
  )

  const deletePost = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null)
        const success = await blogDataManager.deleteBlogPost(id)
        if (success) await refreshData()
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete blog post")
        return false
      }
    },
    [refreshData],
  )

  const toggleFeatured = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null)
        const success = await blogDataManager.toggleFeatured(id)
        if (success) await refreshData()
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle featured status")
        return false
      }
    },
    [refreshData],
  )

  const togglePublished = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null)
        const success = await blogDataManager.togglePublished(id)
        if (success) await refreshData()
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle published status")
        return false
      }
    },
    [refreshData],
  )

  // Local data helpers
  const getPostById = useCallback(
    (id: string): BlogPost | null => posts.find((p) => p.id === id) || null,
    [posts],
  )

  const getPublishedPosts = useCallback(
    (): BlogPost[] => posts.filter((p) => p.published),
    [posts],
  )

  const getFeaturedPosts = useCallback(
    (limit?: number): BlogPost[] => {
      const featured = posts.filter((p) => p.featured && p.published)
      return limit ? featured.slice(0, limit) : featured
    },
    [posts],
  )

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    toggleFeatured,
    togglePublished,
    refreshData,
    getPostById,
    getPublishedPosts,
    getFeaturedPosts,
  }
}
