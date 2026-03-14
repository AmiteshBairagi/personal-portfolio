"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useSkills } from "@/hooks/useSkills"
import { SkillForm } from "./forms/SkillForm"
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

    const cleanedForm = {
      ...editForm,
      projects: editForm.projects ? editForm.projects.map(p => p.trim()).filter(Boolean) : []
    }

    if (isAdding) {
      const result = await addSkill(cleanedForm as Omit<SkillItem, "created_at" | "updated_at">)
      if (result.success) {
        setSuccessMessage("Skill added successfully!")
        setIsAdding(false)
        resetForm()
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } else if (editingItem) {
      const result = await updateSkill(editingItem.id, cleanedForm)
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
    setEditForm((prev) => ({ ...prev, projects: value.split(",") }))
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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <span className="text-slate-400 font-medium pt-2">Loading skills data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Skills <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">{getActiveSkills()}/{getTotalSkills()} Active</Badge>
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAdd} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0" disabled={isSaving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 inline-flex">
        <Button
          onClick={() => setSelectedCategory("All")}
          variant={selectedCategory === "All" ? "default" : "ghost"}
          size="sm"
          className={selectedCategory === "All" ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 hover:text-cyan-200" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}
        >
          All ({allSkills.length})
        </Button>
        {availableCategories.map((category) => {
          const count = allSkills.filter((s) => s.category === category).length
          return (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              className={selectedCategory === category ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 hover:text-cyan-200" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}
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
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="bg-slate-900/20 p-6 rounded-xl border border-slate-800/50">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Code className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold text-white">
                {category} <span className="text-slate-500 text-sm font-normal ml-1">({skills.length})</span>
              </h4>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-slate-800/40 backdrop-blur-md border hover:bg-slate-800/60 transition-all duration-300 shadow-lg group h-full flex flex-col pt-2 ${!item.is_active ? "border-slate-700/30 opacity-60" : "border-slate-700/50"}`}>
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex flex-col space-y-2">
                        <CardTitle className="text-lg text-white flex flex-wrap items-center gap-2 group-hover:text-cyan-400 transition-colors">
                          <span>{item.name}</span>
                          {!item.is_active && (
                            <Badge variant="outline" className="text-[10px] bg-slate-900 border-slate-700 text-slate-500 uppercase px-1.5 font-semibold">Hidden</Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-1.5 pt-1">
                          <Badge className="bg-slate-900/50 text-slate-300 border-slate-700 hover:bg-slate-800 text-xs font-medium">Lv. {item.level}</Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><Code className="w-3 h-3" /> {item.experience}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">                        
                        <Button
                          onClick={() => handleEdit(item)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                          disabled={isSaving}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2 mt-auto">
                      <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800">
                        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Used in {item.projects?.length || 0} projects:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.projects?.map((project) => (
                            <span
                              key={project}
                              className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded transition-colors hover:border-cyan-500/50 hover:text-cyan-300"
                            >
                              {project}
                            </span>
                          )) || <span className="text-slate-600 text-[11px] italic">No projects listed</span>}
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
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : isAdding ? "Add Skill" : "Save Changes"}
            </Button>
          </>
        }
      >
        <SkillForm
          editForm={editForm}
          handleInputChange={handleInputChange}
          handleProjectsChange={handleProjectsChange}
        />
      </EnhancedModal>
    </div>
  )
}

export default SkillsManager
