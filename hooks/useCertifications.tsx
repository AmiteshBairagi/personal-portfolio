"use client"

import { useState, useEffect, useCallback } from "react"
import { certificationService, type CertificationItem } from "@/lib/data/certificationService"

const useCertifications = () => {
  const [data, setData] = useState<CertificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Load data function
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const certifications = await certificationService.getData()
      setData(certifications)
      // setLastSyncTime(new Date())
    } catch (err) {
      console.error("Error loading certifications:", err)
      setError("Failed to load certifications")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data and set up real-time subscription
  useEffect(() => {
    // Initial load
    loadData()
    return () => {
    }
  }, [loadData])

  const addCertification = useCallback(
    async (certification: Omit<CertificationItem, "id" | "created_at" | "updated_at">) => {
      try {
        const result = await certificationService.addItem(certification)
        if (result.success) {
          // Data will be updated via real-time subscription
          return { success: true, data: result.data }
        } else {
          setError(result.error || "Failed to add certification")
          return { success: false, error: result.error }
        }
      } catch (err) {
        const errorMsg = "Failed to add certification"
        setError(errorMsg)
        console.error("Error adding certification:", err)
        return { success: false, error: errorMsg }
      }
    },
    [],
  )

  const updateCertification = useCallback(async (id: string, updates: Partial<CertificationItem>) => {
    try {
      const result = await certificationService.updateItem(id, updates)
      if (result.success) {
        // Data will be updated via real-time subscription
        return { success: true }
      } else {
        setError(result.error || "Failed to update certification")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = "Failed to update certification"
      setError(errorMsg)
      console.error("Error updating certification:", err)
      return { success: false, error: errorMsg }
    }
  }, [])

  const deleteCertification = useCallback(async (id: string) => {
    try {
      const result = await certificationService.deleteItem(id)
      if (result.success) {
        // Data will be updated via real-time subscription
        return { success: true }
      } else {
        setError(result.error || "Failed to delete certification")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = "Failed to delete certification"
      setError(errorMsg)
      console.error("Error deleting certification:", err)
      return { success: false, error: errorMsg }
    }
  }, [])

  // const reorderCertifications = useCallback(async (certifications: CertificationItem[]) => {
  //   try {
  //     const result = await certificationService.reorderItems(certifications)
  //     if (result.success) {
  //       // Data will be updated via real-time subscription
  //       return { success: true }
  //     } else {
  //       setError(result.error || "Failed to reorder certifications")
  //       return { success: false, error: result.error }
  //     }
  //   } catch (err) {
  //     const errorMsg = "Failed to reorder certifications"
  //     setError(errorMsg)
  //     console.error("Error reordering certifications:", err)
  //     return { success: false, error: errorMsg }
  //   }
  // }, [])

  // const moveCertificationUp = useCallback(async (id: string) => {
  //   try {
  //     const result = await certificationService.moveItemUp(id)
  //     if (result.success) {
  //       return { success: true }
  //     } else {
  //       setError(result.error || "Failed to move certification up")
  //       return { success: false, error: result.error }
  //     }
  //   } catch (err) {
  //     const errorMsg = "Failed to move certification up"
  //     setError(errorMsg)
  //     console.error("Error moving certification up:", err)
  //     return { success: false, error: errorMsg }
  //   }
  // }, [])

  // const moveCertificationDown = useCallback(async (id: string) => {
  //   try {
  //     const result = await certificationService.moveItemDown(id)
  //     if (result.success) {
  //       return { success: true }
  //     } else {
  //       setError(result.error || "Failed to move certification down")
  //       return { success: false, error: result.error }
  //     }
  //   } catch (err) {
  //     const errorMsg = "Failed to move certification down"
  //     setError(errorMsg)
  //     console.error("Error moving certification down:", err)
  //     return { success: false, error: errorMsg }
  //   }
  // }, [])

  // const searchCertifications = useCallback(async (query: string) => {
  //   try {
  //     setLoading(true)
  //     const results = await certificationService.searchItems(query)
  //     return { success: true, data: results }
  //   } catch (err) {
  //     console.error("Error searching certifications:", err)
  //     return { success: false, error: "Failed to search certifications" }
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

  // const getFeaturedCertifications = useCallback(async () => {
  //   try {
  //     const featured = await certificationService.getFeaturedItems()
  //     return { success: true, data: featured }
  //   } catch (err) {
  //     console.error("Error getting featured certifications:", err)
  //     return { success: false, error: "Failed to get featured certifications" }
  //   }
  // }, [])

  // Refresh data manually
  
  
  const refresh = useCallback(() => {
    certificationService.clearCache()
    loadData()
  }, [loadData])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Data
    data,
    loading,
    error,

    addCertification,
    updateCertification,
    deleteCertification,
 
    refresh,
    clearError,
  }
}


export default useCertifications