// lib/blog-utils.ts
// Shared helpers for working with blog-post data.

/* ------------------------------------------------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------------------------------------------- */

import { blogPosts as initialBlogPosts } from "./blog-data"

/* ------------------------------------------------------------------------------------------------------------------
 * In-memory storage for blog posts (simulating a database)
 * ---------------------------------------------------------------------------------------------------------------- */

let blogPosts = [...initialBlogPosts]

/* ------------------------------------------------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------------------------------------------------- */

/**
 * Convert an arbitrary string into a URL-safe slug:
 *   "Mastering TypeScript — Advanced Patterns"  ->  "mastering-typescript-advanced-patterns"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // collapse whitespace/underscores → "-"
    .replace(/[^\w-]+/g, "") // drop all non-word chars except "-"
    .replace(/--+/g, "-") // collapse multiple "-" → single
    .replace(/^-+|-+$/g, "") // trim leading/trailing "-"
}

/**
 * True if the blog-post matches a free-text search.
 * We use simple string methods instead of RegExp to avoid
 * any runtime pattern-creation errors.
 */
export function matchSearch(post: any, search: string): boolean {
  if (!search) return true
  const term = search.toLowerCase()

  return (
    post.title.toLowerCase().includes(term) ||
    post.excerpt.toLowerCase().includes(term) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(term))
  )
}

/**
 * Convenience sorter (newest first).
 */
export function sortByDateDesc(a: any, b: any): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

// Get all blog posts
export function getAllBlogPosts(): any[] {
  return [...blogPosts].sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string): any | null {
  return blogPosts.find((post) => post.slug === slug) || null
}

// Get a single blog post by ID
export function getBlogPostById(id: string): any | null {
  return blogPosts.find((post) => post.id === id) || null
}

// Save a blog post (create or update)
export function saveBlogPost(post: any): void {
  const existingIndex = blogPosts.findIndex((p) => p.id === post.id)

  if (existingIndex >= 0) {
    // Update existing post
    blogPosts[existingIndex] = { ...post, updatedAt: new Date().toISOString().split("T")[0] }
  } else {
    // Add new post
    blogPosts.push({
      ...post,
      publishedAt: post.publishedAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    })
  }
}

// Delete a blog post
export function deleteBlogPost(slug: string): boolean {
  const initialLength = blogPosts.length
  blogPosts = blogPosts.filter((post) => post.slug !== slug)
  return blogPosts.length < initialLength
}

// Delete a blog post by ID
export function deleteBlogPostById(id: string): boolean {
  const initialLength = blogPosts.length
  blogPosts = blogPosts.filter((post) => post.id !== id)
  return blogPosts.length < initialLength
}

// Toggle featured status
export function toggleBlogPostFeatured(id: string): boolean {
  const post = blogPosts.find((p) => p.id === id)
  if (post) {
    post.featured = !post.featured
    post.updatedAt = new Date().toISOString().split("T")[0]
    return true
  }
  return false
}

// Toggle published status
export function toggleBlogPostPublished(id: string): boolean {
  const post = blogPosts.find((p) => p.id === id)
  if (post) {
    post.published = !post.published
    post.updatedAt = new Date().toISOString().split("T")[0]
    return true
  }
  return false
}

// Generate unique slug
export function generateUniqueSlug(title: string, excludeId?: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let slug = baseSlug
  let counter = 1

  while (blogPosts.some((post) => post.slug === slug && post.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// Calculate read time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Search blog posts
export function searchBlogPosts(query: string, category?: string): any[] {
  const searchTerm = query.toLowerCase().trim()

  return blogPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    const matchesCategory = !category || category === "All" || post.category === category

    return matchesSearch && matchesCategory
  })
}

// Get featured blog posts
export function getFeaturedBlogPosts(limit?: number): any[] {
  const featured = blogPosts.filter((post) => post.featured && post.published)
  return limit ? featured.slice(0, limit) : featured
}

// Get published blog posts
export function getPublishedBlogPosts(): any[] {
  return blogPosts.filter((post) => post.published)
}

// Get blog posts by category
export function getBlogPostsByCategory(category: string): any[] {
  if (category === "All") return getAllBlogPosts()
  return blogPosts.filter((post) => post.category === category)
}
