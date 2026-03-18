import type { Metadata } from "next"
import BlogPostPageClient from "./blog-post-page-client"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostPageClient slug={slug} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Blog Post | Developer Portfolio`,
    description: "Read the full blog post with detailed insights and technical content.",
  }
}
