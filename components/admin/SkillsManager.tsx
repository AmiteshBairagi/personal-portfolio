"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useSkills } from "@/hooks/useSkills"
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Code,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { SkillItem } from "@/lib/data/skillsService"

const SkillsManager = () => {
  const {
    allSkills,
    isLoading,
    isSaving,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    getCategories,
  } = useSkills()

  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null)
  const [editForm, setEditForm] = useState<Partial<SkillItem>>({
    id: "",
    name: "",
    level: 0,
    projects: [],
    experience: "",
    category: "Frontend",
    is_active: true,
  })
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showInactive, setShowInactive] = useState(false)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const categories = await getCategories()
      setAvailableCategories(categories)
    }
    loadCategories()
  }, [getCategories])

  // Filter skills based on selected category and active status
  const filteredSkills = allSkills.filter((skill) => {
    const categoryMatch = selectedCategory === "All" || skill.category === selectedCategory
    const activeMatch = showInactive || skill.is_active !== false
    return categoryMatch && activeMatch
  })

  // Group skills by category
  const groupedSkills = filteredSkills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, SkillItem[]>,
  )

  const handleAdd = () => {
    setEditForm({
      id: `skill_${Date.now()}`,
      name: "",
      level: 0,
      projects: [],
      experience: "",
      category: "Frontend",
      is_active: true,
    })
    setIsAdding(true)
  }

  const handleEdit = (item: SkillItem) => {
    setEditForm({ ...item })
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const result = await deleteSkill(id)
      if (result.success) {
        setSuccessMessage("Skill deleted successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    }
  }

  const handleSave = async () => {
    if (!editForm.name || !editForm.category || editForm.level === undefined) {
      alert("Please fill in all required fields")
      return
    }

    if (isAdding) {
      const result = await addSkill(editForm as Omit<SkillItem, "created_at" | "updated_at">)
      if (result.success) {
        setSuccessMessage("Skill added successfully!")
        setIsAdding(false)
        resetForm()
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } else if (editingItem) {
      const result = await updateSkill(editingItem.id, editForm)
      if (result.success) {
        setSuccessMessage("Skill updated successfully!")
        setIsEditing(false)
        resetForm()
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    }
  }

  const resetForm = () => {
    setEditForm({
      id: "",
      name: "",
      level: 0,
      projects: [],
      experience: "",
      category: "Frontend",
      is_active: true,
    })
    setEditingItem(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    resetForm()
  }

  const handleInputChange = (field: keyof SkillItem, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProjectsChange = (value: string) => {
    const projects = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setEditForm((prev) => ({ ...prev, projects }))
  }

  const getTotalSkills = () => {
    return allSkills.length
  }

  const getActiveSkills = () => {
    return allSkills.filter((skill) => skill.is_active !== false).length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading skills data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-white">
              Skills ({getActiveSkills()}/{getTotalSkills()})
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600" disabled={isSaving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedCategory("All")}
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          className={selectedCategory === "All" ? "bg-cyan-500" : "border-slate-600"}
        >
          All ({allSkills.length})
        </Button>
        {availableCategories.map((category) => {
          const count = allSkills.filter((s) => s.category === category).length
          return (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={selectedCategory === category ? "bg-cyan-500" : "border-slate-600"}
            >
              {category} ({count})
            </Button>
          )
        })}
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg p-3"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">{successMessage}</span>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category}>
            <h4 className="text-lg font-semibold text-cyan-400 mb-4">
              {category} ({skills.length})
            </h4>
            <div className="grid gap-4">
              {skills.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-slate-700/30 border-slate-600/30 ${!item.is_active ? "opacity-50" : ""}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white flex items-center space-x-2">
                            <span>{item.name}</span>
                            {!item.is_active && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Hidden</span>
                            )}
                          </CardTitle>
                          <p className="text-cyan-400">{item.experience} experience</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEdit(item)}
                            size="sm"
                            variant="outline"
                            className="border-slate-600"
                            disabled={isSaving}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600"
                            disabled={isSaving}
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Used in {item.projects?.length || 0} projects:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.projects?.map((project) => (
                            <span
                              key={project}
                              className="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded-full"
                            >
                              {project}
                            </span>
                          )) || <span className="text-slate-500 text-xs">No projects listed</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <EnhancedModal
        isOpen={isEditing || isAdding}
        onClose={handleCancel}
        title={isAdding ? "Add New Skill" : "Edit Skill"}
        size="lg"
        footerActions={
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : isAdding ? "Add Skill" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Skill Name *</label>
              <Input
                value={editForm.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., React, Node.js, Python"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Category *</label>
              <select
                value={editForm.category || "Frontend"}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                required
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools & Others">Tools & Others</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Experience *</label>
              <Input
                value={editForm.experience || ""}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 2+ years, 6 months"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Projects (comma-separated)</label>
            <Textarea
              value={editForm.projects?.join(", ") || ""}
              onChange={(e) => handleProjectsChange(e.target.value)}
              rows={3}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="E-Commerce Platform, Task Manager, Portfolio Website"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={editForm.is_active !== false}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="rounded border-slate-600"
            />
            <label htmlFor="is_active" className="text-sm text-slate-300">
              Show on frontend
            </label>
          </div>
        </div>
      </EnhancedModal>
    </div>
  )
}

export default SkillsManager
