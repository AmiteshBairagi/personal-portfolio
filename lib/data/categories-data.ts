import { categoriesDataManager, type CategoryData } from "./categories-data-manager"

// Re-export the interface and manager for backward compatibility
export type { CategoryData }

class CategoriesDataService {
  private static instance: CategoriesDataService
  private listeners: Set<() => void> = new Set()

  private constructor() {
    // Subscribe to the data manager updates
    categoriesDataManager.subscribe(() => {
      this.notifyListeners()
    })
  }

  static getInstance(): CategoriesDataService {
    if (!CategoriesDataService.instance) {
      CategoriesDataService.instance = new CategoriesDataService()
    }
    return CategoriesDataService.instance
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  async getData(): Promise<CategoryData[]> {
    return await categoriesDataManager.getCategoriesData()
  }

  async getActiveCategories(): Promise<CategoryData[]> {
    return await categoriesDataManager.getActiveCategories()
  }

  async addCategory(category: CategoryData): Promise<void> {
    const { id, created_at, updated_at, ...categoryData } = category
    await categoriesDataManager.createCategory(categoryData)
  }

  async updateCategory(id: string, updates: Partial<CategoryData>): Promise<void> {
    await categoriesDataManager.updateCategory(id, updates)
  }

  async deleteCategory(id: string): Promise<void> {
    await categoriesDataManager.deleteCategory(id)
  }

  async getCategory(id: string): Promise<CategoryData | undefined> {
    const category = await categoriesDataManager.getCategoryById(id)
    return category || undefined
  }

  async getCategoryByName(name: string): Promise<CategoryData | undefined> {
    const category = await categoriesDataManager.getCategoryByName(name)
    return category || undefined
  }
}

export const categoriesDataService = CategoriesDataService.getInstance()
