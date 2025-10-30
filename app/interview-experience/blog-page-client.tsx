"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Search, Filter, BookOpen, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useBlogStore } from "@/hooks/use-blog-store"
import type { BlogPost } from "@/lib/blog-types"

interface BlogPageClientProps {
  categories: string[]
  initialCategory: string
  initialSearchTerm: string
}

export default function BlogPageClient({ categories, initialCategory, initialSearchTerm }: BlogPageClientProps) {
  const { posts, isLoaded, initializeStore, getPublishedPosts, getPostsByCategory } = useBlogStore()

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  // Initialize store on mount
  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  // Update filtered posts when store loads or filters change
  useEffect(() => {
    if (!isLoaded || posts.length === 0) return

    let basePosts = selectedCategory === "All" ? getPublishedPosts() : getPostsByCategory(selectedCategory)

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      basePosts = basePosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          post.author.toLowerCase().includes(searchLower),
      )
    }

    setFilteredPosts(basePosts)
  }, [searchTerm, selectedCategory, posts, isLoaded, getPublishedPosts, getPostsByCategory])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700/50 animate-pulse">
                <div className="h-48 bg-slate-700 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-slate-700 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-700 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div>
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-4xl font-bold text-white mb-6">My Interview Experiences</h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-end"
        >
          <Card className="bg-slate-800/50 border-slate-700/50 w-full lg:w-1/3">
            <CardContent className="p-2">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={
                        selectedCategory === category
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {category}
                    </Button>
                  ))}
                </div> */}

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results count */}
        {/* <div className="text-center mb-8">
          <p className="text-slate-400">
            {filteredPosts.length === 0
              ? "No articles found"
              : `${filteredPosts.length} article${filteredPosts.length === 1 ? "" : "s"} found`}
          </p>
        </div> */}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Articles Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "No articles available at the moment"}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group h-full hover:border-cyan-500/50 cursor-pointer">
                    {/* Featured Image */}
                    {/* <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <OptimizedImage
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {post.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Featured</Badge>
                        </div>
                      )}
                    </div> */}

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{post.category}</Badge>
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime} min read
                        </div>
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-slate-400 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                        <span className="text-cyan-400">By {post.author}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
