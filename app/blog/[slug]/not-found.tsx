"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/contexts/theme-context"
import OptimizedNavbar from "@/components/Navbar"

export default function BlogPostNotFound() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-dark-900">
        <OptimizedNavbar />

        <main className="pt-20">
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                The blog post you're looking for doesn't exist or may have been moved. Let's get you back to reading
                some great content!
              </p>
              <div className="space-y-4">
                <Button asChild size="lg" className="w-full">
                  <Link href="/blog">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse All Posts
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
