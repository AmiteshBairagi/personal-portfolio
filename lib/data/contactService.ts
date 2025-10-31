import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface ContactData {
  id: string
  email: string
  phone?: string
  location?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  resume_url?: string
  bio?: string
  availability_status: "available" | "busy" | "unavailable"
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  email: string
  phone?: string
  location?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  resume_url?: string
  bio?: string
  availability_status: "available" | "busy" | "unavailable"
}

class ContactManager {
  private cache: ContactData | null = null
  private cacheTimestamp = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  private isCacheValid(): boolean {
    return this.cache !== null && Date.now() - this.cacheTimestamp < this.CACHE_TTL
  }

  private setCache(data: ContactData | null): void {
    this.cache = data
    this.cacheTimestamp = Date.now()
  }

  async getContactData(): Promise<ContactData | null> {
    try {
      if (this.isCacheValid()) {
        return this.cache
      }

      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error fetching contact data:", error)
        throw new Error(`Failed to fetch contact data: ${error.message}`)
      }

      const contactData = data && data.length > 0 ? data[0] : null
      this.setCache(contactData)
      return contactData
    } catch (error) {
      console.error("Error in getContactData:", error)
      throw error
    }
  }

  async createContactData(contactData: ContactFormData): Promise<ContactData> {
    try {
      // First check if contact data already exists
      const existingData = await this.getContactData()
      if (existingData) {
        throw new Error("Contact data already exists. Use update instead.")
      }

      const { data, error } = await supabase.from("contact").insert([contactData]).select().single()

      if (error) {
        console.error("Error creating contact data:", error)
        throw new Error(`Failed to create contact data: ${error.message}`)
      }

      this.setCache(data)
      return data
    } catch (error) {
      console.error("Error in createContactData:", error)
      throw error
    }
  }

  async updateContactData(contactData: ContactFormData): Promise<ContactData> {
    try {
      // Get existing contact data to get the ID
      const existingData = await this.getContactData()
      if (!existingData) {
        // If no existing data, create new
        return await this.createContactData(contactData)
      }

      const { data, error } = await supabase
        .from("contact")
        .update(contactData)
        .eq("id", existingData.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating contact data:", error)
        throw new Error(`Failed to update contact data: ${error.message}`)
      }

      this.setCache(data)
      return data
    } catch (error) {
      console.error("Error in updateContactData:", error)
      throw error
    }
  }

  async deleteContactData(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("contact").delete().eq("id", id)

      if (error) {
        console.error("Error deleting contact data:", error)
        throw new Error(`Failed to delete contact data: ${error.message}`)
      }

      this.setCache(null)
    } catch (error) {
      console.error("Error in deleteContactData:", error)
      throw error
    }
  }

  subscribeToChanges(callback: (data: ContactData | null) => void) {
    const subscription = supabase
      .channel("contact-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact",
        },
        async (payload) => {
          console.log("Contact data changed:", payload)
          // Invalidate cache and fetch fresh data
          this.cache = null
          const freshData = await this.getContactData()
          callback(freshData)
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  clearCache(): void {
    this.cache = null
    this.cacheTimestamp = 0
  }

  getCacheStatus(): { cached: boolean; age: number } {
    return {
      cached: this.cache !== null,
      age: this.cache ? Date.now() - this.cacheTimestamp : 0,
    }
  }
}

export const contactManager = new ContactManager()
