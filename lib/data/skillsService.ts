import { api } from "@/lib/axios"

export interface SkillItem {
  id: string
  name: string
  level: number
  projects: string[]
  experience: string
  category: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SkillCategory {
  [key: string]: SkillItem[]
}

// Cache management
let skillsCache: SkillCategory | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Skills data service
export const skillsService = {
  // Initialize real-time — now a no-op since we removed Supabase real-time.
  // The callback is stored so manual refreshes can still trigger it.
  _realtimeCallback: null as ((data: SkillCategory) => void) | null,

  initializeRealtime(callback: (data: SkillCategory) => void) {
    this._realtimeCallback = callback
    // No real-time subscription; data refreshes on manual page reload
    return () => {
      this._realtimeCallback = null
    }
  },

  // Get all skills data with caching
  async getSkillsData(): Promise<SkillCategory> {
    try {
      // Check cache first
      const now = Date.now()
      if (skillsCache && now - cacheTimestamp < CACHE_DURATION) {
        return skillsCache
      }

      const { data } = await api.get<SkillItem[]>("/api/skills")

      // Group skills by category
      const groupedSkills: SkillCategory = {}
      if (data && data.length > 0) {
        data
          .filter((skill) => skill.is_active !== false)
          .forEach((skill) => {
            if (!groupedSkills[skill.category]) {
              groupedSkills[skill.category] = []
            }
            groupedSkills[skill.category].push({
              ...skill,
              projects: skill.projects || [],
            })
          })
      }

      // Update cache
      skillsCache = groupedSkills
      cacheTimestamp = now

      return groupedSkills
    } catch (error) {
      console.error("Error fetching skills data:", error)
      throw error
    }
  },

  // Get all skills for admin (including inactive)
  async getAllSkillsForAdmin(): Promise<SkillItem[]> {
    try {
      const { data } = await api.get<SkillItem[]>("/api/skills", {
        params: { includeInactive: true },
      })
      return data || []
    } catch (error) {
      console.error("Error fetching all skills:", error)
      throw error
    }
  },

  // Add a new skill
  async addSkill(skill: Omit<SkillItem, "created_at" | "updated_at">): Promise<SkillItem> {
    try {
      const skillToInsert = {
        ...skill,
        is_active: skill.is_active ?? true,
      }

      const { data } = await api.post<SkillItem>("/api/skills", skillToInsert)

      // Invalidate cache
      skillsCache = null

      return data
    } catch (error) {
      console.error("Error adding skill:", error)
      throw error
    }
  },

  // Update a skill
  async updateSkill(skillId: string, updates: Partial<SkillItem>): Promise<SkillItem> {
    try {
      const { data } = await api.put<SkillItem>(`/api/skills/${skillId}`, updates)

      // Invalidate cache
      skillsCache = null

      return data
    } catch (error) {
      console.error("Error updating skill:", error)
      throw error
    }
  },

  // Delete a skill
  async deleteSkill(skillId: string): Promise<void> {
    try {
      await api.delete(`/api/skills/${skillId}`)

      // Invalidate cache
      skillsCache = null
    } catch (error) {
      console.error("Error deleting skill:", error)
      throw error
    }
  },

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data } = await api.get<SkillItem[]>("/api/skills")

      const categories = [...new Set((data || []).filter((item) => item.is_active !== false).map((item) => item.category))]
      return categories.sort()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return ["Frontend", "Backend", "Database", "Tools & Others", "Mobile", "DevOps"]
    }
  },

  // Clear cache (useful for testing)
  clearCache(): void {
    skillsCache = null
    cacheTimestamp = 0
  },
}
