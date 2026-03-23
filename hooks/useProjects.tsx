"use client"

import { useState, useEffect, useCallback } from "react"
import { projectsDataService, type ProjectData } from "@/lib/data/projectsService"

export function useProjects() {
  const [data, setData] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const newData = await projectsDataService.getProjects()
      setData(newData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects data")
    } finally {
      setIsLoading(false)
    }
  }, [])  

  useEffect(() => {
    // Initial load
    refetch()
  }, [refetch])

  const addProject = useCallback(async (project: Omit<ProjectData, "id">, imageFile?: File) => {
    try {
      setError(null)
      await projectsDataService.addProject(project, imageFile)
      await refetch()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectData>, imageFile?: File) => {
    try {
      setError(null)
      await projectsDataService.updateProject(id, updates, imageFile)
      await refetch()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null)
      await projectsDataService.deleteProject(id)
      await refetch()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  // const reorderProject = useCallback(async (id: string, direction: "up" | "down") => {
  //   try {
  //     setError(null)
  //     await projectsDataService.reorderProject(id, direction)
  //     await refetch()
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Failed to reorder project"
  //     setError(errorMessage)
  //     throw new Error(errorMessage)
  //   }
  // }, [refetch])

  const getProject = useCallback(async (id: string) => {
    return await projectsDataService.getProject(id)
  }, [])

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return {
    data,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    refetch,
    refresh,
  }
}
