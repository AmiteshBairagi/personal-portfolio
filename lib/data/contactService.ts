import { api } from "@/lib/axios"

export interface LeadData {
  id: string
  email: string
  phone?: string
  name: string
  // location?: string
  // github_url?: string
  // linkedin_url?: string
  // twitter_url?: string
  // website_url?: string
  // resume_url?: string
  // bio?: string
  // availability_status: "available" | "busy" | "unavailable"
  created_at: string
  updated_at: string
}

// export interface ContactFormData {
//   name: string,
//   email: string
//   phone?: string
//   message: string,
//   location?: string
//   github_url?: string
//   linkedin_url?: string
//   twitter_url?: string
//   website_url?: string
//   resume_url?: string
//   bio?: string
//   availability_status: "available" | "busy" | "unavailable"
// }

class ContactManager {
  // private cache: LeadData | null = null
  // private cacheTimestamp = 0
  // private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // private isCacheValid(): boolean {
  //   return this.cache !== null && Date.now() - this.cacheTimestamp < this.CACHE_TTL
  // }

  // private setCache(data: LeadData | null): void {
  //   this.cache = data
  //   this.cacheTimestamp = Date.now()
  // }

  async getContactData(): Promise<LeadData | null> {
    try {
      // if (this.isCacheValid()) {
      //   return this.cache
      // }

      const { data } = await api.get<LeadData | LeadData[]>("/api/get-all-leads")

      // Handle both single object and array responses
      const contactData = Array.isArray(data) ? (data.length > 0 ? data[0] : null) : data
      // this.setCache(contactData)
      return contactData
    } catch (error) {
      console.error("Error in getContactData:", error)
      throw error
    }
  }

  // async createContactData(contactData: ContactFormData): Promise<LeadData> {
  //   try {
  //     // First check if contact data already exists
  //     const existingData = await this.getContactData()
  //     if (existingData) {
  //       throw new Error("Contact data already exists. Use update instead.")
  //     }

  //     const { data } = await api.post<LeadData>("/api/contact", contactData)
  //     this.setCache(data)
  //     return data
  //   } catch (error) {
  //     console.error("Error in createContactData:", error)
  //     throw error
  //   }
  // }

  // async updateContactData(contactData: ContactFormData): Promise<LeadData> {
  //   try {
  //     // Get existing contact data to get the ID
  //     const existingData = await this.getContactData()
  //     if (!existingData) {
  //       // If no existing data, create new
  //       return await this.createContactData(contactData)
  //     }

  //     const { data } = await api.put<LeadData>(`/api/contact/${existingData.id}`, contactData)
  //     this.setCache(data)
  //     return data
  //   } catch (error) {
  //     console.error("Error in updateContactData:", error)
  //     throw error
  //   }
  // }

  // async deleteContactData(id: string): Promise<void> {
  //   try {
  //     await api.delete(`/api/contact/${id}`)
  //     this.setCache(null)
  //   } catch (error) {
  //     console.error("Error in deleteContactData:", error)
  //     throw error
  //   }
  // }

  // clearCache(): void {
  //   this.cache = null
  //   this.cacheTimestamp = 0
  // }

  // getCacheStatus(): { cached: boolean; age: number } {
  //   return {
  //     cached: this.cache !== null,
  //     age: this.cache ? Date.now() - this.cacheTimestamp : 0,
  //   }
  // }
}

export const contactManager = new ContactManager()
