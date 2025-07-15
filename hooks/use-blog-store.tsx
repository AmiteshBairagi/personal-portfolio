import { create } from "zustand"
import type { BlogPost } from "@/lib/blog-types"
import { blogPosts as initialBlogPosts } from "@/lib/blog-data"

interface BlogStore {
  posts: BlogPost[]
  isLoaded: boolean
  initializeStore: () => void
  getPublishedPosts: () => BlogPost[]
  getFeaturedPosts: () => BlogPost[]
  getPostBySlug: (slug: string) => BlogPost | null
  getPostsByCategory: (category: string) => BlogPost[]
  addPost: (post: Omit<BlogPost, "id" | "slug" | "publishedAt" | "updatedAt" | "readTime">) => BlogPost
  updatePost: (id: string, updates: Partial<BlogPost>) => boolean
  deletePost: (id: string) => boolean
  toggleFeatured: (id: string) => boolean
  togglePublished: (id: string) => boolean
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isLoaded: false,

  initializeStore: () => {
    const state = get()
    if (!state.isLoaded) {
      set({
        posts: [...initialBlogPosts],
        isLoaded: true,
      })
    }
  },

  getPublishedPosts: () => {
    const { posts } = get()
    return posts
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  getFeaturedPosts: () => {
    const { posts } = get()
    return posts
      .filter((post) => post.featured && post.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  getPostBySlug: (slug: string) => {
    const { posts } = get()
    return posts.find((post) => post.slug === slug) || null
  },

  getPostsByCategory: (category: string) => {
    const { posts } = get()
    if (category === "All") {
      return get().getPublishedPosts()
    }
    return posts
      .filter((post) => post.category === category && post.published)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  addPost: (postData) => {
    const { posts } = get()
    const now = new Date().toISOString().split("T")[0]

    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug: generateUniqueSlug(postData.title, posts),
      publishedAt: now,
      updatedAt: now,
      readTime: calculateReadTime(postData.content),
      tags: postData.tags || [],
    }

    set({ posts: [newPost, ...posts] })
    return newPost
  },

  updatePost: (id: string, updates: Partial<BlogPost>) => {
    const { posts } = get()
    const index = posts.findIndex((post) => post.id === id)

    if (index === -1) return false

    const existingPost = posts[index]
    const updatedPost = { ...existingPost, ...updates }

    // Regenerate slug if title changed
    if (updates.title && updates.title !== existingPost.title) {
      updatedPost.slug = generateUniqueSlug(updates.title, posts, id)
    }

    // Recalculate read time if content changed
    if (updates.content && updates.content !== existingPost.content) {
      updatedPost.readTime = calculateReadTime(updates.content)
    }

    updatedPost.updatedAt = new Date().toISOString().split("T")[0]

    const newPosts = [...posts]
    newPosts[index] = updatedPost

    set({ posts: newPosts })
    return true
  },

  deletePost: (id: string) => {
    const { posts } = get()
    const newPosts = posts.filter((post) => post.id !== id)

    if (newPosts.length < posts.length) {
      set({ posts: newPosts })
      return true
    }
    return false
  },

  toggleFeatured: (id: string) => {
    const { posts } = get()
    const post = posts.find((p) => p.id === id)

    if (!post) return false

    const updatedPosts = posts.map((p) =>
      p.id === id ? { ...p, featured: !p.featured, updatedAt: new Date().toISOString().split("T")[0] } : p,
    )

    set({ posts: updatedPosts })
    return true
  },

  togglePublished: (id: string) => {
    const { posts } = get()
    const post = posts.find((p) => p.id === id)

    if (!post) return false

    const updatedPosts = posts.map((p) =>
      p.id === id ? { ...p, published: !p.published, updatedAt: new Date().toISOString().split("T")[0] } : p,
    )

    set({ posts: updatedPosts })
    return true
  },
}))

// Helper functions
function generateUniqueSlug(title: string, posts: BlogPost[], excludeId?: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let slug = baseSlug
  let counter = 1

  while (posts.some((post) => post.slug === slug && post.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
