"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { CertificationForm } from "./forms/CertificationForm"
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Award,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react"
import useCertifications from "@/hooks/useCertifications"
import type { CertificationItem } from "@/lib/data/certificationService"
import { toast } from "sonner"

const CertificationManager = () => {
  const {
    data: certificationsData,
    loading: isLoading,
    error,
    addCertification,
    updateCertification,
    deleteCertification,
    refresh,
    clearError,
  } = useCertifications()

  // Modal states
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null)
  const [editForm, setEditForm] = useState<CertificationItem>({
    id: "",
    title: "",
    issuer: "",
    date: "",
    credential_id: "",
    image: "",
    description: "",
    skills: [],
    verification_url: "",
    featured: false,
    valid_until: "",
    level: "Professional",
    exam_score: "",
    display_order: 0,
  })

  // UI states
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")

  // Filter data based on search and filters
  const filteredData = certificationsData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLevel = levelFilter === "all" || item.level === levelFilter
    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && item.featured) ||
      (featuredFilter === "not-featured" && !item.featured)

    return matchesSearch && matchesLevel && matchesFeatured
  })

  const handleAdd = () => {
    const nextOrder = Math.max(...certificationsData.map((item) => item.display_order), 0) + 1
    setEditForm({
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      credential_id: "",
      image: "/placeholder.svg?height=400&width=600",
      description: "",
      skills: [],
      verification_url: "",
      featured: false,
      valid_until: "",
      level: "Professional",
      exam_score: "",
      display_order: nextOrder,
    })
    setImagePreview("")
    setIsAdding(true)
  }

  const handleEdit = (item: CertificationItem) => {
    setEditForm(item)
    setEditingItem(item)
    setImagePreview(item.image)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      const result = await deleteCertification(id)
      if (result.success) {
        alert("Certification deleted successfully!")
      } else {
        alert(`Failed to delete certification: ${result.error}`)
      }
    }
  }

  const handleImageUpload = (file: File) => {
    if (file) {
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const skillsArray = typeof editForm.skills === "string" 
        ? (editForm.skills as string).split(",").map(s => s.trim()).filter(Boolean)
        : editForm.skills.map(s => s.trim()).filter(Boolean)

      const cleanedForm = {
        ...editForm,
        image: imageFile ? "" : imagePreview,
        skills: skillsArray
      }

      let result
      if (isAdding) {
        result = await addCertification(cleanedForm, imageFile || undefined)
        if (result.success) {
          setIsAdding(false)
          toast.success("Certification added successfully!")
        }
      } else {
        result = await updateCertification(cleanedForm.id, cleanedForm, imageFile || undefined)
        if (result.success) {
          setIsEditing(false)
          toast.success("Certification updated successfully!")
        }
      }

      if (result.success) {
        resetForm()
      } else {
        alert(`Failed to save certification: ${result.error}`)
      }
    } catch (error) {
      console.error("Failed to save certification:", error)
      alert("Failed to save certification. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setEditForm({
      id: "",
      title: "",
      issuer: "",
      date: "",
      credential_id: "",
      image: "",
      description: "",
      skills: [],
      verification_url: "",
      featured: false,
      valid_until: "",
      level: "Professional",
      exam_score: "",
      display_order: 0,
    })
    setEditingItem(null)
    setImagePreview("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    resetForm()
  }

  const handleInputChange = (field: keyof CertificationItem, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillsChange = (value: string) => {
    setEditForm((prev) => ({ ...prev, skills: value.split(",") }))
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Professional":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "Associate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "Expert":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            Certifications <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">{certificationsData.length}</Badge>
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={refresh}
            variant="outline"
            className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0" disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-400">{error}</p>
            <Button onClick={clearError} size="sm" variant="ghost" className="text-red-400">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
          <Input
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white placeholder:text-slate-500"
          />
        </div>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="bg-slate-900/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Associate">Associate</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="bg-slate-900/50 border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-white">
            <SelectValue placeholder="Filter by featured" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">All Certifications</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
            <SelectItem value="not-featured">Not Featured</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-center space-x-2 text-slate-400 bg-slate-900/30 rounded-lg border border-slate-800">
          <Filter className="w-4 h-4 text-cyan-500/70" />
          <span className="text-sm font-medium">
            Showing <span className="text-slate-300">{filteredData.length}</span> of <span className="text-slate-300">{certificationsData.length}</span>
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && certificationsData.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <p className="text-slate-400 mt-2">Loading certifications...</p>
        </div>
      )}

      {/* Certifications List */}
      <div className="grid gap-4">
        {filteredData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 shadow-lg group">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/50 pb-4">
                <div className="flex items-center space-x-4">
                  {/* Certificate Image Preview */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-transform duration-300">
                    {item.image && item.image !== "/placeholder.svg?height=400&width=600" ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="w-7 h-7 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">{item.title}</CardTitle>
                      {item.featured && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Featured</Badge>}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-slate-300 font-medium text-sm">{item.issuer}</p>
                      <span className="text-slate-600">•</span>
                      <Badge className={`${getLevelColor(item.level)} text-white text-[10px] px-2 py-0 uppercase tracking-wider font-semibold border-0 shadow-sm`}>{item.level}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {/* Reorder buttons */}

                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="bg-slate-800/50 border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-all h-8 w-8 p-0"
                    disabled={isLoading}
                    title="Edit certification"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="bg-slate-800/50 border border-red-900/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all h-8 w-8 p-0"
                    disabled={isLoading}
                    title="Delete certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Date</span>
                    <span className="text-slate-300">{item.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Valid Until</span>
                    <span className="text-slate-300">{item.valid_until || "No Expiry"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Score</span>
                    <span className="text-slate-300">{item.exam_score || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Credential ID</span>
                    <span className="text-slate-300 font-mono text-xs">{item.credential_id || "N/A"}</span>
                  </div>
                </div>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-slate-800 border border-slate-700 text-slate-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button size="sm" variant="outline" className="border-slate-600 bg-transparent" asChild>
                  <a href={item.verification_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Verify Certificate
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            {searchQuery || levelFilter !== "all" || featuredFilter !== "all"
              ? "No certifications match your filters"
              : "No certifications found"}
          </h3>
          <p className="text-slate-400 mb-4">
            {searchQuery || levelFilter !== "all" || featuredFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first certification to get started"}
          </p>
          {!searchQuery && levelFilter === "all" && featuredFilter === "all" && (
            <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add First Certification
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <EnhancedModal
        isOpen={isEditing || isAdding}
        onClose={handleCancel}
        title={isAdding ? "Add New Certification" : "Edit Certification"}
        size="xl"
        footerActions={
          <>
            <Button onClick={handleCancel} variant="outline" className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0"
              disabled={isLoading || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : isAdding ? "Add Certification" : "Save Changes"}
            </Button>
          </>
        }
      >
        <CertificationForm
          editForm={editForm}
          imagePreview={imagePreview}
          handleInputChange={handleInputChange}
          handleSkillsChange={handleSkillsChange}
          handleImageUpload={handleImageUpload}
        />
      </EnhancedModal>
    </div>
  )
}


export default CertificationManager
