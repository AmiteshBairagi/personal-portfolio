"use client"

import { useState, memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Github, Eye, Calendar, Users, Code, Search, Filter, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeProvider } from "@/contexts/theme-context"
import { useProjects } from "@/hooks/useProjects"
import { useCategories } from "@/hooks/useCategories"

const ProjectCard = memo(
  ({
    project,
    index,
    onSelect,
    getCategoryByName,
  }: {
    project: any
    index: number
    onSelect: (project: any) => void
    getCategoryByName: (name: string) => any
  }) => {
    const category = getCategoryByName(project.category)

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        whileHover={{ y: -10 }}
        className="group cursor-pointer h-full"
        onClick={() => onSelect(project)}
      >
        <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:border-primary-500/50">
          {/* Project Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg?height=300&width=400"}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Overlay Icons */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-4">
                <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary-500 text-white">Featured</Badge>
              </div>
            )}
          </div>

          <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
            {/* Category */}
            {category ? (
              <Badge
                variant="outline"
                className="text-xs w-fit flex items-center space-x-1"
                style={{ borderColor: category.color, color: category.color }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs w-fit">
                {project.category}
              </Badge>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
              {project.shortDescription}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.technologies.slice(0, 3).map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  },
)

ProjectCard.displayName = "ProjectCard"

export default function AllProjectsPage() {
  const { data: projectsData, isLoading } = useProjects()
  const { getActiveCategories, getCategoryByName } = useCategories()
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter only published projects
  const publishedProjects = useMemo(() => projectsData.filter((project) => project.published !== false), [projectsData])

  // Get dynamic categories from active categories
  const categoriesList = useMemo(() => {
    const activeCategories = getActiveCategories().map((cat) => cat.name)
    return ["All", ...activeCategories]
  }, [getActiveCategories])

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [publishedProjects, searchTerm, selectedCategory])

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-dark-900">
        {/* Header Section - No Navigation Bar */}
        <section className=" bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-800 dark:to-dark-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="flex pt-6">
                <div className="w-100">
                  <Button variant="ghost" className="mb-2 text-primary-600 hover:text-primary-700" asChild>
                    <Link href="/#projects">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
                <div className="w-full pr-40">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    All <span className="gradient-text">Projects</span>
                  </h1>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Explore my complete portfolio of projects, showcasing various technologies and solutions
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-center"
            >
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-dark-800"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-primary-500 text-white" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onSelect={setSelectedProject}
                    getCategoryByName={getCategoryByName}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-800">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold gradient-text">{selectedProject.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Project Image */}
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProject.image || "/placeholder.svg?height=300&width=400"}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Project Info Grid */}
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600 dark:text-gray-300">Duration: {selectedProject.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600 dark:text-gray-300">Team: {selectedProject.teamSize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-600 dark:text-gray-300">Category: {selectedProject.category}</span>
                    </div>
                  </div>

                  {/* Problem & Solution */}
                  {selectedProject.details && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Problem</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProject.details.problem}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Solution</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProject.details.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Challenges</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedProject.details.challenges}</p>
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech: string) => (
                        <Badge key={tech} className="bg-primary-500/10 text-primary-600 dark:text-primary-400">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {selectedProject.details?.features && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {selectedProject.details.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}
