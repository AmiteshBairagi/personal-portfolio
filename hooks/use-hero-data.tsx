"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { type HeroData, heroDataService } from "@/lib/data/hero-data"

export function useHeroData() {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const subscriptionRef = useRef<(() => void) | null>(null)

  // Force re-render function
  const forceUpdate = useCallback(() => {
    setLastUpdate(Date.now().toString())
  }, [])

  // Load initial data
  const loadHeroData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await heroDataService.getHeroData()
      setHeroData(data)
      forceUpdate()
      console.log("Hero data loaded:", data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hero data")
      console.error("Error loading hero data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [forceUpdate])

  // Create new hero data
  const createHeroData = useCallback(
    async (newData: Partial<HeroData>) => {
      try {
        setError(null)
        const createdData = await heroDataService.createHeroData(newData)
        setHeroData(createdData)
        forceUpdate()
        console.log("Hero data created successfully:", createdData)
        return createdData
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create hero data")
        console.error("Failed to create hero data:", err)
        throw err
      }
    },
    [forceUpdate],
  )

  // Update data
  const updateHeroData = useCallback(
    async (updates: Partial<HeroData>) => {
      // Optimistic update
      setHeroData((prevData) => {
        if (!prevData) return prevData
        const updatedData = { ...prevData, ...updates }
        console.log("Optimistically updating with:", updatedData)
        return updatedData
      })

      forceUpdate()

      try {
        setError(null)
        const updatedData = await heroDataService.updateHeroData(updates)
        setHeroData(updatedData)
        forceUpdate()
        console.log("Hero data updated successfully:", updatedData)
        return updatedData
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update hero data")
        console.error("Failed to update hero data:", err)
        // Revert optimistic update on error
        await loadHeroData()
        throw err
      }
    },
    [forceUpdate, loadHeroData],
  )

  // Delete hero data
  const deleteHeroData = useCallback(async () => {
    try {
      setError(null)
      await heroDataService.deleteHeroData()
      setHeroData(null)
      forceUpdate()
      console.log("Hero data deleted successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete hero data")
      console.error("Failed to delete hero data:", err)
      throw err
    }
  }, [forceUpdate])

  // Reset data
  const resetHeroData = useCallback(async () => {
    try {
      setError(null)
      const resetData = await heroDataService.resetHeroData()
      setHeroData(resetData)
      forceUpdate()
      console.log("Hero data reset successfully:", resetData)
      return resetData
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset hero data")
      console.error("Failed to reset hero data:", err)
      throw err
    }
  }, [forceUpdate])

  // Subscribe to real-time updates
  useEffect(() => {
    const handleDataUpdate = (updatedData: HeroData) => {
      setHeroData(updatedData)
      setError(null)
      forceUpdate()
      console.log("Real-time update received:", updatedData)
    }

    // Subscribe to updates
    subscriptionRef.current = heroDataService.subscribeToUpdates(handleDataUpdate)

    // Cleanup subscription
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current()
        subscriptionRef.current = null
      }
    }
  }, [forceUpdate])

  // Load data on mount
  useEffect(() => {
    loadHeroData()
  }, [loadHeroData])

  // Polling fallback for extra reliability
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const freshData = await heroDataService.getHeroData()
        if (freshData.updated_at !== heroData?.updated_at) {
          setHeroData(freshData)
          forceUpdate()
          console.log("Polling update received:", freshData)
        }
      } catch (error) {
        // Silent fail for polling
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(pollInterval)
  }, [heroData?.updated_at, forceUpdate])

  return {
    heroData,
    isLoading,
    error,
    createHeroData,
    updateHeroData,
    deleteHeroData,
    resetHeroData,
    refetch: loadHeroData,
    lastUpdate, // For debugging
  }
}
