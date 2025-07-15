import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create Supabase client if environment variables are available
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export interface HeroData {
  id: string
  name: string
  title: string
  description: string
  hero_image: string
  skills: string[]
  social_links: {
    github: string
    linkedin: string
    twitter: string
    email: string
  }
  created_at?: string
  updated_at?: string
}

// Default hero data that matches the current frontend
export const defaultHeroData: HeroData = {
  id: "1",
  name: "AMITESH",
  title: "Full Stack Developer",
  description:
    "Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and turning ideas into reality.",
  hero_image: "/new-hero-image.jpg",
  skills: ["React", "Node.js", "TypeScript", "Python", "Next.js", "MongoDB"],
  social_links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "your.email@example.com",
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const heroDataService = {
  // Get current hero data
  getHeroData: async (): Promise<HeroData> => {
    // If Supabase is not configured, return default data
    if (!supabase) {
      console.warn("Supabase not configured, using default hero data")
      return defaultHeroData
    }

    try {
      const { data, error } = await supabase.from("hero_data").select("*").eq("id", "1").single()

      if (error) {
        console.error("Error fetching hero data from Supabase:", error)
        return defaultHeroData // Fallback to default data
      }

      return {
        ...data,
        // Ensure backward compatibility with frontend expectations
        heroImage: data.hero_image,
        socialLinks: data.social_links,
      } as HeroData
    } catch (error) {
      console.error("Unexpected error fetching hero data:", error)
      return defaultHeroData // Fallback to default data
    }
  },

  // Create new hero data (for initial setup)
  createHeroData: async (data: Partial<HeroData>): Promise<HeroData> => {
    if (!supabase) {
      console.warn("Supabase not configured, cannot create hero data")
      throw new Error("Database not configured")
    }

    try {
      const heroData = {
        id: "1",
        name: data.name || defaultHeroData.name,
        title: data.title || defaultHeroData.title,
        description: data.description || defaultHeroData.description,
        hero_image: data.hero_image || data.heroImage || defaultHeroData.hero_image,
        skills: data.skills || defaultHeroData.skills,
        social_links: data.social_links || data.socialLinks || defaultHeroData.social_links,
      }

      const { data: createdData, error } = await supabase.from("hero_data").insert(heroData).select("*").single()

      if (error) {
        console.error("Error creating hero data in Supabase:", error)
        throw error
      }

      return {
        ...createdData,
        heroImage: createdData.hero_image,
        socialLinks: createdData.social_links,
      } as HeroData
    } catch (error) {
      console.error("Error creating hero data:", error)
      throw error
    }
  },

  // Update hero data
  updateHeroData: async (data: Partial<HeroData>): Promise<HeroData> => {
    // If Supabase is not configured, return updated default data
    if (!supabase) {
      console.warn("Supabase not configured, cannot update hero data")
      const updatedData = {
        ...defaultHeroData,
        ...data,
        updated_at: new Date().toISOString(),
      }
      return updatedData
    }

    try {
      // Transform data to match database schema
      const updateData: any = {}

      if (data.name !== undefined) updateData.name = data.name
      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.hero_image !== undefined) updateData.hero_image = data.hero_image
      if (data.heroImage !== undefined) updateData.hero_image = data.heroImage
      if (data.skills !== undefined) updateData.skills = data.skills
      if (data.social_links !== undefined) updateData.social_links = data.social_links
      if (data.socialLinks !== undefined) updateData.social_links = data.socialLinks

      const { data: updatedData, error } = await supabase
        .from("hero_data")
        .update(updateData)
        .eq("id", "1")
        .select("*")
        .single()

      if (error) {
        console.error("Error updating hero data in Supabase:", error)
        throw error
      }

      return {
        ...updatedData,
        heroImage: updatedData.hero_image,
        socialLinks: updatedData.social_links,
      } as HeroData
    } catch (error) {
      console.error("Error updating hero data:", error)
      throw error
    }
  },

  // Delete hero data (reset to default)
  deleteHeroData: async (): Promise<void> => {
    if (!supabase) {
      console.warn("Supabase not configured, cannot delete hero data")
      throw new Error("Database not configured")
    }

    try {
      const { error } = await supabase.from("hero_data").delete().eq("id", "1")

      if (error) {
        console.error("Error deleting hero data in Supabase:", error)
        throw error
      }
    } catch (error) {
      console.error("Error deleting hero data:", error)
      throw error
    }
  },

  // Reset to default data
  resetHeroData: async (): Promise<HeroData> => {
    if (!supabase) {
      console.warn("Supabase not configured, returning default hero data")
      return defaultHeroData
    }

    try {
      // First delete existing data, then create new default data
      await heroDataService.deleteHeroData()
      return await heroDataService.createHeroData(defaultHeroData)
    } catch (error) {
      console.error("Error resetting hero data:", error)
      throw error
    }
  },

  // Subscribe to real-time updates using Supabase
  subscribeToUpdates: (callback: (data: HeroData) => void) => {
    if (typeof window === "undefined" || !supabase) {
      console.warn("Supabase not configured or running on server, skipping real-time subscription")
      return () => {}
    }

    // Subscribe to Supabase real-time changes
    const subscription = supabase
      .channel("hero_data_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hero_data",
          filter: "id=eq.1",
        },
        (payload) => {
          console.log("Real-time update received:", payload)
          if (payload.new) {
            const newData = payload.new as any
            callback({
              ...newData,
              heroImage: newData.hero_image,
              socialLinks: newData.social_links,
            } as HeroData)
          }
        },
      )
      .subscribe()

    // Return cleanup function
    return () => {
      subscription.unsubscribe()
    }
  },
}
