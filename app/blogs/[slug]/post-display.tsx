"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2, BookOpen } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import type { BlogPost } from "@/lib/blog-types"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"

interface PostDisplayProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function PostDisplay({ post, relatedPosts }: PostDisplayProps) {
  const normalizedContent = post.content.replace(/\\n/g, "\n")
  const hasMarkdown = /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|```)/.test(normalizedContent)
  const paragraphs = !hasMarkdown
    ? normalizedContent
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : []

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
          className={cn(
            "px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-cyan-300 dark:border-slate-700",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      )
    },
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 mt-8 first:mt-0">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">{children}</h3>,
    p: ({ children }: any) => <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="text-slate-700 dark:text-slate-300 mb-4 space-y-2 list-disc list-inside">{children}</ul>,
    ol: ({ children }: any) => <ol className="text-slate-700 dark:text-slate-300 mb-4 space-y-2 list-decimal list-inside">{children}</ol>,
    li: ({ children }: any) => <li className="text-slate-700 dark:text-slate-300">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-slate-700 dark:text-slate-300 my-6">{children}</blockquote>
    ),
    a: ({ href, children }: any) => (
      <a href={href} className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 pt-6 pb-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 -ml-1"
        >
          <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-500 transition-colors">
            <Link href="/blogs">
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
          className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-slate-100/80 to-slate-50 p-6 md:p-7 rounded-xl border border-slate-200 dark:from-slate-800/30 dark:to-slate-800/10 dark:border-slate-700/50 backdrop-blur-sm"
        >
          {/* Category and Featured Badge */}
          <div className="flex items-center space-x-2 mb-6">
            <Badge className="bg-cyan-500/20 text-cyan-700 border-cyan-500/30 hover:bg-cyan-500/30 transition-colors dark:bg-cyan-500/30 dark:text-cyan-200 dark:border-cyan-500/50">{post.category}</Badge>
            {post.featured && <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/30 dark:text-yellow-200 dark:border-yellow-500/50">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="max-w-3xl text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700/30">
            <div className="flex items-center hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
              <Calendar className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
              <Clock className="w-5 h-5 mr-2 text-cyan-500 dark:text-cyan-400" />
              {post.readTime} min read
            </div>
            <span className="text-cyan-600 dark:text-cyan-300 font-medium">By {post.author}</span>
            <div className="flex-1"></div>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:border-slate-500 transition-all"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-200 text-slate-700 border-slate-200 hover:bg-cyan-500/20 hover:text-cyan-700 transition-all dark:bg-slate-700/70 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-cyan-500/30 dark:hover:text-cyan-200">
                #{tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40">
            <img
              src={post.imageUrl || "/placeholder.svg?height=800&width=1200"}
              alt={post.title}
              className="w-full h-full max-h-[460px] object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-cyan max-w-none prose-lg dark:prose-invert">
                {hasMarkdown ? (
                  <ReactMarkdown components={markdownComponents}>{normalizedContent}</ReactMarkdown>
                ) : (
                  paragraphs.map((paragraph, index) => (
                    <p key={`${post.id}-paragraph-${index}`} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                )}
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blogs/${relatedPost.slug}`}>
                  <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-300 group h-full hover:border-cyan-500/50">
                    <CardContent className="p-6">
                      <Badge className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{relatedPost.excerpt}</p>
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
          className="max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-200 dark:border-slate-700/50"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-500 dark:hover:text-slate-100 transition-all">
              <Link href="/blogs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <Button asChild className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/20">
              <Link href="/blogs">
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
