import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
  team_size: string
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
    teamSize: string
    features: string[]
  }
}

// Data service for managing projects data with Supabase
class ProjectsDataService {
  private static instance: ProjectsDataService
  private cache: { data: ProjectData[]; timestamp: number } | null = null
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private listeners: Set<() => void> = new Set()

  private constructor() {
    this.loadData()
  }

  static getInstance(): ProjectsDataService {
    if (!ProjectsDataService.instance) {
      ProjectsDataService.instance = new ProjectsDataService()
    }
    return ProjectsDataService.instance
  }

  private async loadData() {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching projects from Supabase:", error)
        return
      }

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
      shortDescription: dbData.short_description,
      technologies: dbData.technologies || [],
      githubUrl: dbData.github_url || "",
      liveUrl: dbData.live_url || "",
      category: dbData.category,
      featured: dbData.featured || false,
      duration: dbData.duration || "",
      teamSize: dbData.team_size || "",
      image: dbData.image,
      published: dbData.published !== false,
      details: {
        problem: dbData.problem_statement || "",
        solution: dbData.solution || "",
        challenges: dbData.challenges || "",
        technologies: dbData.technologies || [],
        duration: dbData.duration || "",
        teamSize: dbData.team_size || "",
        features: dbData.features || [],
      },
    }
  }

  private transformToDatabase(projectData: Partial<ProjectData>): any {
    return {
      title: projectData.title,
      description: projectData.description,
      short_description: projectData.shortDescription,
      technologies: projectData.technologies || [],
      github_url: projectData.githubUrl || "",
      live_url: projectData.liveUrl || "",
      category: projectData.category,
      featured: projectData.featured || false,
      duration: projectData.duration || "",
      team_size: projectData.teamSize || "",
      image: projectData.image,
      problem_statement: projectData.details?.problem || "",
      solution: projectData.details?.solution || "",
      challenges: projectData.details?.challenges || "",
      features: projectData.details?.features || [],
      published: projectData.published !== false,
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
      // Get the highest display_order and increment
      const { data: maxOrderData } = await supabase
        .from("projects")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

      const dbData = {
        ...this.transformToDatabase(project),
        display_order: nextOrder,
      }

      const { error } = await supabase.from("projects").insert([dbData])
      if (error) throw error

      await this.loadData()
    } catch (error) {
      console.error("Error adding project:", error)
      throw error
    }
  }

  async updateProject(id: string, updates: Partial<ProjectData>): Promise<void> {
    try {
      const dbData = this.transformToDatabase(updates)

      const { error } = await supabase.from("projects").update(dbData).eq("id", id)

      if (error) throw error

      await this.loadData()
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error

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
        supabase.from("projects").update({ display_order: targetItem.display_order }).eq("id", currentItem.id),
        supabase.from("projects").update({ display_order: currentItem.display_order }).eq("id", targetItem.id),
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

  // Force refresh from Supabase
  async refresh(): Promise<void> {
    this.cache = null
    await this.loadData()
  }
}

export const projectsDataService = ProjectsDataService.getInstance()
