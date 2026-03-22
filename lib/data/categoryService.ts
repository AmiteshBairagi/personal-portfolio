import { api } from "@/lib/axios"

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

  static getInstance(): CategoriesManager {
    if (!CategoriesManager.instance) {
      CategoriesManager.instance = new CategoriesManager()
    }
    return CategoriesManager.instance
  }


  async getCategoriesData(): Promise<CategoryData[]> {
    try {
      const { data } = await api.get<CategoryData[]>("/api/get-all-categories")
      return data;

    } catch (error) {
      console.error("Error in getCategoriesData:", error)
      throw error
    }
  }

  async createCategory(categoryData: Omit<CategoryData, "id" | "created_at" | "updated_at">): Promise<CategoryData> {
    try {
      const { data } = await api.post<CategoryData>("/api/add-category", categoryData)
      return data
    } catch (error) {
      console.error("Error in createCategory:", error)
      throw error
    }
  }

  async updateCategory(id: string, updates: Partial<CategoryData>): Promise<CategoryData> {
    try {
      const { data } = await api.put<CategoryData>("/api/update-category", updates)
      return data
    } catch (error) {
      console.error("Error in updateCategory:", error)
      throw error
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/api/delete-category/${id}`)
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
      await api.put(`/api/categories/${categoryId}`, { order: newOrder })
    } catch (error) {
      console.error("Error in reorderCategories:", error)
      throw error
    }
  }

}

export const categoryService = CategoriesManager.getInstance()
