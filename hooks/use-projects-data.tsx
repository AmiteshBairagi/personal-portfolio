"use client"

import { useState, useEffect, useCallback } from "react"
import { projectsDataService, type ProjectData } from "@/lib/data/projects-data"

export function useProjectsData() {
  const [data, setData] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    try {
      const newData = projectsDataService.getData()
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

    // Subscribe to data service changes
    const unsubscribe = projectsDataService.subscribe(refetch)

    // Listen for custom events
    const handleCustomEvent = (event: CustomEvent) => {
      refetch()
    }

    // Listen for localStorage events (cross-tab sync)
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "projectsDataUpdate" || event.key === "projectsData") {
        refetch()
      }
    }

    // Listen for BroadcastChannel events
    let broadcastChannel: BroadcastChannel | null = null
    try {
      broadcastChannel = new BroadcastChannel("projectsData")
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === "UPDATE") {
          refetch()
        }
      }
    } catch (e) {
      console.log("BroadcastChannel not supported")
    }

    // Listen for PostMessage events
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data.type === "PROJECTS_DATA_UPDATE") {
        refetch()
      }
    }

    // Online/offline detection

    // Add event listeners
    window.addEventListener("projectsDataUpdated", handleCustomEvent as EventListener)
    window.addEventListener("storage", handleStorageEvent)
    window.addEventListener("message", handlePostMessage)

    // Polling fallback for extra reliability
    const pollInterval = setInterval(refetch, 30000) // 30 seconds

    return () => {
      unsubscribe()
      window.removeEventListener("projectsDataUpdated", handleCustomEvent as EventListener)
      window.removeEventListener("storage", handleStorageEvent)
      window.removeEventListener("message", handlePostMessage)
      broadcastChannel?.close()
      clearInterval(pollInterval)
    }
  }, [refetch])

  const addProject = useCallback(async (project: Omit<ProjectData, "id">) => {
    try {
      setError(null)
      await projectsDataService.addProject(project)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectData>) => {
    try {
      setError(null)
      await projectsDataService.updateProject(id, updates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null)
      await projectsDataService.deleteProject(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const reorderProject = useCallback(async (id: string, direction: "up" | "down") => {
    try {
      setError(null)
      await projectsDataService.reorderProject(id, direction)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reorder project"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getProject = useCallback((id: string) => {
    return projectsDataService.getProject(id)
  }, [])

  const refresh = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)
      await projectsDataService.refresh()
      refetch()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh projects"
      setError(errorMessage)
    }
  }, [refetch])

  return {
    data,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    reorderProject,
    getProject,
    refetch,
    refresh,
  }
}
