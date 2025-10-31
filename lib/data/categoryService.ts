import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface CategoryData {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

class CategoriesManager {
  private static instance: CategoriesManager
  private cache: CategoryData[] = []
  private cacheTimestamp = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private listeners: Set<() => void> = new Set()

  private constructor() {
    this.setupRealtimeSubscription()
  }

  static getInstance(): CategoriesManager {
    if (!CategoriesManager.instance) {
      CategoriesManager.instance = new CategoriesManager()
    }
    return CategoriesManager.instance
  }

  private setupRealtimeSubscription() {
    supabase
      .channel("categories_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        () => {
          this.invalidateCache()
          this.notifyListeners()
        },
      )
      .subscribe()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private invalidateCache() {
    this.cacheTimestamp = 0
  }

  private isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_TTL
  }

  async getCategoriesData(): Promise<CategoryData[]> {
    if (this.isCacheValid() && this.cache.length > 0) {
      return this.cache
    }

    try {
      const { data, error } = await supabase.from("categories").select("*").order("order", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
        throw error
      }

      this.cache = data || []
      this.cacheTimestamp = Date.now()
      return this.cache
    } catch (error) {
      console.error("Error in getCategoriesData:", error)
      throw error
    }
  }

  async createCategory(categoryData: Omit<CategoryData, "id" | "created_at" | "updated_at">): Promise<CategoryData> {
    try {
      const { data, error } = await supabase.from("categories").insert([categoryData]).select().single()

      if (error) {
        console.error("Error creating category:", error)
        throw error
      }

      this.invalidateCache()
      return data
    } catch (error) {
      console.error("Error in createCategory:", error)
      throw error
    }
  }

  async updateCategory(id: string, updates: Partial<CategoryData>): Promise<CategoryData> {
    try {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating category:", error)
        throw error
      }

      this.invalidateCache()
      return data
    } catch (error) {
      console.error("Error in updateCategory:", error)
      throw error
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) {
        console.error("Error deleting category:", error)
        throw error
      }

      this.invalidateCache()
    } catch (error) {
      console.error("Error in deleteCategory:", error)
      throw error
    }
  }

  async getActiveCategories(): Promise<CategoryData[]> {
    const categories = await this.getCategoriesData()
    return categories.filter((cat) => cat.active).sort((a, b) => a.order - b.order)
  }

  async getCategoryById(id: string): Promise<CategoryData | null> {
    const categories = await this.getCategoriesData()
    return categories.find((cat) => cat.id === id) || null
  }

  async getCategoryByName(name: string): Promise<CategoryData | null> {
    const categories = await this.getCategoriesData()
    return categories.find((cat) => cat.name === name) || null
  }

  async reorderCategories(categoryId: string, newOrder: number): Promise<void> {
    try {
      const { error } = await supabase.from("categories").update({ order: newOrder }).eq("id", categoryId)

      if (error) {
        console.error("Error reordering category:", error)
        throw error
      }

      this.invalidateCache()
    } catch (error) {
      console.error("Error in reorderCategories:", error)
      throw error
    }
  }

  clearCache() {
    this.invalidateCache()
  }

  getCacheStatus() {
    return {
      isCached: this.cache.length > 0,
      isValid: this.isCacheValid(),
      timestamp: this.cacheTimestamp,
      size: this.cache.length,
    }
  }
}

export const categoryService = CategoriesManager.getInstance()
