"use client"

import { useState, useEffect, useCallback } from "react"
import { certificationsDataManager, type CertificationItem } from "@/lib/data/certifications-data-manager"

export function useCertificationsRealTime() {
  const [data, setData] = useState<CertificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Load data function
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const certifications = await certificationsDataManager.getData()
      setData(certifications)
      setLastSyncTime(new Date())
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

    // Set up real-time subscription
    const unsubscribe = certificationsDataManager.subscribe(() => {
      loadData()
    })

    // Set up online/offline detection
    const handleOnline = () => {
      setIsOnline(true)
      loadData() // Refresh data when coming back online
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial online status
    setIsOnline(navigator.onLine)

    // Cleanup
    return () => {
      unsubscribe()
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [loadData])

  // CRUD operations
  const addCertification = useCallback(
    async (certification: Omit<CertificationItem, "id" | "created_at" | "updated_at">) => {
      try {
        const result = await certificationsDataManager.addItem(certification)
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
      const result = await certificationsDataManager.updateItem(id, updates)
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
      const result = await certificationsDataManager.deleteItem(id)
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

  const reorderCertifications = useCallback(async (certifications: CertificationItem[]) => {
    try {
      const result = await certificationsDataManager.reorderItems(certifications)
      if (result.success) {
        // Data will be updated via real-time subscription
        return { success: true }
      } else {
        setError(result.error || "Failed to reorder certifications")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = "Failed to reorder certifications"
      setError(errorMsg)
      console.error("Error reordering certifications:", err)
      return { success: false, error: errorMsg }
    }
  }, [])

  const moveCertificationUp = useCallback(async (id: string) => {
    try {
      const result = await certificationsDataManager.moveItemUp(id)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error || "Failed to move certification up")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = "Failed to move certification up"
      setError(errorMsg)
      console.error("Error moving certification up:", err)
      return { success: false, error: errorMsg }
    }
  }, [])

  const moveCertificationDown = useCallback(async (id: string) => {
    try {
      const result = await certificationsDataManager.moveItemDown(id)
      if (result.success) {
        return { success: true }
      } else {
        setError(result.error || "Failed to move certification down")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMsg = "Failed to move certification down"
      setError(errorMsg)
      console.error("Error moving certification down:", err)
      return { success: false, error: errorMsg }
    }
  }, [])

  const searchCertifications = useCallback(async (query: string) => {
    try {
      setLoading(true)
      const results = await certificationsDataManager.searchItems(query)
      return { success: true, data: results }
    } catch (err) {
      console.error("Error searching certifications:", err)
      return { success: false, error: "Failed to search certifications" }
    } finally {
      setLoading(false)
    }
  }, [])

  const getFeaturedCertifications = useCallback(async () => {
    try {
      const featured = await certificationsDataManager.getFeaturedItems()
      return { success: true, data: featured }
    } catch (err) {
      console.error("Error getting featured certifications:", err)
      return { success: false, error: "Failed to get featured certifications" }
    }
  }, [])

  // Refresh data manually
  const refresh = useCallback(() => {
    certificationsDataManager.clearCache()
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
    isOnline,
    lastSyncTime,

    // CRUD operations
    addCertification,
    updateCertification,
    deleteCertification,
    reorderCertifications,
    moveCertificationUp,
    moveCertificationDown,

    // Search and filter
    searchCertifications,
    getFeaturedCertifications,

    // Utility functions
    refresh,
    clearError,

    // Cache status
    cacheStatus: certificationsDataManager.getCacheStatus(),
  }
}
