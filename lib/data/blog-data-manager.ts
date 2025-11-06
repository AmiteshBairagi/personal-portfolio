import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)



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

// Real-time subscription
let subscription: any = null

export const blogDataManager = {
  // Initialize real-time subscription
  initializeSubscription: (callback?: () => void) => {
    if (subscription) return

    subscription = supabase
      .channel('blog_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          console.log('Blog posts changed:', payload)
          // Invalidate cache
          blogCache = null
          cacheTimestamp = 0
          // Notify callback
          if (callback) callback()
        }
      )
      .subscribe()
  },

  // Cleanup subscription
  cleanup: () => {
    if (subscription) {
      supabase.removeChannel(subscription)
      subscription = null
    }
  },

  // Get all blog posts with caching
  getAllBlogPosts: async (forceRefresh = false): Promise<BlogPost[]> => {
    const now = Date.now()
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && blogCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return blogCache
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Error fetching blog posts:', error)
        return blogCache || []
      }

      // Transform data
      const transformedData = data.map(post => ({
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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.error('Error fetching blog post by slug:', error)
        return null
      }

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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        console.error('Error fetching blog post by ID:', error)
        return null
      }

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

      // Ensure slug is unique
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }

      // Calculate read time
      const readTime = Math.max(1, Math.ceil(postData.content.trim().split(/\s+/).length / 200))

      // Get next display order
      const { data: lastPost } = await supabase
        .from('blog_posts')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single()

      const nextDisplayOrder = (lastPost?.display_order || 0) + 1

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          slug,
          read_time: readTime,
          display_order: nextDisplayOrder,
          tags: postData.tags || []
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating blog post:', error)
        return null
      }

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

        // Check if slug is unique (excluding current post)
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', id)
          .single()

        if (!existingPost) {
          updates.slug = newSlug
        }
      }

      // Recalculate read time if content is updated
      if (updates.content) {
        updates.read_time = Math.max(1, Math.ceil(updates.content.trim().split(/\s+/).length / 200))
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating blog post:', error)
        return null
      }

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
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        console.error('Error deleting blog post:', error)
        return false
      }

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
      const { error: error1 } = await supabase
        .from('blog_posts')
        .update({ display_order: targetPost.display_order })
        .eq('id', currentPost.id)

      const { error: error2 } = await supabase
        .from('blog_posts')
        .update({ display_order: currentPost.display_order })
        .eq('id', targetPost.id)

      if (error1 || error2) {
        console.error('Error reordering blog posts:', error1 || error2)
        return false
      }

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

      const { error } = await supabase
        .from('blog_posts')
        .update({ featured: !currentPost.featured })
        .eq('id', id)

      if (error) {
        console.error('Error toggling featured status:', error)
        return false
      }

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

      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentPost.published })
        .eq('id', id)

      if (error) {
        console.error('Error toggling published status:', error)
        return false
      }

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
      let queryBuilder = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_active', true)
        .eq('published', true)

      if (category && category !== 'All') {
        queryBuilder = queryBuilder.eq('category', category)
      }

      if (query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      }

      const { data, error } = await queryBuilder
        .order('display_order', { ascending: true })
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Error searching blog posts:', error)
        return []
      }

      return data.map(post => ({
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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .eq('published', true)
        .order('display_order', { ascending: true })
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Error fetching blog posts by category:', error)
        return []
      }

      return data.map(post => ({
        ...post,
        tags: post.tags || []
      }))
    } catch (error) {
      console.error('Error in getBlogPostsByCategory:', error)
      return []
    }
  }
}
