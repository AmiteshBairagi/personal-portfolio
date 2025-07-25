"use client"

import { useState, useEffect, useCallback } from "react"
import { skillsDataService, type SkillCategory, type SkillItem } from "@/lib/data/skills-data"

export function useSkillsData() {
  const [skillsData, setSkillsData] = useState<SkillCategory>({})
  const [allSkills, setAllSkills] = useState<SkillItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isOnline, setIsOnline] = useState(true)

  // Load skills data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await skillsDataService.getSkillsData()
      setSkillsData(data || {})
      setLastUpdated(skillsDataService.getLastUpdated())
    } catch (err) {
      console.error("Error loading skills data:", err)
      setError("Failed to load skills data")
      setSkillsData({})
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load all skills for admin
  const loadAllSkills = useCallback(async () => {
    try {
      const data = await skillsDataService.getAllSkillsForAdmin()
      setAllSkills(data || [])
    } catch (err) {
      console.error("Error loading all skills:", err)
      setAllSkills([])
    }
  }, [])

  // Initialize real-time updates
  useEffect(() => {
    const cleanup = skillsDataService.initializeRealtime((newData) => {
      setSkillsData(newData)
      setLastUpdated(skillsDataService.getLastUpdated())
      // Also reload all skills for admin
      loadAllSkills()
    })

    return cleanup
  }, [loadAllSkills])

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Initial data load
  useEffect(() => {
    loadData()
    loadAllSkills()
  }, [loadData, loadAllSkills])

  // Add skill
  const addSkill = useCallback(
    async (skill: Omit<SkillItem, "created_at" | "updated_at">) => {
      try {
        setIsSaving(true)
        setError(null)
        await skillsDataService.addSkill(skill)
        await loadData()
        await loadAllSkills()
        return { success: true }
      } catch (err) {
        console.error("Error adding skill:", err)
        setError("Failed to add skill")
        return { success: false, error: "Failed to add skill" }
      } finally {
        setIsSaving(false)
      }
    },
    [loadData, loadAllSkills],
  )

  // Update skill
  const updateSkill = useCallback(
    async (skillId: string, updates: Partial<SkillItem>) => {
      try {
        setIsSaving(true)
        setError(null)
        await skillsDataService.updateSkill(skillId, updates)
        await loadData()
        await loadAllSkills()
        return { success: true }
      } catch (err) {
        console.error("Error updating skill:", err)
        setError("Failed to update skill")
        return { success: false, error: "Failed to update skill" }
      } finally {
        setIsSaving(false)
      }
    },
    [loadData, loadAllSkills],
  )

  // Delete skill
  const deleteSkill = useCallback(
    async (skillId: string) => {
      try {
        setIsSaving(true)
        setError(null)
        await skillsDataService.deleteSkill(skillId)
        await loadData()
        await loadAllSkills()
        return { success: true }
      } catch (err) {
        console.error("Error deleting skill:", err)
        setError("Failed to delete skill")
        return { success: false, error: "Failed to delete skill" }
      } finally {
        setIsSaving(false)
      }
    },
    [loadData, loadAllSkills],
  )

  // Move skill up
  const moveSkillUp = useCallback(
    async (skillId: string, category: string) => {
      try {
        setIsSaving(true)
        setError(null)
        await skillsDataService.moveSkillUp(skillId, category)
        await loadData()
        await loadAllSkills()
        return { success: true }
      } catch (err) {
        console.error("Error moving skill up:", err)
        setError("Failed to move skill")
        return { success: false, error: "Failed to move skill" }
      } finally {
        setIsSaving(false)
      }
    },
    [loadData, loadAllSkills],
  )

  // Move skill down
  const moveSkillDown = useCallback(
    async (skillId: string, category: string) => {
      try {
        setIsSaving(true)
        setError(null)
        await skillsDataService.moveSkillDown(skillId, category)
        await loadData()
        await loadAllSkills()
        return { success: true }
      } catch (err) {
        console.error("Error moving skill down:", err)
        setError("Failed to move skill")
        return { success: false, error: "Failed to move skill" }
      } finally {
        setIsSaving(false)
      }
    },
    [loadData, loadAllSkills],
  )

  // Get categories
  const getCategories = useCallback(async () => {
    try {
      return await skillsDataService.getCategories()
    } catch (err) {
      console.error("Error getting categories:", err)
      return ["Frontend", "Backend", "Database", "Tools & Others", "Mobile", "DevOps"]
    }
  }, [])

  return {
    skillsData,
    allSkills,
    isLoading,
    isSaving,
    error,
    lastUpdated,
    isOnline,
    loadSkillsData: loadData,
    loadAllSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    moveSkillUp,
    moveSkillDown,
    getCategories,
  }
}
