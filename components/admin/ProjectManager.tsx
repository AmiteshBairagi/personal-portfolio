"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useProjects } from "@/hooks/useProjects"
import { useCategories } from "@/hooks/useCategories"
import type { ProjectData } from "@/lib/data/projectsService"
import { ProjectForm } from "./forms/ProjectForm"
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Briefcase,
  ExternalLink,
  Github,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

const ProjectManager = () => {
  const {
    data: projectsData,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    refresh,
    refetch
  } = useProjects()

  const { getActiveCategories, getCategoryByName } = useCategories()

  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null)

  const [editForm, setEditForm] = useState<Partial<ProjectData>>({
    title: "",
    description: "",
    short_description: "",
    technologies: [],
    github_url: "",
    live_url: "",
    category: "",
    featured: false,
    duration: "",
    image: "",
    details: {
      problem: "",
      solution: "",
      challenges: "",
      technologies: [],
      duration: "",
      features: [],
    },
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleImageUpload = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 10 * 1024 * 1024) {
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreview(result)
          handleInputChange("image", result)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error("Image size should be less than 10MB")
      }
    } else {
      toast.error("Please select a valid image file (JPG or PNG)")
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview("")
    handleInputChange("image", "")
  }

  const handleAdd = () => {
    setEditForm({
      title: "",
      description: "",
      short_description: "",
      technologies: [],
      github_url: "",
      live_url: "",
      category: "",
      duration: "",
      image: "",
      details: {
        problem: "",
        solution: "",
        challenges: "",
        technologies: [],
        duration: "",
        features: [],
      },
    })
    setImagePreview("")
    setImageFile(null)
    setIsAdding(true)
  }

  const handleEdit = (item: ProjectData) => {
    setEditForm({
      ...item,
      details: {
        problem: item.details?.problem || "",
        solution: item.details?.solution || "",
        challenges: item.details?.challenges || "",
        technologies: item.technologies || [],
        duration: item.duration || "",
        features: item.details?.features || [],
      },
    })
    setEditingItem(item)
    setIsEditing(true)
    if (item.image) {
      setImagePreview(item.image)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(id)
        toast.success("Project deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete project. Please try again.")
      }
    }
  }

  const handleSave = async () => {
    try {
      if (!editForm.title?.trim()) {
        toast.error("Project title is required")
        return
      }
      if (!editForm.category?.trim()) {
        toast.error("Project category is required")
        return
      }

      const cleanedTechnologies = editForm.technologies ? editForm.technologies.map(t => t.trim()).filter(Boolean) : []
      const projectData: Partial<ProjectData> = {
        ...editForm,
        technologies: cleanedTechnologies,
        details: {
          problem: editForm.details?.problem || "",
          solution: editForm.details?.solution || "",
          challenges: editForm.details?.challenges || "",
          technologies: cleanedTechnologies,
          duration: editForm.duration || "",
          features: editForm.details?.features ? editForm.details.features.map((f: string) => f.trim()).filter(Boolean) : [],
        },
      }

      if (isAdding) {
        await addProject(projectData as Omit<ProjectData, "id">)
        toast.success("Project added successfully!")
        setIsAdding(false)
      } else if (editingItem) {
        await updateProject(editingItem.id, projectData)
        toast.success("Project updated successfully!")
        setIsEditing(false)
      }
      resetForm()
    } catch (error) {
      toast.error("Failed to save project. Please try again.")
    }
  }

  const resetForm = () => {
    setEditForm({
      title: "",
      description: "",
      short_description: "",
      technologies: [],
      github_url: "",
      live_url: "",
      category: "",
      duration: "",
      image: "",
      details: {
        problem: "",
        solution: "",
        challenges: "",
        technologies: [],
        duration: "",
        features: [],
      },
    })
    setEditingItem(null)
    setImageFile(null)
    setImagePreview("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    resetForm()
  }

  const handleInputChange = (
    field: keyof ProjectData | "problem" | "solution" | "challenges" | "features",
    value: any,
  ) => {
    if (field === "problem" || field === "solution" || field === "challenges") {
      setEditForm((prev) => ({
        ...prev,
        details: {
          ...prev.details!,
          [field]: value,
        },
      }))
    } else if (field === "features") {
      setEditForm((prev) => ({
        ...prev,
        details: {
          ...prev.details!,
          features: value.split(","),
        },
      }))
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayInputChange = (field: "technologies", value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value.split(",") }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <p className="text-slate-400 font-medium">Loading projects data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4 bg-slate-800/40 backdrop-blur-md border border-red-500/20 p-6 rounded-xl shadow-lg">
          <p className="text-red-400 font-medium">Error loading projects: {error}</p>
          <Button onClick={refresh} className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/25 border-0">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const activeCategories = getActiveCategories()

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex justify-between items-center bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Projects <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">{projectsData.length}</Badge>
          </h3>
        </div>
        <div className="flex space-x-3">
          <Button onClick={refresh} variant="outline" className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid gap-4">
        {projectsData.map((item, index) => {
          const category = getCategoryByName(item.category)
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <Briefcase className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {category ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/50 border" style={{ borderColor: `${category.color}40` }}>
                            <span className="text-xs">{category.icon}</span>
                            <span className="text-xs font-medium" style={{ color: category.color }}>
                              {item.category}
                            </span>
                          </div>
                        ) : (
                          <Badge className="bg-slate-900/50 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button   // Edit Button
                      onClick={() => handleEdit(item)}
                      size="sm"
                      variant="outline"
                      className="bg-slate-800/50 border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-all h-8 w-8 p-0"
                      title="Edit project"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button   // Delete Button
                      onClick={() => handleDelete(item.id)}
                      size="sm"
                      variant="outline"
                      className="bg-slate-800/50 border border-red-900/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all h-8 w-8 p-0"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-4">

                  {/* Project Image */}
                  {item.image && (
                    <div className="w-full h-40 bg-slate-900/50 rounded-xl overflow-hidden mb-3 border border-slate-700/50 relative group/image">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.short_description || item.short_description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center space-x-1 border"
                        style={{ borderColor: `${category.color}40`, color: category.color, backgroundColor: `${category.color}10` }}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </Badge>
                    )}
                    {item.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {item.technologies.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                        +{item.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-400 bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-cyan-500/70" /> Duration: <span className="text-slate-300">{item.duration}</span></span>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all shadow-sm" asChild>
                      <a href={item.github_url || item.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-all shadow-sm" asChild>
                      <a href={item.live_url || item.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>



      {/* Add/Edit Modal */}
      <EnhancedModal
        isOpen={isEditing || isAdding}
        onClose={handleCancel}
        title={isAdding ? "Add New Project" : "Edit Project"}
        size="xl"
        footerActions={
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
              <Save className="w-4 h-4 mr-2" />
              {isAdding ? "Add Project" : "Save Changes"}
            </Button>
          </>
        }
      >
        <ProjectForm
          editForm={editForm}
          activeCategories={activeCategories}
          imagePreview={imagePreview}
          handleInputChange={handleInputChange}
          handleArrayInputChange={handleArrayInputChange}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
        />
      </EnhancedModal>
    </div>
  )
}

export default ProjectManager
