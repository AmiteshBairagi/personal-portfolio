export interface ContactData {
  id: string
  email: string
  phone?: string
  location?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  resume_url?: string
  bio?: string
  availability_status: "available" | "busy" | "unavailable"
  created_at: string
  updated_at: string
}