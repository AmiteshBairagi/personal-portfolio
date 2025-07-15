import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface EducationItem {
  id: string
  degree: string
  institution: string
  duration: string
  grade: string
  description: string
  type: string
  image?: string
  display_order?: number
  created_at?: string
  updated_at?: string
}

// Education Data Service with Supabase
class EducationDataService {
  private static instance: EducationDataService
  private listeners: Set<() => void> = new Set()
  private cache: EducationItem[] | null = null
  private cacheTimestamp = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance(): EducationDataService {
    if (!EducationDataService.instance) {
      EducationDataService.instance = new EducationDataService()
    }
    return EducationDataService.instance
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  private clearCache() {
    this.cache = null
    this.cacheTimestamp = 0
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  async getData(): Promise<EducationItem[]> {
    try {
      // Check cache first
      const now = Date.now()
      if (this.cache && now - this.cacheTimestamp < this.CACHE_TTL) {
        return this.cache
      }

      const { data, error } = await supabase.from("education").select("*").order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching education from Supabase:", error)
        throw error
      }

      // Update cache
      this.cache = data || []
      this.cacheTimestamp = now

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching education:", error)
      throw error
    }
  }

  async addItem(item: Omit<EducationItem, "id" | "created_at" | "updated_at">): Promise<EducationItem> {
    try {
      // Get the next display order
      const { data: maxOrderData } = await supabase
        .from("education")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

      const newItem = {
        ...item,
        display_order: nextOrder,
      }

      const { data, error } = await supabase.from("education").insert([newItem]).select()

      if (error) {
        console.error("Error adding education to Supabase:", error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after insert")
      }

      this.clearCache()
      this.notifyListeners()
      return data[0]
    } catch (error) {
      console.error("Error adding education:", error)
      throw error
    }
  }

  async updateItem(id: string, updates: Partial<EducationItem>): Promise<EducationItem> {
    try {
      const { data, error } = await supabase.from("education").update(updates).eq("id", id).select()

      if (error) {
        console.error("Error updating education in Supabase:", error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after update")
      }

      this.clearCache()
      this.notifyListeners()
      return data[0]
    } catch (error) {
      console.error("Error updating education:", error)
      throw error
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("education").delete().eq("id", id)

      if (error) {
        console.error("Error deleting education from Supabase:", error)
        throw error
      }

      this.clearCache()
      this.notifyListeners()
    } catch (error) {
      console.error("Error deleting education:", error)
      throw error
    }
  }

  async reorderItems(items: { id: string; display_order: number }[]): Promise<void> {
    try {
      // Update all items in a transaction-like manner
      const updates = items.map((item) =>
        supabase.from("education").update({ display_order: item.display_order }).eq("id", item.id),
      )

      await Promise.all(updates)

      this.clearCache()
      this.notifyListeners()
    } catch (error) {
      console.error("Error reordering education items:", error)
      throw error
    }
  }
}

export const educationDataService = EducationDataService.getInstance()
