"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useProjectsData } from "@/hooks/use-projects-data"
import { useCategoriesData } from "@/hooks/use-categories-data"

const ProjectCard = memo(
  ({
    project,
    index,
    getCategoryByName,
  }: {
    project: any
    index: number
    getCategoryByName: (name: string) => any
  }) => {
    const category = getCategoryByName(project.category)

    return (
      <motion.div
        key={`${project.id}-${index}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -10 }}
        className="group cursor-pointer h-full"
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
                <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30" asChild>
                  <a href={project.githubUrl || project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30" asChild>
                  <a href={project.liveUrl || project.live_url} target="_blank" rel="noopener noreferrer">
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
              {project.shortDescription || project.short_description}
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

export default memo(function ProjectsSection() {
  const { data: projectsData, isLoading, error } = useProjectsData()
  const { getCategoryByName } = useCategoriesData()

  // Filter only published projects and show first 5
  const publishedProjects = useMemo(() => projectsData.filter((project) => project.published !== false), [projectsData])

  const initialProjects = useMemo(() => publishedProjects.slice(0, 5), [publishedProjects])

  const sectionHeader = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          My <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A showcase of my recent work and the technologies I've mastered
        </p>
      </motion.div>
    ),
    [],
  )

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <p className="text-red-500">Error loading projects: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (publishedProjects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">No projects available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionHeader}

        {/* Projects Grid - Custom Layout */}
        <div className="space-y-8 mb-12">
          {/* First Row - 3 Projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProjects.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} getCategoryByName={getCategoryByName} />
            ))}
          </div>

          {/* Second Row - 2 Projects */}
          {initialProjects.length > 3 && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {initialProjects.slice(3, 5).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index + 3}
                  getCategoryByName={getCategoryByName}
                />
              ))}
            </div>
          )}
        </div>

        {/* See All Projects Button */}
        {publishedProjects.length > 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white group" asChild>
              <Link href="/projects">
                See All Projects
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
})
