"use server"

import { revalidatePath } from "next/cache"
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPostById,
  generateUniqueSlug,
  calculateReadTime,
} from "@/lib/blog-utils"
import type { BlogPost } from "@/lib/blog-types"

// Get all blog posts
export async function getAllPosts() {
  try {
    return { success: true, posts: getAllBlogPosts() }
  } catch (error) {
    console.error("Error getting blog posts:", error)
    return { success: false, error: "Failed to get blog posts" }
  }
}

// Get a single blog post by slug
export async function getPost(slug: string) {
  try {
    const post = getBlogPostBySlug(slug)
    if (!post) {
      return { success: false, error: "Blog post not found" }
    }
    return { success: true, post }
  } catch (error) {
    console.error("Error getting blog post:", error)
    return { success: false, error: "Failed to get blog post" }
  }
}

// Create a new blog post
export async function createPost(postData: Omit<BlogPost, "id" | "slug" | "publishedAt" | "updatedAt" | "readTime">) {
  try {
    // Generate unique ID and slug
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const slug = generateUniqueSlug(postData.title)
    const readTime = calculateReadTime(postData.content)
    const now = new Date().toISOString().split("T")[0]

    const newPost: BlogPost = {
      ...postData,
      id,
      slug,
      publishedAt: now,
      updatedAt: now,
      readTime,
      // Ensure required fields have defaults
      excerpt: postData.excerpt || postData.content.substring(0, 150) + "...",
      author: postData.author || "Amitesh",
      tags: postData.tags || [],
      featured: postData.featured || false,
      published: postData.published !== undefined ? postData.published : true,
    }

    // Save the post
    saveBlogPost(newPost)

    // Revalidate the blog pages
    revalidatePath("/blog")
    revalidatePath(`/blog/${newPost.slug}`)
    revalidatePath("/admin")

    return { success: true, post: newPost }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

// Update an existing blog post
export async function updatePost(id: string, updates: Partial<BlogPost>) {
  try {
    const existingPost = getAllBlogPosts().find((post) => post.id === id)

    if (!existingPost) {
      return { success: false, error: "Blog post not found" }
    }

    const updatedPost = { ...existingPost, ...updates }

    // Regenerate slug if title changed
    if (updates.title && updates.title !== existingPost.title) {
      updatedPost.slug = generateUniqueSlug(updates.title, id)
    }

    // Recalculate read time if content changed
    if (updates.content && updates.content !== existingPost.content) {
      updatedPost.readTime = calculateReadTime(updates.content)
    }

    // Update timestamp
    updatedPost.updatedAt = new Date().toISOString().split("T")[0]

    // Save the updated post
    saveBlogPost(updatedPost)

    // Revalidate the blog pages
    revalidatePath("/blog")
    revalidatePath(`/blog/${updatedPost.slug}`)
    revalidatePath("/admin")

    return { success: true, post: updatedPost }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

// Delete a blog post
export async function deletePost(id: string) {
  try {
    const success = deleteBlogPostById(id)

    if (success) {
      // Revalidate the blog pages
      revalidatePath("/blog")
      revalidatePath("/admin")
      return { success: true }
    } else {
      return { success: false, error: "Blog post not found" }
    }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

// Toggle featured status
export async function toggleFeatured(id: string) {
  try {
    const posts = getAllBlogPosts()
    const post = posts.find((p) => p.id === id)

    if (!post) {
      return { success: false, error: "Blog post not found" }
    }

    post.featured = !post.featured
    post.updatedAt = new Date().toISOString().split("T")[0]
    saveBlogPost(post)

    // Revalidate the blog pages
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/admin")

    return { success: true, featured: post.featured }
  } catch (error) {
    console.error("Error toggling featured status:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

// Toggle published status
export async function togglePublished(id: string) {
  try {
    const posts = getAllBlogPosts()
    const post = posts.find((p) => p.id === id)

    if (!post) {
      return { success: false, error: "Blog post not found" }
    }

    post.published = !post.published
    post.updatedAt = new Date().toISOString().split("T")[0]
    saveBlogPost(post)

    // Revalidate the blog pages
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/admin")

    return { success: true, published: post.published }
  } catch (error) {
    console.error("Error toggling published status:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}
