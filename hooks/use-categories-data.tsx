"use client"

import { useCallback } from "react"
import { useCategoriesRealTime } from "./use-categories-real-time"
import type { CategoryData } from "@/lib/data/categories-data-manager"

export function useCategoriesData() {
  const {
    data,
    isLoading,
    error,
    lastSync,
    isOnline,
    createCategory: createCategoryRT,
    updateCategory: updateCategoryRT,
    deleteCategory: deleteCategoryRT,
    getActiveCategories: getActiveCategoriesRT,
    getCategoryByName: getCategoryByNameRT,
    reorderCategory,
    refreshData,
  } = useCategoriesRealTime()

  const addCategory = useCallback(
    async (category: Omit<CategoryData, "id" | "created_at" | "updated_at">) => {
      await createCategoryRT(category)
    },
    [createCategoryRT],
  )

  const updateCategory = useCallback(
    async (id: string, updates: Partial<CategoryData>) => {
      await updateCategoryRT(id, updates)
    },
    [updateCategoryRT],
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      await deleteCategoryRT(id)
    },
    [deleteCategoryRT],
  )

  const getCategory = useCallback(
    (id: string) => {
      return data.find((item) => item.id === id)
    },
    [data],
  )

  const getActiveCategories = useCallback(() => {
    return getActiveCategoriesRT()
  }, [getActiveCategoriesRT])

  const getCategoryByName = useCallback(
    (name: string) => {
      return getCategoryByNameRT(name)
    },
    [getCategoryByNameRT],
  )

  const refetch = useCallback(() => {
    refreshData()
  }, [refreshData])

  return {
    data,
    isLoading,
    error,
    lastSync,
    isOnline,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getActiveCategories,
    getCategoryByName,
    reorderCategory,
    refetch,
  }
}
