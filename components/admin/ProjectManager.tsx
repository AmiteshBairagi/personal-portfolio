"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useProjectsData } from "@/hooks/use-projects-data"
import { useCategoriesData } from "@/hooks/use-categories-data"
import type { ProjectData } from "@/lib/data/projects-data"
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
  } = useProjectsData()

  const { getActiveCategories, getCategoryByName } = useCategoriesData()

  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<ProjectData | null>(null)
  // const [techInput, setTechInput] = useState("")
  // const [keyFeaturesInput, setKeyFeaturesInput] = useState("");

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
      // featured: false,
      duration: "",
      // teamSize: "",
      image: "",
      details: {
        problem: "",
        solution: "",
        challenges: "",
        technologies: [],
        duration: "",
        // teamSize: "",
        features: [],
      },
      // published: true,
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
        // teamSize: item.teamSize || "",
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
      // handleTechnologiesInput();
      // handleKeyFeaturesInput();
      if (!editForm.title?.trim()) {
        toast.error("Project title is required")
        return
      }
      if (!editForm.category?.trim()) {
        toast.error("Project category is required")
        return
      }

      const projectData: Partial<ProjectData> = {
        ...editForm,
        details: {
          problem: editForm.details?.problem || "",
          solution: editForm.details?.solution || "",
          challenges: editForm.details?.challenges || "",
          technologies: editForm.technologies || [],
          duration: editForm.duration || "",
          // teamSize: editForm.teamSize || "",
          features: editForm.details?.features || [],
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
      // featured: false,
      duration: "",
      // teamSize: "",
      image: "",
      details: {
        problem: "",
        solution: "",
        challenges: "",
        technologies: [],
        duration: "",
        // teamSize: "",
        features: [],
      },
      // published: true,
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
      const array = value
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean)
      setEditForm((prev) => ({
        ...prev,
        details: {
          ...prev.details!,
          features: array,
        },
      }))
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayInputChange = (field: "technologies", value: string) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setEditForm((prev) => ({ ...prev, [field]: array }))

    // const technologiesArray = techInput
    //   .split(",")
    //   .map((t) => t.trim())
    //   .filter(Boolean)

    // setEditForm((prev) => ({ ...prev, technologies: technologiesArray }))
  }


  // const handleKeyFeaturesInput = () => {
  //   // const array = value
  //   //   .split(",")
  //   //   .map((item) => item.trim())
  //   //   .filter(Boolean)
  //   // setEditForm((prev) => ({ ...prev, [field]: array }))

  //   const keyFeatures = keyFeaturesInput
  //     .split(",")
  //     .map((t) => t.trim())
  //     .filter(Boolean)

  //   setEditForm((prev) => ({ ...prev, features: keyFeatures }))
  // }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading projects data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <p className="text-red-400">Error loading projects: {error}</p>
          <Button onClick={refresh} className="bg-cyan-500 hover:bg-cyan-600">
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
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Projects ({projectsData.length})</h3>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refresh} variant="outline" className="border-slate-600 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600">
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
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        {category ? (
                          <>
                            <span>{category.icon}</span>
                            <span className="text-sm" style={{ color: category.color }}>
                              {item.category}
                            </span>
                          </>
                        ) : (
                          <span className="text-cyan-400">{item.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* <Button    
                      onClick={() => handleReorder(item.id, "up")}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(item.id, "down")}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                      disabled={index === projectsData.length - 1}
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button> */}

                    <Button   // Edit Button
                      onClick={() => handleEdit(item)}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                      title="Edit project"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button   // Delete Button
                      onClick={() => handleDelete(item.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                  </div>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* Project Image */}
                  {item.image && (
                    <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.short_description || item.short_description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center space-x-1"
                        style={{ borderColor: category.color, color: category.color }}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Badge>
                    )}
                    {item.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-slate-600/50 text-slate-300 text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {item.technologies.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-600/50 text-slate-300 text-xs">
                        +{item.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>Duration: {item.duration}</span>
                  </div>

                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="border-slate-600 bg-transparent" asChild>
                      <a href={item.github_url || item.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 bg-transparent" asChild>
                      <a href={item.live_url || item.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
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
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              {isAdding ? "Add Project" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Project Title *</label>
              <Input
                value={editForm.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="e.g., E-Commerce Platform"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Category *</label>
              <select
                value={editForm.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                required
              >
                <option value="">Select a category</option>
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Duration</label>
              <Input
                value={editForm.duration || ""}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="e.g., 3 months"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">GitHub URL</label>
              <Input
                value={editForm.github_url || ""}
                onChange={(e) => handleInputChange("github_url", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Live URL</label>
              <Input
                value={editForm.live_url || ""}
                onChange={(e) => handleInputChange("live_url", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="https://project-demo.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Short Description *</label>
            <Input
              value={editForm.short_description || ""}
              onChange={(e) => handleInputChange("short_description", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Brief one-line description for cards"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Full Description *</label>
            <Textarea
              value={editForm.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="Detailed project description"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Problem Statement</label>
            <Textarea
              value={editForm.details?.problem || ""}
              onChange={(e) => handleInputChange("problem", e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="What problem does this project solve?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Solution</label>
            <Textarea
              value={editForm.details?.solution || ""}
              onChange={(e) => handleInputChange("solution", e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="How does this project solve the problem?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Challenges</label>
            <Textarea
              value={editForm.technologies?.join(", ") || ""}
              onChange={(e) => handleArrayInputChange("technologies", e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="React, Node.js, MongoDB, etc."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Technologies (comma-separated) *</label>
            <Textarea
              value={editForm.technologies?.join(", ") || ""}
              onChange={(e) => handleInputChange("technologies", e.target.value)}
              // value={techInput}
              // onChange={(e) => setTechInput(e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="React, Node.js, MongoDB, etc."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Key Features (comma-separated)</label>
            <Textarea
              value={editForm.details?.features?.join(", ") || ""}
              onChange={(e) => handleInputChange("features", e.target.value)}
              // value={keyFeaturesInput}
              // onChange={(e) => setKeyFeaturesInput(e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="Real-time updates, User authentication, etc."
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Project Image</label>

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Project preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 bg-transparent"
                  onClick={() => document.getElementById("project-image-upload")?.click()}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 transition-colors"
                onClick={() => document.getElementById("project-image-upload")?.click()}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto">
                    <Plus className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-400">Click to upload project image</p>
                  <p className="text-xs text-slate-500">JPG or PNG, max 10MB</p>
                </div>
              </div>
            )}

            <input
              id="project-image-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              className="hidden"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={editForm.featured || false}
                onChange={(e) => handleInputChange("featured", e.target.checked)}
                className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
              />
              <label htmlFor="featured" className="text-sm font-medium text-slate-300">
                Featured Project
              </label>
            </div>

          </div>
        </div>
      </EnhancedModal>
    </div>
  )
}

export default ProjectManager
