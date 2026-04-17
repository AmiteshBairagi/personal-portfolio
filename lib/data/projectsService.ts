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
  teamSize?: string
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

const transformFromDatabase = (dbData: any): ProjectData => ({
  id: dbData.id,
  title: dbData.title,
  description: dbData.description,
  short_description: dbData.short_description ?? dbData.shortDescription,
  technologies: dbData.technologies || [],
  github_url: (dbData.github_url ?? dbData.githubUrl) || "",
  live_url: (dbData.live_url ?? dbData.liveUrl) || "",
  category: dbData.category,
  featured: dbData.featured || false,
  duration: dbData.duration || "",
  image: dbData.image ?? dbData.imageUrl,
  published: dbData.published !== false,
  details: {
    problem: (dbData.problem_statement ?? dbData.problemStatement) || "",
    solution: dbData.solution || "",
    challenges: dbData.challenges || "",
    technologies: dbData.technologies || [],
    duration: dbData.duration || "",
    features: dbData.features || [],
  },
})

const transformToDatabase = (projectData: Partial<ProjectData>): any => ({
  title: projectData.title,
  description: projectData.description,
  shortDescription: projectData.short_description,
  technologies: projectData.technologies || [],
  githubUrl: projectData.github_url || "",
  liveUrl: projectData.live_url || "",
  category: projectData.category,
  featured: projectData.featured || false,
  duration: projectData.duration || "",
  teamSize: projectData.teamSize || "",
  problemStatement: projectData.details?.problem || "",
  solution: projectData.details?.solution || "",
  challenges: projectData.details?.challenges || "",
  features: projectData.details?.features || [],
})

const transformToUpdateRequest = (projectData: Partial<ProjectData>): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    title: projectData.title,
    description: projectData.description,
    shortDescription: projectData.short_description,
    technologies: projectData.technologies,
    githubUrl: projectData.github_url,
    liveUrl: projectData.live_url,
    category: projectData.category,
    featured: projectData.featured,
    duration: projectData.duration,
    teamSize: projectData.teamSize,
    solution: projectData.solution ?? projectData.details?.solution,
    challenges: projectData.challenges ?? projectData.details?.challenges,
    features: projectData.features ?? projectData.details?.features,
  }

  Object.keys(payload).forEach((key) => {
    const value = payload[key]
    if (value === undefined || value === null) {
      delete payload[key]
    }
  })

  return payload
}

export const projectsDataService = {
  async getProjects(): Promise<ProjectData[]> {
    const { data } = await api.get<any[]>("/api/get-all-projects")
    return data?.map(transformFromDatabase) || []
  },

  async getProject(id: string): Promise<ProjectData | undefined> {
    const projects = await this.getProjects()
    return projects.find((p) => p.id === id)
  },

  async addProject(project: Omit<ProjectData, "id">, imageFile?: File): Promise<void> {
    const dbData = transformToDatabase(project)
    const formData = new FormData()

    formData.append(
      "data",
      new Blob([JSON.stringify(dbData)], { type: "application/json" }),
    )

    if (!imageFile) {
      throw new Error("Project image is required")
    }

    formData.append("image", imageFile)

    await api.post("/api/add-project", formData)
  },

  async updateProject(id: string, updates: Partial<ProjectData>, imageFile?: File): Promise<void> {
    const updatePayload = transformToUpdateRequest(updates)
    const formData = new FormData()

    formData.append(
      "body",
      new Blob([JSON.stringify(updatePayload)], { type: "application/json" }),
    )

    if (imageFile) {
      formData.append("image", imageFile)
    }

    await api.put(`/api/update-project/${id}`, formData)
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/api/delete-project/${id}`)
  },

  async reorderProject(id: string, direction: "up" | "down"): Promise<void> {
    const currentData = await this.getProjects()
    const currentIndex = currentData.findIndex((item) => item.id === id)

    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= currentData.length) return

    const currentItem = currentData[currentIndex]
    const targetItem = currentData[newIndex]

    await Promise.all([
      api.put(`/api/update-project/${currentItem.id}`, { display_order: targetItem.display_order }),
      api.put(`/api/update-project/${targetItem.id}`, { display_order: currentItem.display_order }),
    ])
  }
}
