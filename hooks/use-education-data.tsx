"use client"

import { useState, useEffect } from "react"
import { educationDataService, type EducationItem } from "@/lib/data/education-data"

export function useEducationData() {
  const [data, setData] = useState<EducationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const freshData = await educationDataService.getData()
      setData(freshData)
    } catch (err) {
      setError("Failed to load education data")
      console.error("Error fetching education data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial data load
    refetch()

    // Subscribe to data changes
    const unsubscribe = educationDataService.subscribe(() => {
      refetch()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const addEducation = async (item: Omit<EducationItem, "id" | "created_at" | "updated_at">) => {
    try {
      setError(null)
      await educationDataService.addItem(item)
      // Data will be refreshed via subscription
    } catch (err) {
      setError("Failed to add education item")
      console.error("Error adding education:", err)
      throw err
    }
  }

  const updateEducation = async (id: string, updates: Partial<EducationItem>) => {
    try {
      setError(null)
      await educationDataService.updateItem(id, updates)
      // Data will be refreshed via subscription
    } catch (err) {
      setError("Failed to update education item")
      console.error("Error updating education:", err)
      throw err
    }
  }

  const deleteEducation = async (id: string) => {
    try {
      setError(null)
      await educationDataService.deleteItem(id)
      // Data will be refreshed via subscription
    } catch (err) {
      setError("Failed to delete education item")
      console.error("Error deleting education:", err)
      throw err
    }
  }

  const reorderEducation = async (items: { id: string; display_order: number }[]) => {
    try {
      setError(null)
      await educationDataService.reorderItems(items)
      // Data will be refreshed via subscription
    } catch (err) {
      setError("Failed to reorder education items")
      console.error("Error reordering education:", err)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    refetch,
    addEducation,
    updateEducation,
    deleteEducation,
    reorderEducation,
  }
}
