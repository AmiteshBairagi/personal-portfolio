// import type { BlogPost } from "@/lib/blog-types"
// import { blogPosts as initialBlogPosts } from "@/lib/blog-data"

// class BlogStore {
//   private posts: BlogPost[] = []
//   private listeners: Set<() => void> = new Set()

//   constructor() {
//     this.posts = [...initialBlogPosts]
//   }

//   // Subscribe to store changes
//   subscribe(listener: () => void) {
//     this.listeners.add(listener)
//     return () => this.listeners.delete(listener)
//   }

//   // Notify all listeners of changes
//   private notify() {
//     this.listeners.forEach((listener) => listener())
//   }

//   // Get all posts
//   getAllPosts(): BlogPost[] {
//     return [...this.posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
//   }

//   // Get post by ID
//   getPostById(id: string): BlogPost | null {
//     return this.posts.find((post) => post.id === id) || null
//   }

//   // Get post by slug
//   getPostBySlug(slug: string): BlogPost | null {
//     return this.posts.find((post) => post.slug === slug) || null
//   }

//   // Generate unique slug
//   generateSlug(title: string, excludeId?: string): string {
//     const baseSlug = title
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/[\s_-]+/g, "-")
//       .replace(/^-+|-+$/g, "")

//     let slug = baseSlug
//     let counter = 1

//     while (this.posts.some((post) => post.slug === slug && post.id !== excludeId)) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     return slug
//   }

//   // Calculate read time
//   calculateReadTime(content: string): number {
//     const wordsPerMinute = 200
//     const wordCount = content.trim().split(/\s+/).length
//     return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
//   }

//   // Add new post
//   addPost(postData: Omit<BlogPost, "id" | "slug" | "publishedAt" | "updatedAt" | "readTime">): BlogPost {
//     const now = new Date().toISOString().split("T")[0]
//     const newPost: BlogPost = {
//       ...postData,
//       id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       slug: this.generateSlug(postData.title),
//       publishedAt: now,
//       updatedAt: now,
//       readTime: this.calculateReadTime(postData.content),
//       tags: postData.tags || [],
//     }

//     this.posts.unshift(newPost)
//     this.notify()
//     return newPost
//   }

//   // Update existing post
//   updatePost(id: string, updates: Partial<BlogPost>): boolean {
//     const index = this.posts.findIndex((post) => post.id === id)
//     if (index === -1) return false

//     const existingPost = this.posts[index]
//     const updatedPost = { ...existingPost, ...updates }

//     // Regenerate slug if title changed
//     if (updates.title && updates.title !== existingPost.title) {
//       updatedPost.slug = this.generateSlug(updates.title, id)
//     }

//     // Recalculate read time if content changed
//     if (updates.content && updates.content !== existingPost.content) {
//       updatedPost.readTime = this.calculateReadTime(updates.content)
//     }

//     updatedPost.updatedAt = new Date().toISOString().split("T")[0]
//     this.posts[index] = updatedPost
//     this.notify()
//     return true
//   }

//   // Delete post
//   deletePost(id: string): boolean {
//     const initialLength = this.posts.length
//     this.posts = this.posts.filter((post) => post.id !== id)
//     if (this.posts.length < initialLength) {
//       this.notify()
//       return true
//     }
//     return false
//   }

//   // Toggle featured status
//   toggleFeatured(id: string): boolean {
//     const post = this.posts.find((p) => p.id === id)
//     if (!post) return false

//     post.featured = !post.featured
//     post.updatedAt = new Date().toISOString().split("T")[0]
//     this.notify()
//     return true
//   }

//   // Toggle published status
//   togglePublished(id: string): boolean {
//     const post = this.posts.find((p) => p.id === id)
//     if (!post) return false

//     post.published = !post.published
//     post.updatedAt = new Date().toISOString().split("T")[0]
//     this.notify()
//     return true
//   }

//   // Get published posts
//   getPublishedPosts(): BlogPost[] {
//     return this.posts.filter((post) => post.published)
//   }

//   // Get featured posts
//   getFeaturedPosts(): BlogPost[] {
//     return this.posts.filter((post) => post.featured && post.published)
//   }

//   // Search posts
//   searchPosts(query: string, category?: string): BlogPost[] {
//     const searchTerm = query.toLowerCase().trim()

//     return this.posts.filter((post) => {
//       const matchesSearch =
//         !searchTerm ||
//         post.title.toLowerCase().includes(searchTerm) ||
//         post.excerpt.toLowerCase().includes(searchTerm) ||
//         post.content.toLowerCase().includes(searchTerm) ||
//         post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

//       const matchesCategory = !category || category === "All" || post.category === category

//       return matchesSearch && matchesCategory
//     })
//   }
// }

// // Create singleton instance
// export const blogStore = new BlogStore()
