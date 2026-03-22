"use client"

import { useCallback, useState } from "react"
import { categoryService, type CategoryData } from "@/lib/data/categoryService"


export function useCategories() {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  

  const addCategory = useCallback(
    async (category: Omit<CategoryData, "id" | "created_at" | "updated_at">) => {
      await categoryService.createCategory(category);
    },
    [],
  )

  const fetchData = useCallback(async () => {
    try{
        const categoryData = await categoryService.getCategoriesData();
        setData(categoryData);
        setIsLoading(false);
      }catch(err){
        console.error("Failed to fetch categories data");
      }finally{
        setIsLoading(false);
      }
  },[])

  const updateCategory = useCallback(
    async (id: string, updates: Partial<CategoryData>) => {
      await categoryService.updateCategory(id,updates);
    },
    [],
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      await categoryService.deleteCategory(id);
    },
    [],
  )

 

  const getActiveCategories = useCallback(() => {
    return categoryService.getActiveCategories();
  }, [])

  const getCategoryByName = useCallback(
    (name: string) => {
      return categoryService.getCategoryByName(name);
    },
    [],
  )

  const refreshData = useCallback(() => {
    fetchData();
  },[fetchData])

  

  return {
    data,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getActiveCategories,
    getCategoryByName,
    refreshData
  }
}
