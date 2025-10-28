export interface CertificationItem {
  id: string
  title: string
  issuer: string
  date: string
  credential_id: string
  image: string
  description: string
  skills: string[]
  verification_url: string
  featured: boolean
  valid_until: string
  level: "Professional" | "Associate" | "Expert"
  exam_score: string
  display_order: number
  created_at?: string
  updated_at?: string
}