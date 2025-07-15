"use client"

import { useState, useEffect, useCallback } from "react"
import { blogDataManager, type BlogPost } from "@/lib/data/blog-data-manager"

interface UseBlogRealTimeReturn {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  isOnline: boolean
  lastSyncTime: Date | null

  // CRUD operations
  createPost: (
    postData: Omit<BlogPost, "id" | "created_at" | "updated_at" | "display_order">,
  ) => Promise<BlogPost | null>
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  reorderPost: (id: string, direction: "up" | "down") => Promise<boolean>
  toggleFeatured: (id: string) => Promise<boolean>
  togglePublished: (id: string) => Promise<boolean>

  // Data fetching
  refreshData: () => Promise<void>
  getPostById: (id: string) => BlogPost | null
  getPublishedPosts: () => BlogPost[]
  getFeaturedPosts: (limit?: number) => BlogPost[]
  searchPosts: (query: string, category?: string) => Promise<BlogPost[]>
  getPostsByCategory: (category: string) => Promise<BlogPost[]>
}

export function useBlogRealTime(): UseBlogRealTimeReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(() => {
    console.log("Real-time update received for blog posts")
    refreshData()
  }, [])

  // Initialize data and real-time subscription
  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Initialize real-time subscription
      blogDataManager.initializeSubscription(handleRealtimeUpdate)

      // Load initial data
      const data = await blogDataManager.getAllBlogPosts(true)
      setPosts(data)
      setLastSyncTime(new Date())
      setIsOnline(true)
    } catch (err) {
      console.error("Error initializing blog data:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }, [handleRealtimeUpdate])

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      setError(null)
      const data = await blogDataManager.getAllBlogPosts(true)
      setPosts(data)
      setLastSyncTime(new Date())
      setIsOnline(true)
    } catch (err) {
      console.error("Error refreshing blog data:", err)
      setError(err instanceof Error ? err.message : "Failed to refresh blog posts")
      setIsOnline(false)
    }
  }, [])

  // CRUD Operations
  const createPost = useCallback(
    async (
      postData: Omit<BlogPost, "id" | "created_at" | "updated_at" | "display_order">,
    ): Promise<BlogPost | null> => {
      try {
        setError(null)
        const newPost = await blogDataManager.createBlogPost(postData)
        if (newPost) {
          await refreshData()
          return newPost
        }
        return null
      } catch (err) {
        console.error("Error creating blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to create blog post")
        return null
      }
    },
    [refreshData],
  )

  const updatePost = useCallback(
    async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
      try {
        setError(null)
        const updatedPost = await blogDataManager.updateBlogPost(id, updates)
        if (updatedPost) {
          await refreshData()
          return updatedPost
        }
        return null
      } catch (err) {
        console.error("Error updating blog post:", err)
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
        if (success) {
          await refreshData()
        }
        return success
      } catch (err) {
        console.error("Error deleting blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to delete blog post")
        return false
      }
    },
    [refreshData],
  )

  const reorderPost = useCallback(
    async (id: string, direction: "up" | "down"): Promise<boolean> => {
      try {
        setError(null)
        const success = await blogDataManager.reorderBlogPost(id, direction)
        if (success) {
          await refreshData()
        }
        return success
      } catch (err) {
        console.error("Error reordering blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to reorder blog post")
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
        if (success) {
          await refreshData()
        }
        return success
      } catch (err) {
        console.error("Error toggling featured status:", err)
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
        if (success) {
          await refreshData()
        }
        return success
      } catch (err) {
        console.error("Error toggling published status:", err)
        setError(err instanceof Error ? err.message : "Failed to toggle published status")
        return false
      }
    },
    [refreshData],
  )

  // Data access methods
  const getPostById = useCallback(
    (id: string): BlogPost | null => {
      return posts.find((post) => post.id === id) || null
    },
    [posts],
  )

  const getPublishedPosts = useCallback((): BlogPost[] => {
    return posts.filter((post) => post.published && post.is_active)
  }, [posts])

  const getFeaturedPosts = useCallback(
    (limit?: number): BlogPost[] => {
      const featured = posts.filter((post) => post.featured && post.published && post.is_active)
      return limit ? featured.slice(0, limit) : featured
    },
    [posts],
  )

  const searchPosts = useCallback(async (query: string, category?: string): Promise<BlogPost[]> => {
    try {
      setError(null)
      return await blogDataManager.searchBlogPosts(query, category)
    } catch (err) {
      console.error("Error searching blog posts:", err)
      setError(err instanceof Error ? err.message : "Failed to search blog posts")
      return []
    }
  }, [])

  const getPostsByCategory = useCallback(async (category: string): Promise<BlogPost[]> => {
    try {
      setError(null)
      return await blogDataManager.getBlogPostsByCategory(category)
    } catch (err) {
      console.error("Error getting posts by category:", err)
      setError(err instanceof Error ? err.message : "Failed to get posts by category")
      return []
    }
  }, [])

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      refreshData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [refreshData])

  // Initialize on mount
  useEffect(() => {
    initializeData()

    // Cleanup subscription on unmount
    return () => {
      blogDataManager.cleanup()
    }
  }, [initializeData])

  // Auto-refresh every 5 minutes when online
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(
      () => {
        refreshData()
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [isOnline, refreshData])

  return {
    posts,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    createPost,
    updatePost,
    deletePost,
    reorderPost,
    toggleFeatured,
    togglePublished,
    refreshData,
    getPostById,
    getPublishedPosts,
    getFeaturedPosts,
    searchPosts,
    getPostsByCategory,
  }
}
