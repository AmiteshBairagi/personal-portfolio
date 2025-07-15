"use client"

import { useState, useEffect, useCallback } from "react"
import { aboutDataManager, type AboutData } from "@/lib/data/about-data"

export function useAboutData() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await aboutDataManager.getAboutData()
      setAboutData(data)
      setLastUpdate(Date.now())
    } catch (err) {
      console.error("Error loading about data:", err)
      setError(err instanceof Error ? err.message : "Failed to load about data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Update data
  const updateData = useCallback(async (updateData: Partial<AboutData>) => {
    try {
      setError(null)
      const updatedData = await aboutDataManager.updateAboutData(updateData)
      setAboutData(updatedData)
      setLastUpdate(Date.now())
      return updatedData
    } catch (err) {
      console.error("Error updating about data:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update about data"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  // Delete data
  const deleteData = useCallback(async () => {
    try {
      setError(null)
      await aboutDataManager.deleteAboutData()
      setAboutData(null)
      setLastUpdate(Date.now())
    } catch (err) {
      console.error("Error deleting about data:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete about data"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  // Refresh data
  const refreshData = useCallback(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    loadData()

    // Set up real-time subscription
    const unsubscribe = aboutDataManager.subscribeToChanges((data) => {
      setAboutData(data)
      setLastUpdate(Date.now())
    })

    return unsubscribe
  }, [loadData])

  return {
    aboutData,
    loading,
    error,
    lastUpdate,
    updateData,
    deleteData,
    refreshData,
  }
}
