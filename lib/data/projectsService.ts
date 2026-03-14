import { api } from "@/lib/axios"

export interface ProjectData {
  id: string
  title: string
  description: string
  short_description: string
  technologies: string[]
  github_url: string
  live_url: string
  category: string
  featured: boolean
  duration: string
  image?: string
  problem_statement?: string
  solution?: string
  challenges?: string
  features?: string[]
  published?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
  details?: {
    problem: string
    solution: string
    challenges: string
    technologies: string[]
    duration: string
    features: string[]
  }
}

class ProjectsDataService {
  private static instance: ProjectsDataService
  private cache: { data: ProjectData[]; timestamp: number } | null = null
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private listeners: Set<() => void> = new Set()

  private constructor() {
    // Data is loaded lazily on first getData() call
  }

  static getInstance(): ProjectsDataService {
    if (!ProjectsDataService.instance) {
      ProjectsDataService.instance = new ProjectsDataService()
    }
    return ProjectsDataService.instance
  }

  private async loadData() {
    try {
      const { data } = await api.get<any[]>("/api/projects")

      // Transform data to match frontend interface
      const transformedData = data?.map(this.transformFromDatabase) || []

      this.cache = {
        data: transformedData,
        timestamp: Date.now(),
      }

      this.notifyListeners()
    } catch (error) {
      console.error("Unexpected error fetching projects:", error)
    }
  }

  private transformFromDatabase(dbData: any): ProjectData {
    return {
      id: dbData.id,
      title: dbData.title,
      description: dbData.description,
      short_description: dbData.short_description,
      technologies: dbData.technologies || [],
      github_url: dbData.github_url || "",
      live_url: dbData.live_url || "",
      category: dbData.category,
      featured: dbData.featured || false,
      duration: dbData.duration || "",
      image: dbData.image,
      published: dbData.published !== false,
      details: {
        problem: dbData.problem_statement || "",
        solution: dbData.solution || "",
        challenges: dbData.challenges || "",
        technologies: dbData.technologies || [],
        duration: dbData.duration || "",
        features: dbData.features || [],
      },
    }
  }

  private transformToDatabase(projectData: Partial<ProjectData>): any {
    return {
      title: projectData.title,
      description: projectData.description,
      short_description: projectData.short_description,
      technologies: projectData.technologies || [],
      github_url: projectData.github_url || "",
      live_url: projectData.live_url || "",
      category: projectData.category,
      featured: projectData.featured || false,
      duration: projectData.duration || "",
      image: projectData.image,
      problem_statement: projectData.details?.problem || "",
      solution: projectData.details?.solution || "",
      challenges: projectData.details?.challenges || "",
      features: projectData.details?.features || [],
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())

    // Broadcast to other tabs/windows
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("projectsDataUpdated"))
      localStorage.setItem("projectsDataUpdate", Date.now().toString())

      try {
        const channel = new BroadcastChannel("projectsData")
        channel.postMessage({ type: "UPDATE" })
      } catch (e) {
        // BroadcastChannel not supported
      }
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getData(): ProjectData[] {
    // Check cache validity
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return [...this.cache.data]
    }

    // Refresh data if cache is stale
    this.loadData()
    return this.cache?.data ? [...this.cache.data] : []
  }

  async addProject(project: Omit<ProjectData, "id">): Promise<void> {
    try {
      const dbData = this.transformToDatabase(project)
      await api.post("/api/projects", dbData)
      await this.loadData()
    } catch (error) {
      console.error("Error adding project:", error)
      throw error
    }
  }

  async updateProject(id: string, updates: Partial<ProjectData>): Promise<void> {
    try {
      const dbData = this.transformToDatabase(updates)
      await api.put(`/api/projects/${id}`, dbData)
      await this.loadData()
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/api/projects/${id}`)
      await this.loadData()
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  }

  async reorderProject(id: string, direction: "up" | "down"): Promise<void> {
    try {
      const currentData = this.getData()
      const currentIndex = currentData.findIndex((item) => item.id === id)

      if (currentIndex === -1) return

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      if (newIndex < 0 || newIndex >= currentData.length) return

      // Swap display orders
      const currentItem = currentData[currentIndex]
      const targetItem = currentData[newIndex]

      await Promise.all([
        api.put(`/api/projects/${currentItem.id}`, { display_order: targetItem.display_order }),
        api.put(`/api/projects/${targetItem.id}`, { display_order: currentItem.display_order }),
      ])

      await this.loadData()
    } catch (error) {
      console.error("Error reordering project:", error)
      throw error
    }
  }

  getProject(id: string): ProjectData | undefined {
    const data = this.getData()
    return data.find((item) => item.id === id)
  }

  // Force refresh from backend
  async refresh(): Promise<void> {
    this.cache = null
    await this.loadData()
  }
}

export const projectsDataService = ProjectsDataService.getInstance()
