// "use client"

// import { useState, memo, useMemo, lazy, Suspense } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ExternalLink, Github, Eye } from "lucide-react"
// import OptimizedImage from "@/components/optimized-image"
// import OptimizedSection from "@/components/optimized-section"

// // Lazy load the project modal
// const ProjectModal = lazy(() => import("@/components/project-modal"))

// const projectsData = [
//   {
//     id: 1,
//     title: "E-Commerce Platform",
//     description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
//     shortDescription: "Modern e-commerce platform with advanced features",
//     image: "/placeholder.svg?height=300&width=400",
//     technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
//     githubUrl: "https://github.com/username/ecommerce",
//     liveUrl: "https://ecommerce-demo.com",
//     category: "Full Stack",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Task Management App",
//     description: "Collaborative task management with real-time updates",
//     shortDescription: "Team collaboration made simple",
//     image: "/placeholder.svg?height=300&width=400",
//     technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
//     githubUrl: "https://github.com/username/taskmanager",
//     liveUrl: "https://taskmanager-demo.com",
//     category: "Web App",
//     featured: true,
//   },
//   // Add more projects...
// ]

// const ProjectCard = memo(
//   ({
//     project,
//     index,
//     onSelect,
//   }: {
//     project: (typeof projectsData)[0]
//     index: number
//     onSelect: (project: (typeof projectsData)[0]) => void
//   }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-100px" }}
//       transition={{ duration: 0.6, delay: index * 0.1 }}
//       whileHover={{ y: -10 }}
//       className="group cursor-pointer"
//       onClick={() => onSelect(project)}
//     >
//       <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:border-primary-500/50">
//         {/* Project Image */}
//         <div className="relative h-48 overflow-hidden">
//           <OptimizedImage
//             src={project.image}
//             alt={project.title}
//             fill
//             className="object-cover group-hover:scale-110 transition-transform duration-300"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//           {/* Overlay Icons */}
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="flex space-x-4">
//               <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
//                 <Eye className="w-4 h-4" />
//               </Button>
//               <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
//                 <Github className="w-4 h-4" />
//               </Button>
//               <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
//                 <ExternalLink className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Featured Badge */}
//           {project.featured && (
//             <div className="absolute top-4 left-4">
//               <Badge className="bg-primary-500 text-white">Featured</Badge>
//             </div>
//           )}
//         </div>

//         <CardContent className="p-6 space-y-4">
//           {/* Category */}
//           <Badge variant="outline" className="text-xs">
//             {project.category}
//           </Badge>

//           {/* Title */}
//           <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
//             {project.title}
//           </h3>

//           {/* Description */}
//           <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{project.shortDescription}</p>

//           {/* Technologies */}
//           <div className="flex flex-wrap gap-2">
//             {project.technologies.slice(0, 3).map((tech) => (
//               <Badge key={tech} variant="secondary" className="text-xs">
//                 {tech}
//               </Badge>
//             ))}
//             {project.technologies.length > 3 && (
//               <Badge variant="secondary" className="text-xs">
//                 +{project.technologies.length - 3}
//               </Badge>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   ),
// )

// ProjectCard.displayName = "ProjectCard"

// export default memo(function OptimizedProjectsSection() {
//   const [selectedProject, setSelectedProject] = useState<(typeof projectsData)[0] | null>(null)
//   const [showAll, setShowAll] = useState(false)

//   const displayedProjects = useMemo(() => {
//     return showAll ? projectsData : projectsData.slice(0, 6)
//   }, [showAll])

//   const sectionHeader = useMemo(
//     () => (
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         className="text-center mb-16"
//       >
//         <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//           My <span className="gradient-text">Projects</span>
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//           A showcase of my recent work and the technologies I've mastered
//         </p>
//       </motion.div>
//     ),
//     [],
//   )

//   return (
//     <OptimizedSection id="projects" className="py-20 bg-white dark:bg-dark-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {sectionHeader}

//         {/* Projects Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//           {displayedProjects.map((project, index) => (
//             <ProjectCard key={project.id} project={project} index={index} onSelect={setSelectedProject} />
//           ))}
//         </div>

//         {/* See All Projects Button */}
//         {!showAll && projectsData.length > 6 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-center"
//           >
//             <Button
//               onClick={() => setShowAll(true)}
//               size="lg"
//               className="bg-primary-500 hover:bg-primary-600 text-white"
//             >
//               See All Projects
//             </Button>
//           </motion.div>
//         )}

//         {/* Project Modal */}
//         <AnimatePresence>
//           {selectedProject && (
//             <Suspense fallback={<div>Loading...</div>}>
//               <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
//             </Suspense>
//           )}
//         </AnimatePresence>
//       </div>
//     </OptimizedSection>
//   )
// })
