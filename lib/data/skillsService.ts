import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

// Real-time subscription
let realtimeChannel: any = null

// Skills data service
export const skillsService = {
  // Initialize real-time subscription
  initializeRealtime(callback: (data: SkillCategory) => void) {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    realtimeChannel = supabase
      .channel("skills-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "skills",
        },
        async (payload) => {
          console.log("Skills real-time update:", payload)
          // Invalidate cache and fetch fresh data
          skillsCache = null
          const freshData = await this.getSkillsData()
          callback(freshData)
        },
      )
      .subscribe()

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
        realtimeChannel = null
      }
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

      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching skills from Supabase:", error)
        throw error
      }

      // Group skills by category
      const groupedSkills: SkillCategory = {}
      if (data && data.length > 0) {
        data.forEach((skill) => {
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
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching all skills:", error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error("Error fetching all skills:", error)
      throw error
    }
  },

  // Add a new skill
  async addSkill(skill: Omit<SkillItem, "created_at" | "updated_at">): Promise<SkillItem> {
    try {
      // Get the next display order for the category
      const { data: existingSkills } = await supabase
        .from("skills")
        .select("display_order")
        .eq("category", skill.category)
        .order("display_order", { ascending: false })
        .limit(1)

      const nextOrder = existingSkills && existingSkills.length > 0 ? (existingSkills[0].display_order || 0) + 1 : 1

      const skillToInsert = {
        ...skill,
        display_order: nextOrder,
        is_active: skill.is_active ?? true,
      }

      const { data, error } = await supabase.from("skills").insert([skillToInsert]).select().single()

      if (error) {
        console.error("Error adding skill:", error)
        throw error
      }

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
      const { data, error } = await supabase.from("skills").update(updates).eq("id", skillId).select().single()

      if (error) {
        console.error("Error updating skill:", error)
        throw error
      }

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
      const {error} = await supabase.from("skills").delete().eq("id", skillId)
      if (error) {
        console.error("Error deleting skill:", error)
        throw error
      }

      // Invalidate cache
      skillsCache = null
    } catch (error) {
      console.error("Error deleting skill:", error)
      throw error
    }
  },

  // Reorder skills within a category
  // async reorderSkills(skillId: string, newOrder: number, category: string): Promise<void> {
  //   try {
  //     // Get current skill
  //     const { data: currentSkill, error: fetchError } = await supabase
  //       .from("skills")
  //       .select("display_order")
  //       .eq("id", skillId)
  //       .single()

  //     if (fetchError) throw fetchError

  //     const currentOrder = currentSkill.display_order || 0

  //     if (currentOrder === newOrder) return

  //     // Get all skills in the category
  //     const { data: categorySkills, error: categoryError } = await supabase
  //       .from("skills")
  //       .select("id, display_order")
  //       .eq("category", category)
  //       .order("display_order", { ascending: true })

  //     if (categoryError) throw categoryError

  //     // Reorder logic
  //     const updates: Array<{ id: string; display_order: number }> = []

  //     if (newOrder > currentOrder) {
  //       // Moving down
  //       categorySkills.forEach((skill) => {
  //         if (skill.id === skillId) {
  //           updates.push({ id: skill.id, display_order: newOrder })
  //         } else if (skill.display_order > currentOrder && skill.display_order <= newOrder) {
  //           updates.push({ id: skill.id, display_order: skill.display_order - 1 })
  //         }
  //       })
  //     } else {
  //       // Moving up
  //       categorySkills.forEach((skill) => {
  //         if (skill.id === skillId) {
  //           updates.push({ id: skill.id, display_order: newOrder })
  //         } else if (skill.display_order >= newOrder && skill.display_order < currentOrder) {
  //           updates.push({ id: skill.id, display_order: skill.display_order + 1 })
  //         }
  //       })
  //     }

  //     // Apply updates
  //     for (const update of updates) {
  //       await supabase.from("skills").update({ display_order: update.display_order }).eq("id", update.id)
  //     }

  //     // Invalidate cache
  //     skillsCache = null
  //   } catch (error) {
  //     console.error("Error reordering skills:", error)
  //     throw error
  //   }
  // },

  // Move skill up in order
  // async moveSkillUp(skillId: string, category: string): Promise<void> {
  //   try {
  //     const { data: skills, error } = await supabase
  //       .from("skills")
  //       .select("id, display_order")
  //       .eq("category", category)
  //       .order("display_order", { ascending: true })

  //     if (error) throw error

  //     const currentIndex = skills.findIndex((s) => s.id === skillId)
  //     if (currentIndex > 0) {
  //       const currentSkill = skills[currentIndex]
  //       const previousSkill = skills[currentIndex - 1]

  //       // Swap display orders
  //       await supabase.from("skills").update({ display_order: previousSkill.display_order }).eq("id", currentSkill.id)

  //       await supabase.from("skills").update({ display_order: currentSkill.display_order }).eq("id", previousSkill.id)

  //       // Invalidate cache
  //       skillsCache = null
  //     }
  //   } catch (error) {
  //     console.error("Error moving skill up:", error)
  //     throw error
  //   }
  // },

  // Move skill down in order
  // async moveSkillDown(skillId: string, category: string): Promise<void> {
  //   try {
  //     const { data: skills, error } = await supabase
  //       .from("skills")
  //       .select("id, display_order")
  //       .eq("category", category)
  //       .order("display_order", { ascending: true })

  //     if (error) throw error

  //     const currentIndex = skills.findIndex((s) => s.id === skillId)
  //     if (currentIndex < skills.length - 1) {
  //       const currentSkill = skills[currentIndex]
  //       const nextSkill = skills[currentIndex + 1]

  //       // Swap display orders
  //       await supabase.from("skills").update({ display_order: nextSkill.display_order }).eq("id", currentSkill.id)

  //       await supabase.from("skills").update({ display_order: currentSkill.display_order }).eq("id", nextSkill.id)

  //       // Invalidate cache
  //       skillsCache = null
  //     }
  //   } catch (error) {
  //     console.error("Error moving skill down:", error)
  //     throw error
  //   }
  // },

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("skills").select("category").eq("is_active", true)

      if (error) throw error

      const categories = [...new Set(data.map((item) => item.category))]
      return categories.sort()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return ["Frontend", "Backend", "Database", "Tools & Others", "Mobile", "DevOps"]
    }
  },

  // Get last updated timestamp
  // getLastUpdated(): string {
  //   return new Date().toLocaleString()
  // },

  // Clear cache (useful for testing)
  clearCache(): void {
    skillsCache = null
    cacheTimestamp = 0
  },
}
