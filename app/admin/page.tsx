"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Shield,
  Database,
  Users,
  Code,
  Award,
  Mail,
  GraduationCap,
  Briefcase,
  LogOut,
  BookOpen,
  Tag,
  Home,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Lazy load admin components with error boundaries

import dynamic from "next/dynamic"

const HeroManager = dynamic(() => import("@/components/admin/hero-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Hero Manager...</div>,
  ssr: false,
})

const AboutManager = dynamic(() => import("@/components/admin/about-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading About Manager...</div>,
  ssr: false,
})

const EducationManager = dynamic(() => import("@/components/admin/education-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Education Manager...</div>,
  ssr: false,
})

const ProjectsManager = dynamic(() => import("@/components/admin/projects-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Projects Manager...</div>,
  ssr: false,
})

const CategoriesManager = dynamic(() => import("@/components/admin/categories-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Categories Manager...</div>,
  ssr: false,
})

const SkillsManager = dynamic(() => import("@/components/admin/skills-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Skills Manager...</div>,
  ssr: false,
})

const CertificationsManager = dynamic(() => import("@/components/admin/certifications-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Certifications Manager...</div>,
  ssr: false,
})

const BlogManager = dynamic(() => import("@/components/admin/blog-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Blog Manager...</div>,
  ssr: false,
})

const ContactManager = dynamic(() => import("@/components/admin/contact-manager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Contact Manager...</div>,
  ssr: false,
})

// Error boundary component
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState("hero")
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const handleLogout = () => {
    try {
      logout()
      router.push("/login")
    } catch (err) {
      setError("Failed to logout. Please try again.")
    }
  }

  const adminTabs = [
    {
      id: "hero",
      label: "Hero",
      icon: Home,
      description: "Manage hero section content and image",
      component: HeroManager,
      color: "from-cyan-500/20 to-blue-500/20",
      iconColor: "text-cyan-400",
    },
    {
      id: "about",
      label: "About",
      icon: Users,
      description: "Manage personal information and bio",
      component: AboutManager,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      description: "Manage educational background",
      component: EducationManager,
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Briefcase,
      description: "Manage portfolio projects",
      component: ProjectsManager,
      color: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Tag,
      description: "Manage project categories",
      component: CategoriesManager,
      color: "from-teal-500/20 to-emerald-500/20",
      iconColor: "text-teal-400",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code,
      description: "Manage technical skills",
      component: SkillsManager,
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      description: "Manage certifications and achievements",
      component: CertificationsManager,
      color: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-400",
    },
    {
      id: "blog",
      label: "Blog",
      icon: BookOpen,
      description: "Manage blog posts and articles",
      component: BlogManager,
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
    },
    {
      id: "contact",
      label: "Contact",
      icon: Mail,
      description: "Manage contact information",
      component: ContactManager,
      color: "from-indigo-500/20 to-blue-500/20",
      iconColor: "text-indigo-400",
    },
  ]

  // Show loading state
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading Admin Panel...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  // Show authentication error
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Authentication Required</p>
          <p className="text-slate-500 text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const currentTab = adminTabs.find((tab) => tab.id === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
              </Link>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-slate-400">Portfolio Manager</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-600/50 text-red-400 hover:bg-red-600/20 hover:border-red-500/70 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-300">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">9</div>
                    <div className="text-xs text-slate-400">Sections</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">12</div>
                    <div className="text-xs text-slate-400">Projects</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">15</div>
                    <div className="text-xs text-slate-400">Skills</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex-shrink-0 mb-6">
              <TabsList className="flex flex-wrap justify-center sm:grid sm:grid-cols-3 lg:grid-cols-9 gap-2 bg-slate-800/60 p-2 rounded-xl backdrop-blur-sm">
                {adminTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="px-3 py-2 rounded-lg bg-slate-800/60 text-white hover:bg-slate-700/60 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 transition-all duration-200"
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 min-h-[600px]">
              <AnimatePresence mode="wait">
                {adminTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="h-full m-0">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm h-full">
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${tab.color} rounded-lg flex items-center justify-center`}
                            >
                              <tab.icon className={`w-5 h-5 ${tab.iconColor}`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white">{tab.label} Management</CardTitle>
                              <p className="text-slate-400">{tab.description}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 h-[calc(100%-120px)] overflow-y-auto">
                          <ErrorBoundary
                            fallback={
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                  <h3 className="text-lg font-semibold text-white mb-2">Component Error</h3>
                                  <p className="text-slate-400 mb-4">
                                    There was an error loading the {tab.label} manager.
                                  </p>
                                  <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                  >
                                    Reload Page
                                  </Button>
                                </div>
                              </div>
                            }
                          >
                            <tab.component />
                          </ErrorBoundary>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedRoute>
          <AdminContent />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  )
}
