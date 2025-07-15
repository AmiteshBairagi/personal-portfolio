"use client"

import { createClient } from "@supabase/supabase-js"
import { useState, useEffect, useCallback } from "react"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface CertificationItem {
  id: string
  title: string
  issuer: string
  date: string
  credentialId: string
  image: string
  description: string
  skills: string[]
  verificationUrl: string
  featured: boolean
  validUntil: string
  level: "Professional" | "Associate" | "Expert"
  examScore: string
}

// For backward compatibility
export type Certification = CertificationItem

export const initialCertificationsData: CertificationItem[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-SAA-2024-001",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Validates expertise in designing distributed systems on AWS. This certification demonstrates the ability to design and deploy scalable, highly available, and fault-tolerant systems on Amazon Web Services. It covers architectural best practices, security implementation, cost optimization, and operational excellence.",
    skills: ["AWS", "Cloud Architecture", "Security", "Scalability"],
    verificationUrl: "https://aws.amazon.com/verification",
    featured: true,
    validUntil: "2027",
    level: "Professional",
    examScore: "892/1000",
  },
  {
    id: "2",
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2023",
    credentialId: "GCP-PD-2023-002",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Demonstrates ability to build scalable applications on Google Cloud Platform. This certification validates skills in designing, building, testing, and deploying cloud-native applications using Google Cloud technologies and best practices.",
    skills: ["Google Cloud", "Kubernetes", "APIs", "DevOps"],
    verificationUrl: "https://cloud.google.com/certification",
    featured: true,
    validUntil: "2026",
    level: "Professional",
    examScore: "85%",
  },
]

// Supabase data service
export const certificationsDataService = {
  async getData(): Promise<CertificationItem[]> {
    try {
      const { data, error } = await supabase.from("certifications").select("*")

      if (error) {
        console.error("Error fetching certifications from Supabase:", error)
        return initialCertificationsData
      }

      return data && data.length > 0 ? data : initialCertificationsData
    } catch (error) {
      console.error("Unexpected error fetching certifications:", error)
      return initialCertificationsData
    }
  },

  async addItem(item: CertificationItem): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("certifications").insert([item])
      if (error) {
        console.error("Error adding certification:", error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error("Error adding certification:", error)
      return { success: false, error: "Failed to add certification" }
    }
  },

  async updateItem(id: string, updates: Partial<CertificationItem>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("certifications").update(updates).eq("id", id)

      if (error) {
        console.error("Error updating certification:", error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error("Error updating certification:", error)
      return { success: false, error: "Failed to update certification" }
    }
  },

  async deleteItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id)
      if (error) {
        console.error("Error deleting certification:", error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error("Error deleting certification:", error)
      return { success: false, error: "Failed to delete certification" }
    }
  },

  async resetData(): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete all existing data
      await supabase.from("certifications").delete().neq("id", "")

      // Insert default data
      const { error } = await supabase.from("certifications").insert(initialCertificationsData)
      if (error) {
        console.error("Error resetting certifications data:", error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error("Error resetting certifications data:", error)
      return { success: false, error: "Failed to reset certifications data" }
    }
  },

  subscribe(callback: () => void): () => void {
    const channel = supabase
      .channel("certifications-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "certifications" }, () => {
        callback()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}

// Global state management for certifications using Supabase
let globalCertificationsData: CertificationItem[] = initialCertificationsData
const subscribers = new Set<(data: CertificationItem[]) => void>()

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback([...globalCertificationsData]))
}

const loadFromSupabase = async () => {
  try {
    // Remove the order by created_at since that column doesn't exist
    const { data, error } = await supabase.from("certifications").select("*")

    if (error) {
      console.error("Error fetching certifications from Supabase:", error)
      return
    }

    globalCertificationsData = data && data.length > 0 ? data : initialCertificationsData
    notifySubscribers()
  } catch (error) {
    console.error("Unexpected error fetching certifications:", error)
  }
}

// Initialize data from Supabase
loadFromSupabase()

// Updated hook that ensures certificationsData is always an array
export function useCertificationsData() {
  const [certificationsData, setCertificationsData] = useState<CertificationItem[]>(globalCertificationsData || [])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const updateData = (newData: CertificationItem[]) => {
      setCertificationsData(newData || [])
    }

    subscribers.add(updateData)

    // Set initial data
    setCertificationsData(globalCertificationsData || [])

    return () => {
      subscribers.delete(updateData)
    }
  }, [])

  const updateCertifications = useCallback(async (newData: CertificationItem[]) => {
    try {
      // Delete all existing certifications
      await supabase.from("certifications").delete().neq("id", "")

      // Insert new certifications
      if (newData.length > 0) {
        const { error } = await supabase.from("certifications").insert(newData)
        if (error) throw error
      }

      globalCertificationsData = newData || []
      notifySubscribers()
    } catch (error) {
      console.error("Error updating certifications:", error)
      throw error
    }
  }, [])

  const addCertification = useCallback(async (certification: CertificationItem) => {
    try {
      const { error } = await supabase.from("certifications").insert([certification])
      if (error) throw error

      await loadFromSupabase()
    } catch (error) {
      console.error("Error adding certification:", error)
      throw error
    }
  }, [])

  const updateCertification = useCallback(async (id: string, updatedCertification: CertificationItem) => {
    try {
      const { error } = await supabase.from("certifications").update(updatedCertification).eq("id", id)

      if (error) throw error

      await loadFromSupabase()
    } catch (error) {
      console.error("Error updating certification:", error)
      throw error
    }
  }, [])

  const deleteCertification = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id)
      if (error) throw error

      await loadFromSupabase()
    } catch (error) {
      console.error("Error deleting certification:", error)
      throw error
    }
  }, [])

  const saveCertifications = useCallback(
    async (data: CertificationItem[]) => {
      setIsLoading(true)
      try {
        await updateCertifications(data || [])
        return { success: true }
      } catch (error) {
        console.error("Failed to save certifications:", error)
        return { success: false, error: "Failed to save certifications" }
      } finally {
        setIsLoading(false)
      }
    },
    [updateCertifications],
  )

  return {
    certificationsData: certificationsData || [],
    isLoading,
    addCertification,
    updateCertification,
    deleteCertification,
    saveCertifications,
    updateCertifications,
  }
}
