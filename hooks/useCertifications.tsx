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
    } catch (err) {
      console.error("Error loading certifications:", err)
      setError("Failed to load certifications")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data
  useEffect(() => {
    loadData()
  }, [loadData])

  const addCertification = useCallback(
    async (
      certification: Omit<CertificationItem, "id" | "created_at" | "updated_at">,
      imageFile?: File
    ) => {
      try {
        const result = await certificationService.addItem(certification, imageFile)
        if (result.success) {
          // Explicitly reload data since pub/sub cache is removed
          await loadData()
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
    [loadData],
  )

  const updateCertification = useCallback(
    async (
      id: string, 
      updates: Partial<CertificationItem>,
      imageFile?: File
    ) => {
      try {
        const result = await certificationService.updateItem(id, updates, imageFile)
        if (result.success) {
          // Explicitly reload data since pub/sub cache is removed
          await loadData()
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
    }, [loadData])

  const deleteCertification = useCallback(async (id: string) => {
    try {
      const result = await certificationService.deleteItem(id)
      if (result.success) {
        // Explicitly reload data since pub/sub cache is removed
        await loadData()
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
  }, [loadData])

  const refresh = useCallback(async () => {
    await loadData()
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