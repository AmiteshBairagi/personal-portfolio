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
import {
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Award,
  ExternalLink,
  Upload,
  ImageIcon,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useCertificationsRealTime } from "@/hooks/use-certifications-real-time"
import type { CertificationItem } from "@/lib/data/certifications-data-manager"

const CertificationManager = () => {
  const {
    data: certificationsData,
    loading: isLoading,
    error,
    addCertification,
    updateCertification,
    deleteCertification,
    searchCertifications,
    refresh,
    clearError,
  } = useCertificationsRealTime()

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
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

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


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // In a real app, you would upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll simulate an upload and use a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate getting back a URL from the upload service
      const uploadedUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`

      setEditForm((prev) => ({ ...prev, image: uploadedUrl }))
    } catch (error) {
      console.error("Failed to upload image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let result
      if (isAdding) {
        result = await addCertification(editForm)
        if (result.success) {
          setIsAdding(false)
          alert("Certification added successfully!")
        }
      } else {
        result = await updateCertification(editForm.id, editForm)
        if (result.success) {
          setIsEditing(false)
          alert("Certification updated successfully!")
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
    const skills = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setEditForm((prev) => ({ ...prev, skills }))
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Certifications ({certificationsData.length})</h3>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={refresh}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 bg-transparent"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600" disabled={isLoading}>
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white">
              All Levels
            </SelectItem>
            <SelectItem value="Associate" className="text-white">
              Associate
            </SelectItem>
            <SelectItem value="Professional" className="text-white">
              Professional
            </SelectItem>
            <SelectItem value="Expert" className="text-white">
              Expert
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Filter by featured" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white">
              All Certifications
            </SelectItem>
            <SelectItem value="featured" className="text-white">
              Featured Only
            </SelectItem>
            <SelectItem value="not-featured" className="text-white">
              Not Featured
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">
            {filteredData.length} of {certificationsData.length}
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
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Certificate Image Preview */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    {item.image && item.image !== "/placeholder.svg?height=400&width=600" ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                      {item.featured && <Badge className="bg-purple-500/20 text-purple-300">Featured</Badge>}
                      <Badge className={`${getLevelColor(item.level)} text-white text-xs border-0`}>{item.level}</Badge>
                    </div>
                    <p className="text-cyan-400">{item.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Reorder buttons */}
                 
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div>
                    <span className="font-medium">Date:</span> {item.date}
                  </div>
                  <div>
                    <span className="font-medium">Valid Until:</span> {item.valid_until}
                  </div>
                  <div>
                    <span className="font-medium">Score:</span> {item.exam_score}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span> {item.credential_id}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(item.skills || []).map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-slate-600/50 text-slate-300">
                      {skill}
                    </Badge>
                  ))}
                </div>

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
            <Button onClick={handleCancel} variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-600"
              disabled={isLoading || isUploadingImage || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : isAdding ? "Add Certification" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-300 block">Certificate Image</label>
            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                  disabled={isUploadingImage}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
                <p className="text-xs text-slate-400 mt-1">Recommended: 600x400px, JPG or PNG</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Certification Title *</label>
              <Input
                value={editForm.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., AWS Certified Solutions Architect"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Issuing Organization *</label>
              <Input
                value={editForm.issuer}
                onChange={(e) => handleInputChange("issuer", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Amazon Web Services"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Issue Date *</label>
              <Input
                value={editForm.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 2024, March 2024"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Valid Until *</label>
              <Input
                value={editForm.valid_until}
                onChange={(e) => handleInputChange("valid_until", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 2027, Lifetime"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Credential ID *</label>
              <Input
                value={editForm.credential_id}
                onChange={(e) => handleInputChange("credential_id", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., AWS-SAA-2024-001"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Exam Score</label>
              <Input
                value={editForm.exam_score}
                onChange={(e) => handleInputChange("exam_score", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 892/1000, 85%"
              />
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Certification Level *</label>
            <Select
              value={editForm.level}
              onValueChange={(value: "Professional" | "Associate" | "Expert") => handleInputChange("level", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select certification level" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Associate" className="text-white">
                  Associate
                </SelectItem>
                <SelectItem value="Professional" className="text-white">
                  Professional
                </SelectItem>
                <SelectItem value="Expert" className="text-white">
                  Expert
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description *</label>
            <Textarea
              value={editForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Brief description of what this certification validates..."
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Skills Validated (comma-separated) *
            </label>
            <Textarea
              value={(editForm.skills || []).join(", ")}
              onChange={(e) => handleSkillsChange(e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="AWS, Cloud Architecture, Security, etc."
              required
            />
          </div>

          {/* Verification URL */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Verification URL *</label>
            <Input
              value={editForm.verification_url}
              onChange={(e) => handleInputChange("verification_url", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="https://verify.certification.com"
              type="url"
              required
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={editForm.featured}
              onChange={(e) => handleInputChange("featured", e.target.checked)}
              className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-300">
              Featured Certification (Display prominently on the website)
            </label>
          </div>
        </div>
      </EnhancedModal>
    </div>
  )
}


export default CertificationManager
