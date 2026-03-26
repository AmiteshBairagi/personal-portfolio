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

interface PostDisplayProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function PostDisplay({ post, relatedPosts }: PostDisplayProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-colors">
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
          className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-slate-800/30 to-slate-800/10 p-8 rounded-xl border border-slate-700/50 backdrop-blur-sm"
        >
          {/* Category and Featured Badge */}
          <div className="flex items-center space-x-2 mb-6">
            <Badge className="bg-cyan-500/30 text-cyan-200 border-cyan-500/50 hover:bg-cyan-500/40 transition-colors">{post.category}</Badge>
            {post.featured && <Badge className="bg-yellow-500/30 text-yellow-200 border-yellow-500/50">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">{post.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8 pb-6 border-b border-slate-700/30">
            <div className="flex items-center hover:text-cyan-400 transition-colors">
              <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center hover:text-cyan-400 transition-colors">
              <Clock className="w-5 h-5 mr-2 text-cyan-400" />
              {post.readTime} min read
            </div>
            <span className="text-cyan-300 font-medium">By {post.author}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              onClick={handleLike}
              variant="outline"
              className={cn(
                "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all",
                isLiked && "bg-red-500/20 border-red-500/50 text-red-300",
              )}
            >
              <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current text-red-400")} />
              {likeCount}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-700/70 text-slate-200 border-slate-600 hover:bg-cyan-500/30 hover:text-cyan-200 transition-all">
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
                <Link key={relatedPost.id} href={`/blogs/${relatedPost.slug}`}>
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
          className="max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-700/50"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:text-slate-100 transition-all">
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
