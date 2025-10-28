export interface SkillItem {
  id: string
  name: string
  level: number
  projects: string[]
  experience: string
  category: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}


export interface SkillCategory {
  [key: string]: SkillItem[]
}