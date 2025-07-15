// "use client"

// import { useState, useEffect } from "react"
// import { blogStore } from "@/lib/blog-store"
// import type { BlogPost } from "@/lib/blog-types"

// export function useBlogManager() {
//   const [posts, setPosts] = useState<BlogPost[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   // Subscribe to store changes
//   useEffect(() => {
//     const updatePosts = () => {
//       setPosts(blogStore.getAllPosts())
//     }

//     // Initial load
//     updatePosts()

//     // Subscribe to changes
//     const unsubscribe = blogStore.subscribe(updatePosts)
//     return unsubscribe
//   }, [])

//   // Add post
//   const addPost = async (
//     postData: Omit<BlogPost, "id" | "slug" | "publishedAt" | "updatedAt" | "readTime">,
//   ): Promise<{ success: boolean; post?: BlogPost; error?: string }> => {
//     try {
//       setIsLoading(true)
//       const newPost = blogStore.addPost(postData)
//       return { success: true, post: newPost }
//     } catch (error) {
//       return { success: false, error: "Failed to add post" }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Update post
//   const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<{ success: boolean; error?: string }> => {
//     try {
//       setIsLoading(true)
//       const success = blogStore.updatePost(id, updates)
//       return success ? { success: true } : { success: false, error: "Post not found" }
//     } catch (error) {
//       return { success: false, error: "Failed to update post" }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Delete post
//   const deletePost = async (id: string): Promise<{ success: boolean; error?: string }> => {
//     try {
//       setIsLoading(true)
//       const success = blogStore.deletePost(id)
//       return success ? { success: true } : { success: false, error: "Post not found" }
//     } catch (error) {
//       return { success: false, error: "Failed to delete post" }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Toggle featured
//   const toggleFeatured = async (id: string): Promise<{ success: boolean; error?: string }> => {
//     try {
//       const success = blogStore.toggleFeatured(id)
//       return success ? { success: true } : { success: false, error: "Post not found" }
//     } catch (error) {
//       return { success: false, error: "Failed to toggle featured status" }
//     }
//   }

//   // Toggle published
//   const togglePublished = async (id: string): Promise<{ success: boolean; error?: string }> => {
//     try {
//       const success = blogStore.togglePublished(id)
//       return success ? { success: true } : { success: false, error: "Post not found" }
//     } catch (error) {
//       return { success: false, error: "Failed to toggle published status" }
//     }
//   }

//   // Get post by ID
//   const getPostById = (id: string): BlogPost | null => {
//     return blogStore.getPostById(id)
//   }

//   // Search posts
//   const searchPosts = (query: string, category?: string): BlogPost[] => {
//     return blogStore.searchPosts(query, category)
//   }

//   return {
//     posts,
//     isLoading,
//     addPost,
//     updatePost,
//     deletePost,
//     toggleFeatured,
//     togglePublished,
//     getPostById,
//     searchPosts,
//   }
// }
