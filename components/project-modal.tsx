// "use client"

// import { memo } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ExternalLink, Github, Calendar, Users, Code } from "lucide-react"
// import OptimizedImage from "@/components/optimized-image"

// interface ProjectModalProps {
//   project: {
//     id: number
//     title: string
//     description: string
//     image: string
//     technologies: string[]
//     githubUrl: string
//     liveUrl: string
//     category: string
//   }
//   onClose: () => void
// }

// export default memo(function ProjectModal({ project, onClose }: ProjectModalProps) {
//   return (
//     <Dialog open={!!project} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-800">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold gradient-text">{project.title}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Project Image */}
//           <div className="relative h-64 rounded-lg overflow-hidden">
//             <OptimizedImage
//               src={project.image}
//               alt={project.title}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 80vw"
//             />
//           </div>

//           {/* Project Info Grid */}
//           <div className="grid md:grid-cols-3 gap-4 text-sm">
//             <div className="flex items-center space-x-2">
//               <Calendar className="w-4 h-4 text-primary-500" />
//               <span className="text-gray-600 dark:text-gray-300">Duration: 3 months</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Users className="w-4 h-4 text-primary-500" />
//               <span className="text-gray-600 dark:text-gray-300">Team: Solo Project</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Code className="w-4 h-4 text-primary-500" />
//               <span className="text-gray-600 dark:text-gray-300">Category: {project.category}</span>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
//             <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
//           </div>

//           {/* Technologies */}
//           <div>
//             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technologies Used</h4>
//             <div className="flex flex-wrap gap-2">
//               {project.technologies.map((tech) => (
//                 <Badge key={tech} className="bg-primary-500/10 text-primary-600 dark:text-primary-400">
//                   {tech}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-4 pt-4">
//             <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
//               <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
//                 <ExternalLink className="w-4 h-4 mr-2" />
//                 Live Demo
//               </a>
//             </Button>
//             <Button asChild variant="outline">
//               <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
//                 <Github className="w-4 h-4 mr-2" />
//                 View Code
//               </a>
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// })
