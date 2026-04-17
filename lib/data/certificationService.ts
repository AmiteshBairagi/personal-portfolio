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

interface CertificationApiItem {
  id: string
  title: string
  issuer: string
  date: string
  credentialId: string
  imageUrl: string
  imagePublicId?: string
  description: string
  skills: string[]
  verificationUrl: string
  featured?: boolean
  validUntil: string
  level: "Professional" | "Associate" | "Expert"
  examScore?: string
  displayOrder?: number
  createdAt?: string
  updatedAt?: string
}

export const certificationService = {
  async getData(): Promise<CertificationItem[]> {
    try {
      const { data } = await api.get<CertificationApiItem[]>("/api/get-all-certifications")

      const transformedData: CertificationItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credentialId,
        image: item.imageUrl || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verificationUrl,
        featured: item.featured || false,
        valid_until: item.validUntil,
        level: item.level,
        exam_score: item.examScore || "",
        display_order: item.displayOrder || 0,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
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

      const payload = {
        ...item,
        credentialId: item.credential_id,
        verificationUrl: item.verification_url,
        validUntil: item.valid_until,
        examScore: item.exam_score,
        displayOrder: item.display_order,
      }

      delete (payload as Partial<CertificationItem>).credential_id
      delete (payload as Partial<CertificationItem>).verification_url
      delete (payload as Partial<CertificationItem>).valid_until
      delete (payload as Partial<CertificationItem>).exam_score
      delete (payload as Partial<CertificationItem>).display_order
      delete (payload as Partial<CertificationItem>).image

      formData.append("body", new Blob([JSON.stringify(payload)], { type: "application/json" }))

      if (imageFile) {
        formData.append("image", imageFile)
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

      const payload = {
        ...updateData,
        credentialId: updateData.credential_id,
        verificationUrl: updateData.verification_url,
        validUntil: updateData.valid_until,
        examScore: updateData.exam_score,
        displayOrder: updateData.display_order,
      }

      delete (payload as Partial<CertificationItem>).credential_id
      delete (payload as Partial<CertificationItem>).verification_url
      delete (payload as Partial<CertificationItem>).valid_until
      delete (payload as Partial<CertificationItem>).exam_score
      delete (payload as Partial<CertificationItem>).display_order
      delete (payload as Partial<CertificationItem>).image

      formData.append("body", new Blob([JSON.stringify(payload)], { type: "application/json" }))

      if (imageFile) {
        formData.append("image", imageFile)
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
      const { data } = await api.get<CertificationApiItem[]>("/api/certifications", {
        params: { search: query },
      })

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credentialId,
        image: item.imageUrl || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verificationUrl,
        featured: item.featured || false,
        valid_until: item.validUntil,
        level: item.level,
        exam_score: item.examScore || "",
        display_order: item.displayOrder || 0,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      }))
    } catch (error) {
      console.error("Error searching certifications:", error)
      return []
    }
  },

  async getFeaturedItems(): Promise<CertificationItem[]> {
    try {
      const { data } = await api.get<CertificationApiItem[]>("/api/certifications", {
        params: { featured: true },
      })

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credential_id: item.credentialId,
        image: item.imageUrl || "/placeholder.svg?height=400&width=600",
        description: item.description,
        skills: item.skills || [],
        verification_url: item.verificationUrl,
        featured: item.featured || false,
        valid_until: item.validUntil,
        level: item.level,
        exam_score: item.examScore || "",
        display_order: item.displayOrder || 0,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching featured certifications:", error)
      return []
    }
  }
}
