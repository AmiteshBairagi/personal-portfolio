"use client"

import { api } from "@/lib/axios"

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

export const certificationService = {
  // Get all certifications with caching
  async getData(): Promise<CertificationItem[]> {
    const now = Date.now()

    // Return cached data if still valid
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      return cachedData
    }

    try {
      const { data } = await api.get<CertificationItem[]>("/api/certifications")

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
    imageFile?: File
  ): Promise<{ success: boolean; error?: string; data?: CertificationItem }> {
    try {
      const formData = new FormData()
      
      Object.keys(item).forEach(key => {
        const value = item[key as keyof typeof item]
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      if (imageFile) {
        formData.append('imageFile', imageFile)
      }

      const { data } = await api.post<CertificationItem>("/api/certifications", formData)

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true, data }
    } catch (error) {
      console.error("Error adding certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to add certification" }
    }
  },

  // Update certification
  async updateItem(
    id: string, 
    updates: Partial<CertificationItem>,
    imageFile?: File
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData()
      
      // Remove readonly fields
      const { created_at, updated_at, ...updateData } = updates

      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof typeof updateData]
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      if (imageFile) {
        formData.append('imageFile', imageFile)
      }

      await api.put(`/api/certifications/${id}`, formData)

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true }
    } catch (error) {
      console.error("Error updating certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to update certification" }
    }
  },

  // Delete certification
  async deleteItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await api.delete(`/api/certifications/${id}`)

      // Clear cache
      cachedData = null

      // Notify subscribers
      notifySubscribers()

      return { success: true }
    } catch (error) {
      console.error("Error deleting certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to delete certification" }
    }
  },

  // Reorder certifications
  async reorderItems(items: CertificationItem[]): Promise<{ success: boolean; error?: string }> {
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }))

      for (const update of updates) {
        await api.put(`/api/certifications/${update.id}`, { display_order: update.display_order })
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
      const { data } = await api.get<CertificationItem[]>("/api/certifications", {
        params: { search: query },
      })

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
      const { data } = await api.get<CertificationItem[]>("/api/certifications", {
        params: { featured: true },
      })

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

  // Subscribe to changes (local subscriber pattern only, no real-time)
  subscribe(callback: () => void): () => void {
    subscribers.add(callback)
    return () => {
      subscribers.delete(callback)
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
