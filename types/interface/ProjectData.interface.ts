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