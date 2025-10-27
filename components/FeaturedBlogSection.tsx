"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { useBlogRealTime } from "@/hooks/use-blog-real-time"
import OptimizedImage from "./optimized-image"

const FeaturedBlogSection = () => {
  const { posts, isLoading, error, isOnline, lastSyncTime, getFeaturedPosts } = useBlogRealTime()

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center max-w-md mx-auto">
            <div className="text-red-400 mb-4">
              <WifiOff className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to Load Articles</h3>
              <p className="text-sm text-slate-400 mt-2">{error}</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  const featuredPosts = getFeaturedPosts(3)

  if (featuredPosts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-slate-800/30">
      <div className="container mx-auto px-4">
        {/* Connection Status */}
        <div className="flex justify-center mb-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              isOnline
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? "Live" : "Offline"}
            {lastSyncTime && <span className="text-slate-400">• Last sync: {lastSyncTime.toLocaleTimeString()}</span>}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Articles</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Dive into my latest thoughts on technology, career development, and software engineering
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 group h-full hover:border-cyan-500/50">
                  {/* Featured Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <OptimizedImage
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Featured</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{post.category}</Badge>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.read_time} min read
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
                        {new Date(post.published_at).toLocaleDateString()}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
            <Link href="/blog">
              <span className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                View All Articles
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedBlogSection