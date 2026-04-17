"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Shield,
  Code,
  Award,
  Mail,
  Briefcase,
  LogOut,
  BookOpen,
  Tag,
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

const ProjectsManager = dynamic(() => import("@/components/admin/ProjectManager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Projects Manager...</div>,
  ssr: false,
})

const CategoriesManager = dynamic(() => import("@/components/admin/CategoryManager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Categories Manager...</div>,
  ssr: false,
})

const SkillsManager = dynamic(() => import("@/components/admin/SkillsManager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Skills Manager...</div>,
  ssr: false,
})

const CertificationsManager = dynamic(() => import("@/components/admin/CertificationManager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Certifications Manager...</div>,
  ssr: false,
})

const InterviewExperienceManager = dynamic(() => import("@/components/admin/BlogManager"), {
  loading: () => <div className="p-4 text-slate-400">Loading Blog Manager...</div>,
  ssr: false,
})

const ContactManager = dynamic(() => import("@/components/admin/ContactManager"), {
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
  const [activeTab, setActiveTab] = useState("projects")
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
      id: "blogs",
      label: "Blogs",
      icon: BookOpen,
      description: "Manage blog posts and articles",
      component: InterviewExperienceManager,
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
    },
    {
      id: "lead",
      label: "Leads",
      icon: Mail,
      description: "Manage leads information",
      component: ContactManager,
      color: "from-indigo-500/20 to-blue-500/20",
      iconColor: "text-indigo-400",
    },
  ]

  // Show loading state
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-slate-900"></div>
          <p className="text-slate-300 text-lg">Loading Admin Panel...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  // Show authentication error
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 bg-slate-900 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
          <p className="text-slate-300 text-lg">Authentication Required</p>
          <p className="text-slate-500 text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="h-[100dvh] bg-slate-950 flex flex-col font-sans overflow-hidden text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex-shrink-0 shadow-sm z-40 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors group text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Portfolio
              </Link>
              <div className="hidden sm:flex items-center space-x-3 border-l border-slate-700 pl-4 ml-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white leading-tight">Admin Dashboard</h1>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Content Manager</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-slate-800/30 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 rounded-lg h-9"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-4 py-3 z-50 absolute top-16 left-0 right-0 max-w-7xl mx-auto">
          <Alert className="bg-red-500/10 border-red-500/30 text-red-300 shadow-lg backdrop-blur-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between font-medium">
              {error}
              <Button variant="ghost" size="sm" onClick={() => setError(null)} className="text-red-300 hover:bg-red-500/20 hover:text-red-200">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex w-full h-full">
          
          {/* Sidebar Navigation */}
          <div className="hidden md:flex flex-col w-64 border-r border-slate-800/60 bg-slate-900/30 flex-shrink-0 z-10 w-[260px]">
            <TabsList className="flex flex-col h-full bg-transparent justify-start items-start p-4 gap-2 border-0 w-full rounded-none h-auto overflow-y-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">Menu</div>
              {adminTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full justify-start px-4 py-3 min-h-[48px] rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/20 data-[state=active]:shadow-none border border-transparent transition-all duration-300"
                >
                  <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium text-left truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Mobile Navigation (Horizontal scrollable) */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-sm overflow-x-auto scrollbar-hide overscroll-x-contain">
            <TabsList className="flex flex-nowrap justify-start items-center gap-2 p-3 bg-transparent rounded-none h-auto w-max border-0">
              {adminTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center justify-center px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 border border-transparent transition-all duration-300 whitespace-nowrap"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden relative pt-[60px] md:pt-0 w-full h-full">
            <div className="h-full w-full overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {adminTabs.map((tab) => (
                  <TabsContent 
                    key={tab.id} 
                    value={tab.id} 
                    className="m-0 h-full w-full outline-none data-[state=inactive]:hidden max-w-full"
                    forceMount
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full flex flex-col min-h-full pb-10"
                      >
                        {/* Tab Header inside individual pane */}
                        <div className="flex items-center space-x-4 mb-6 flex-shrink-0 w-full">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${tab.color} rounded-xl flex items-center justify-center border border-white/5 shadow-lg`}
                          >
                            <tab.icon className={`w-6 h-6 ${tab.iconColor}`} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{tab.label}</h2>
                            <p className="text-sm text-slate-400 mt-0.5">{tab.description}</p>
                          </div>
                        </div>

                        {/* Rendering the Manager Directly */}
                        <div className="w-full flex-1">
                          <ErrorBoundary
                            fallback={
                              <div className="flex items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-red-900/30">
                                <div className="text-center">
                                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                  <h3 className="text-lg font-semibold text-white mb-2">Component Error</h3>
                                  <p className="text-slate-400 mb-6">
                                    There was an error loading the {tab.label} manager.
                                  </p>
                                  <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-slate-800 hover:bg-slate-700 text-white border-0"
                                  >
                                    Reload Page
                                  </Button>
                                </div>
                              </div>
                            }
                          >
                            <tab.component />
                          </ErrorBoundary>
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </Tabs>
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
