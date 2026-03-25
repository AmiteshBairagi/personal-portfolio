import type { Metadata } from "next"
import PageClient from "./page-client"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageClient slug={slug} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Blog Post | Developer Portfolio`,
    description: "Read the full blog post with detailed insights and technical content.",
  }
}
