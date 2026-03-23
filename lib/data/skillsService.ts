import { api } from "@/lib/axios"

export interface SkillItem {
  id: string
  name: string
  level: number
  projects: string[]
  yearsOfExperience: string
  category: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SkillCategory {
  [key: string]: SkillItem[]
}

// Pure API Skills data service
export const skillsService = {
  // Get all skills data grouped by category
  async getSkillsData(): Promise<SkillCategory> {
    try {
      const { data } = await api.get<SkillItem[]>("/api/get-all-skills")

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

      return groupedSkills
    } catch (error) {
      console.error("Error fetching skills data:", error)
      throw error
    }
  },

  // Get all skills for admin (including inactive)
  async getAllSkillsForAdmin(): Promise<SkillItem[]> {
    try {
      const { data } = await api.get<SkillItem[]>("/api/get-all-skills", {
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
      const { data } = await api.post<SkillItem>("/api/add-skill", skill)
      return data
    } catch (error) {
      console.error("Error adding skill:", error)
      throw error
    }
  },

  // Update a skill
  async updateSkill(updates: Partial<SkillItem>): Promise<SkillItem> {
    try {
      const { data } = await api.put<SkillItem>("/api/update-skill", updates)
      return data
    } catch (error) {
      console.error("Error updating skill:", error)
      throw error
    }
  },

  // Delete a skill
  async deleteSkill(skillId: string): Promise<void> {
    try {
      await api.delete(`/api/delete-skill/${skillId}`)
    } catch (error) {
      console.error("Error deleting skill:", error)
      throw error
    }
  },

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data } = await api.get<SkillItem[]>("/api/get-all-skills")

      const categories = [...new Set((data || []).filter((item) => item.is_active !== false).map((item) => item.category))]
      return categories.sort()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return ["Frontend", "Backend", "Database", "Tools & Others", "Mobile", "DevOps"]
    }
  },
}
