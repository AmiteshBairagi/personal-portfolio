import type { Metadata } from "next"
import BlogPostPageClient from "./blog-post-page-client"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostPageClient slug={params.slug} />
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: `Blog Post | Developer Portfolio`,
    description: "Read the full blog post with detailed insights and technical content.",
  }
}
