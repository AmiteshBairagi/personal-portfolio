"use client"

import { useState, useEffect, useCallback } from "react"
import { categoryService, type CategoryData } from "@/lib/data/categoryService"

export function useCategoriesRealTime() {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const categories = await categoryService.getCategoriesData()
      setData(categories)
      setLastSync(new Date())
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial load
    fetchData()

    // Subscribe to real-time updates
    const unsubscribe = categoryService.subscribe(() => {
      fetchData()
    })

    // Network status monitoring
    const handleOnline = () => {
      setIsOnline(true)
      fetchData()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      unsubscribe()
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [fetchData])

  const createCategory = useCallback(async (categoryData: Omit<CategoryData, "id" | "created_at" | "updated_at">) => {
    try {
      setError(null)
      await categoryService.createCategory(categoryData)
      // Data will be updated via real-time subscription
    } catch (err) {
      console.error("Error creating category:", err)
      setError(err instanceof Error ? err.message : "Failed to create category")
      throw err
    }
  }, [])

  const updateCategory = useCallback(async (id: string, updates: Partial<CategoryData>) => {
    try {
      setError(null)
      await categoryService.updateCategory(id, updates)
      // Data will be updated via real-time subscription
    } catch (err) {
      console.error("Error updating category:", err)
      setError(err instanceof Error ? err.message : "Failed to update category")
      throw err
    }
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null)
      await categoryService.deleteCategory(id)
      // Data will be updated via real-time subscription
    } catch (err) {
      console.error("Error deleting category:", err)
      setError(err instanceof Error ? err.message : "Failed to delete category")
      throw err
    }
  }, [])

  const getActiveCategories = useCallback(() => {
    return data.filter((cat) => cat.active).sort((a, b) => a.order - b.order)
  }, [data])

  const getCategoryByName = useCallback(
    (name: string) => {
      return data.find((cat) => cat.name === name) || null
    },
    [data],
  )

  const reorderCategory = useCallback(async (categoryId: string, newOrder: number) => {
    try {
      setError(null)
      await categoryService.reorderCategories(categoryId, newOrder)
      // Data will be updated via real-time subscription
    } catch (err) {
      console.error("Error reordering category:", err)
      setError(err instanceof Error ? err.message : "Failed to reorder category")
      throw err
    }
  }, [])

  const refreshData = useCallback(() => {
    categoryService.clearCache()
    fetchData()
  }, [fetchData])

  const getCacheStatus = useCallback(() => {
    return categoryService.getCacheStatus()
  }, [])

  return {
    data,
    isLoading,
    error,
    lastSync,
    isOnline,
    createCategory,
    updateCategory,
    deleteCategory,
    getActiveCategories,
    getCategoryByName,
    reorderCategory,
    refreshData,
    getCacheStatus,
  }
}
