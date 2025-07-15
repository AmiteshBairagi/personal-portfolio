import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface AboutData {
  id: string
  title: string
  description: string
  image_url?: string
  skills?: string[]
  experience_years?: number
  created_at?: string
  updated_at?: string
}

class AboutDataManager {
  private cache: AboutData | null = null
  private cacheTimestamp = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  private isValidCache(): boolean {
    return this.cache !== null && Date.now() - this.cacheTimestamp < this.CACHE_TTL
  }

  private setCache(data: AboutData | null): void {
    this.cache = data
    this.cacheTimestamp = Date.now()
  }

  async getAboutData(): Promise<AboutData | null> {
    try {
      // Return cached data if valid
      if (this.isValidCache()) {
        return this.cache
      }

      const { data, error } = await supabase
        .from("about_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error fetching about data:", error)
        return this.cache // Return cached data on error
      }

      const aboutData = data && data.length > 0 ? data[0] : null
      this.setCache(aboutData)
      return aboutData
    } catch (error) {
      console.error("Error in getAboutData:", error)
      return this.cache
    }
  }

  async updateAboutData(updateData: Partial<AboutData>): Promise<AboutData> {
    try {
      // First, get existing data
      const existingData = await this.getAboutData()

      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from("about_data")
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select()

        if (error) {
          throw new Error(`Failed to update about data: ${error.message}`)
        }

        if (!data || data.length === 0) {
          throw new Error("No data returned after update")
        }

        const updatedData = data[0]
        this.setCache(updatedData)
        return updatedData
      } else {
        // Create new record
        const { data, error } = await supabase
          .from("about_data")
          .insert({
            ...updateData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) {
          throw new Error(`Failed to create about data: ${error.message}`)
        }

        if (!data || data.length === 0) {
          throw new Error("No data returned after creation")
        }

        const newData = data[0]
        this.setCache(newData)
        return newData
      }
    } catch (error) {
      console.error("Error updating about data:", error)
      throw error
    }
  }

  async deleteAboutData(): Promise<boolean> {
    try {
      const existingData = await this.getAboutData()

      if (!existingData) {
        return true // Already deleted
      }

      const { error } = await supabase.from("about_data").delete().eq("id", existingData.id)

      if (error) {
        throw new Error(`Failed to delete about data: ${error.message}`)
      }

      this.setCache(null)
      return true
    } catch (error) {
      console.error("Error deleting about data:", error)
      throw error
    }
  }

  // Real-time subscription
  subscribeToChanges(callback: (data: AboutData | null) => void) {
    const subscription = supabase
      .channel("about_data_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "about_data",
        },
        async () => {
          // Invalidate cache and fetch fresh data
          this.cache = null
          const freshData = await this.getAboutData()
          callback(freshData)
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }
}

export const aboutDataManager = new AboutDataManager()
