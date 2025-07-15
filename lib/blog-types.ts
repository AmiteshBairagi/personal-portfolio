export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  readTime: number
  tags: string[]
  category: string
  image: string
  featured: boolean
  published: boolean
}

export const blogCategories = [
  "All",
  "Interview Experience",
  "Technical Tutorial",
  "Career Advice",
  "Web Development",
  "Programming",
]
