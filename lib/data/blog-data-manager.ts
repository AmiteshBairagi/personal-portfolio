import { api } from '@/lib/axios'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  published_at: string
  updated_at: string
  created_at: string
  read_time: number
  tags: string[]
  category: string
  image: string
  featured: boolean
  published: boolean
  display_order: number
  is_active: boolean
}

// Cache management
let blogCache: BlogPost[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const blogDataManager = {
  // Initialize subscription — now a no-op (no Supabase real-time)
  initializeSubscription: (callback?: () => void) => {
    // No real-time subscription; data refreshes on manual page reload
  },

  // Cleanup — no-op
  cleanup: () => {},

  // Get all blog posts with caching
  getAllBlogPosts: async (forceRefresh = false): Promise<BlogPost[]> => {
    const now = Date.now()

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && blogCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return blogCache
    }

    try {
      const { data } = await api.get<BlogPost[]>('/api/blog-posts')

      // Transform data
      const transformedData = (data || []).map(post => ({
        ...post,
        tags: post.tags || []
      }))

      // Update cache
      blogCache = transformedData
      cacheTimestamp = now

      return transformedData
    } catch (error) {
      console.error('Error in getAllBlogPosts:', error)
      return blogCache || []
    }
  },

  // Get published blog posts only
  getPublishedBlogPosts: async (forceRefresh = false): Promise<BlogPost[]> => {
    const allPosts = await blogDataManager.getAllBlogPosts(forceRefresh)
    return allPosts.filter(post => post.published && post.is_active)
  },

  // Get featured blog posts
  getFeaturedBlogPosts: async (limit?: number): Promise<BlogPost[]> => {
    const allPosts = await blogDataManager.getAllBlogPosts()
    const featured = allPosts.filter(post => post.featured && post.published && post.is_active)
    return limit ? featured.slice(0, limit) : featured
  },

  // Get blog post by slug
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data } = await api.get<BlogPost>(`/api/blog-posts/slug/${slug}`)

      if (!data) return null

      return {
        ...data,
        tags: data.tags || []
      }
    } catch (error) {
      console.error('Error in getBlogPostBySlug:', error)
      return null
    }
  },

  // Get blog post by ID
  getBlogPostById: async (id: string): Promise<BlogPost | null> => {
    try {
      const { data } = await api.get<BlogPost>(`/api/blog-posts/${id}`)

      if (!data) return null

      return {
        ...data,
        tags: data.tags || []
      }
    } catch (error) {
      console.error('Error in getBlogPostById:', error)
      return null
    }
  },

  // Create new blog post
  createBlogPost: async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'display_order'>): Promise<BlogPost | null> => {
    try {
      // Generate slug if not provided
      let slug = postData.slug
      if (!slug) {
        slug = postData.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      // Calculate read time
      const readTime = Math.max(1, Math.ceil(postData.content.trim().split(/\s+/).length / 200))

      const { data } = await api.post<BlogPost>('/api/blog-posts', {
        ...postData,
        slug,
        read_time: readTime,
        tags: postData.tags || []
      })

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return {
        ...data,
        tags: data.tags || []
      }
    } catch (error) {
      console.error('Error in createBlogPost:', error)
      return null
    }
  },

  // Update blog post
  updateBlogPost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
    try {
      // If title is being updated, regenerate slug
      if (updates.title) {
        const newSlug = updates.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
        updates.slug = newSlug
      }

      // Recalculate read time if content is updated
      if (updates.content) {
        updates.read_time = Math.max(1, Math.ceil(updates.content.trim().split(/\s+/).length / 200))
      }

      const { data } = await api.put<BlogPost>(`/api/blog-posts/${id}`, updates)

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return {
        ...data,
        tags: data.tags || []
      }
    } catch (error) {
      console.error('Error in updateBlogPost:', error)
      return null
    }
  },

  // Delete blog post (soft delete)
  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      await api.put(`/api/blog-posts/${id}`, { is_active: false })

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return true
    } catch (error) {
      console.error('Error in deleteBlogPost:', error)
      return false
    }
  },

  // Reorder blog posts
  reorderBlogPost: async (id: string, direction: 'up' | 'down'): Promise<boolean> => {
    try {
      // Get current post
      const currentPost = await blogDataManager.getBlogPostById(id)
      if (!currentPost) return false

      // Get all posts ordered by display_order
      const allPosts = await blogDataManager.getAllBlogPosts(true)
      const currentIndex = allPosts.findIndex(post => post.id === id)

      if (currentIndex === -1) return false

      let targetIndex: number
      if (direction === 'up' && currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else if (direction === 'down' && currentIndex < allPosts.length - 1) {
        targetIndex = currentIndex + 1
      } else {
        return false // Can't move further
      }

      const targetPost = allPosts[targetIndex]

      // Swap display orders
      await api.put(`/api/blog-posts/${currentPost.id}`, { display_order: targetPost.display_order })
      await api.put(`/api/blog-posts/${targetPost.id}`, { display_order: currentPost.display_order })

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return true
    } catch (error) {
      console.error('Error in reorderBlogPost:', error)
      return false
    }
  },

  // Toggle featured status
  toggleFeatured: async (id: string): Promise<boolean> => {
    try {
      const currentPost = await blogDataManager.getBlogPostById(id)
      if (!currentPost) return false

      await api.put(`/api/blog-posts/${id}`, { featured: !currentPost.featured })

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return true
    } catch (error) {
      console.error('Error in toggleFeatured:', error)
      return false
    }
  },

  // Toggle published status
  togglePublished: async (id: string): Promise<boolean> => {
    try {
      const currentPost = await blogDataManager.getBlogPostById(id)
      if (!currentPost) return false

      await api.put(`/api/blog-posts/${id}`, { published: !currentPost.published })

      // Invalidate cache
      blogCache = null
      cacheTimestamp = 0

      return true
    } catch (error) {
      console.error('Error in togglePublished:', error)
      return false
    }
  },

  // Search blog posts
  searchBlogPosts: async (query: string, category?: string): Promise<BlogPost[]> => {
    try {
      const params: Record<string, string> = {}
      if (query.trim()) params.search = query
      if (category && category !== 'All') params.category = category

      const { data } = await api.get<BlogPost[]>('/api/blog-posts', { params })

      return (data || []).map(post => ({
        ...post,
        tags: post.tags || []
      }))
    } catch (error) {
      console.error('Error in searchBlogPosts:', error)
      return []
    }
  },

  // Get blog posts by category
  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    if (category === 'All') {
      return blogDataManager.getPublishedBlogPosts()
    }

    try {
      const { data } = await api.get<BlogPost[]>('/api/blog-posts', {
        params: { category },
      })

      return (data || []).map(post => ({
        ...post,
        tags: post.tags || []
      }))
    } catch (error) {
      console.error('Error in getBlogPostsByCategory:', error)
      return []
    }
  }
}
