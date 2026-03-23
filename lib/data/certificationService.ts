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

export const certificationService = {
  async getData(): Promise<CertificationItem[]> {
    try {
      const { data } = await api.get<CertificationItem[]>("/api/get-all-certifications")

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

      return transformedData
    } catch (error) {
      console.error("Unexpected error fetching certifications:", error)
      return []
    }
  },

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

      const { data } = await api.post<CertificationItem>("/api/add-certification", formData)

      return { success: true, data }
    } catch (error) {
      console.error("Error adding certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to add certification" }
    }
  },

  async updateItem(
    id: string, 
    updates: Partial<CertificationItem>,
    imageFile?: File
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData()
      
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

      await api.put(`/api/update-certification/${id}`, formData)

      return { success: true }
    } catch (error) {
      console.error("Error updating certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to update certification" }
    }
  },

  async deleteItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await api.delete(`/api/delete-certification/${id}`)

      return { success: true }
    } catch (error) {
      console.error("Error deleting certification:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to delete certification" }
    }
  },

  async reorderItems(items: CertificationItem[]): Promise<{ success: boolean; error?: string }> {
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }))

      for (const update of updates) {
        await api.put(`/api/certifications/${update.id}`, { display_order: update.display_order })
      }

      return { success: true }
    } catch (error) {
      console.error("Error reordering certifications:", error)
      return { success: false, error: "Failed to reorder certifications" }
    }
  },

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
  }
}
