"use client"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface CertificationItem {
  id: string
  title: string
  issuer: string
  date: string
  credential_id: string
  image: string
  description: string
  skills: string[]
  verification_url: string
  featured: boolean
  valid_until: string
  level: "Professional" | "Associate" | "Expert"
  exam_score: string
  display_order: number
  created_at?: string
  updated_at?: string
}

// Cache management
let cachedData: CertificationItem[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Subscription management
const subscribers = new Set<() => void>()

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback())
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Helper function to ensure unique slug
const ensureUniqueSlug = async (baseSlug: string, excludeId?: string): Promise<string> => {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data, error } = await supabase
      .from("certifications")
      .select("id")
      .eq("id", slug)
      .neq("id", excludeId || "")

    if (error) {
      console.error("Error checking slug uniqueness:", error)
      break
    }

    if (!data || data.length === 0) {
      break
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export const certificationsDataManager = {
  // Get all certifications with caching
  async getData(): Promise<CertificationItem[]> {
    const now = Date.now()

    // Return cached data if still valid
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      return cachedData
    }

    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching certifications:", error)
        return cachedData || []
      }

      // Transform data to match interface
      const transformedData: CertificationItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credential_id,
        image: item.image || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verification_url,
        featured: item.featured || false,
        valid_until: item.valid_until,
        level: item.level,
        exam_score: item.exam_score || "",
        display_order: item.display_order || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))

      // Update cache
      cachedData = transformedData
      cacheTimestamp = now

      return transformedData
    } catch (error) {
      console.error("Unexpected error fetching certifications:", error)
      return cachedData || []
    }
  },

  // Add new certification
  async addItem(
    item: Omit<CertificationItem, "id" | "created_at" | "updated_at">,
  ): Promise<{ success: boolean; error?: string; data?: CertificationItem }> {
    try {
      // Generate unique ID from title
      const baseId = generateSlug(item.title)
      const uniqueId = await ensureUniqueSlug(baseId)

      // Get next display order
      const { data: maxOrderData } = await supabase
        .from("certifications")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

      const newItem = {
        ...item,
        id: uniqueId,
        display_order: nextOrder,
        skills: item.skills || [],
      }

      const { data, error } = await supabase.from("certifications").insert([newItem]).select().single()

      if (error) {
        console.error("Error adding certification:", error)
        return { success: false, error: error.message }
      }

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true, data: data as CertificationItem }
    } catch (error) {
      console.error("Error adding certification:", error)
      return { success: false, error: "Failed to add certification" }
    }
  },

  // Update certification
  async updateItem(id: string, updates: Partial<CertificationItem>): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove readonly fields
      const { created_at, updated_at, ...updateData } = updates

      const { error } = await supabase.from("certifications").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating certification:", error)
        return { success: false, error: error.message }
      }

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true }
    } catch (error) {
      console.error("Error updating certification:", error)
      return { success: false, error: "Failed to update certification" }
    }
  },

  // Delete certification
  async deleteItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id)

      if (error) {
        console.error("Error deleting certification:", error)
        return { success: false, error: error.message }
      }

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true }
    } catch (error) {
      console.error("Error deleting certification:", error)
      return { success: false, error: "Failed to delete certification" }
    }
  },

  // Reorder certifications
  async reorderItems(items: CertificationItem[]): Promise<{ success: boolean; error?: string }> {
    try {
      // Update display_order for each item
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from("certifications")
          .update({ display_order: update.display_order })
          .eq("id", update.id)

        if (error) {
          console.error("Error reordering certification:", error)
          return { success: false, error: error.message }
        }
      }

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true }
    } catch (error) {
      console.error("Error reordering certifications:", error)
      return { success: false, error: "Failed to reorder certifications" }
    }
  },

  // Move item up in order
  async moveItemUp(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const data = await this.getData()
      const currentIndex = data.findIndex((item) => item.id === id)

      if (currentIndex <= 0) {
        return { success: false, error: "Item is already at the top" }
      }

      // Swap with previous item
      const newData = [...data]
      ;[newData[currentIndex - 1], newData[currentIndex]] = [newData[currentIndex], newData[currentIndex - 1]]

      return await this.reorderItems(newData)
    } catch (error) {
      console.error("Error moving certification up:", error)
      return { success: false, error: "Failed to move certification up" }
    }
  },

  // Move item down in order
  async moveItemDown(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const data = await this.getData()
      const currentIndex = data.findIndex((item) => item.id === id)

      if (currentIndex >= data.length - 1 || currentIndex === -1) {
        return { success: false, error: "Item is already at the bottom" }
      }

      // Swap with next item
      const newData = [...data]
      ;[newData[currentIndex], newData[currentIndex + 1]] = [newData[currentIndex + 1], newData[currentIndex]]

      return await this.reorderItems(newData)
    } catch (error) {
      console.error("Error moving certification down:", error)
      return { success: false, error: "Failed to move certification down" }
    }
  },

  // Search certifications
  async searchItems(query: string): Promise<CertificationItem[]> {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .or(`title.ilike.%${query}%,issuer.ilike.%${query}%,description.ilike.%${query}%`)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error searching certifications:", error)
        return []
      }

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credential_id,
        image: item.image || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verification_url,
        featured: item.featured || false,
        valid_until: item.valid_until,
        level: item.level,
        exam_score: item.exam_score || "",
        display_order: item.display_order || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    } catch (error) {
      console.error("Error searching certifications:", error)
      return []
    }
  },

  // Get featured certifications
  async getFeaturedItems(): Promise<CertificationItem[]> {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("featured", true)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching featured certifications:", error)
        return []
      }

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credential_id,
        image: item.image || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verification_url,
        featured: item.featured || false,
        valid_until: item.valid_until,
        level: item.level,
        exam_score: item.exam_score || "",
        display_order: item.display_order || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    } catch (error) {
      console.error("Error fetching featured certifications:", error)
      return []
    }
  },

  // Subscribe to real-time changes
  subscribe(callback: () => void): () => void {
    subscribers.add(callback)

    // Set up real-time subscription
    const channel = supabase
      .channel("certifications-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "certifications" }, () => {
        // Clear cache when data changes
        cachedData = null
        callback()
      })
      .subscribe()

    // Return unsubscribe function
    return () => {
      subscribers.delete(callback)
      supabase.removeChannel(channel)
    }
  },

  // Clear cache manually
  clearCache(): void {
    cachedData = null
    cacheTimestamp = 0
  },

  // Get cache status
  getCacheStatus(): { cached: boolean; age: number } {
    const now = Date.now()
    return {
      cached: cachedData !== null,
      age: cachedData ? now - cacheTimestamp : 0,
    }
  },
}
