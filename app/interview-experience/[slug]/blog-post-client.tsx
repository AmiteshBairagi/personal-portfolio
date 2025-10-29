"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Heart, Share2, BookOpen } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import type { BlogPost } from "@/lib/blog-types"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Share failed:", error)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "")
      // Use CodeBlock component for syntax highlighting
      if (!inline && match) {
        return <CodeBlock code={String(children)} language={match[1]} />
      }
      return (
        <code
          className={cn("px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700", className)}
          {...props}
        >
          {children}
        </code>
      )
    },
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-white mb-4 mt-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-white mb-3 mt-6">{children}</h3>,
    p: ({ children }: any) => <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="text-slate-300 mb-4 space-y-2 list-disc list-inside">{children}</ul>,
    ol: ({ children }: any) => <ol className="text-slate-300 mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
    li: ({ children }: any) => <li className="text-slate-300">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-slate-300 my-6">{children}</blockquote>
    ),
    a: ({ href, children }: any) => (
      <a href={href} className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/* Category and Featured Badge */}
          <div className="flex items-center space-x-2 mb-6">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{post.category}</Badge>
            {post.featured && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {post.readTime} min read
            </div>
            <span className="text-cyan-400">By {post.author}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              onClick={handleLike}
              variant="outline"
              className={cn(
                "border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors",
                isLiked && "bg-red-500/20 border-red-500/50 text-red-400",
              )}
            >
              <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
              {likeCount}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                #{tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-invert prose-cyan max-w-none prose-lg">
                <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group h-full hover:border-cyan-500/50">
                    <CardContent className="p-6">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        {relatedPost.readTime} min read
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
              <Link href="/blog">
                <BookOpen className="w-4 h-4 mr-2" />
                More Articles
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
