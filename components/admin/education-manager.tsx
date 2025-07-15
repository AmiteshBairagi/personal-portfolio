"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useEducationData } from "@/hooks/use-education-data"
import type { EducationItem } from "@/lib/data/education-data"
import { Edit, Trash2, Plus, Save, X, GraduationCap, Upload, ImageIcon, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function EducationManager() {
  const {
    data: educationData,
    loading,
    error,
    addEducation,
    updateEducation,
    deleteEducation,
    reorderEducation,
  } = useEducationData()
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null)
  const [editForm, setEditForm] = useState<Partial<EducationItem>>({
    degree: "",
    institution: "",
    duration: "",
    grade: "",
    description: "",
    type: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    setEditForm({
      degree: "",
      institution: "",
      duration: "",
      grade: "",
      description: "",
      type: "",
      image: "",
    })
    setImagePreview("")
    setImageFile(null)
    setEditingItem(null)
    setIsAdding(true)
  }

  const handleEdit = (item: EducationItem) => {
    setEditForm({
      degree: item.degree,
      institution: item.institution,
      duration: item.duration,
      grade: item.grade,
      description: item.description,
      type: item.type,
      image: item.image,
    })
    setEditingItem(item)
    setImagePreview(item.image || "")
    setImageFile(null)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      try {
        await deleteEducation(id)
        toast.success("Education entry deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete education entry")
      }
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const items = [...educationData]
    const currentItem = items[index]
    const previousItem = items[index - 1]

    const reorderData = [
      { id: currentItem.id, display_order: previousItem.display_order || 0 },
      { id: previousItem.id, display_order: currentItem.display_order || 0 },
    ]

    try {
      await reorderEducation(reorderData)
      toast.success("Education order updated!")
    } catch (error) {
      toast.error("Failed to reorder education items")
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === educationData.length - 1) return

    const items = [...educationData]
    const currentItem = items[index]
    const nextItem = items[index + 1]

    const reorderData = [
      { id: currentItem.id, display_order: nextItem.display_order || 0 },
      { id: nextItem.id, display_order: currentItem.display_order || 0 },
    ]

    try {
      await reorderEducation(reorderData)
      toast.success("Education order updated!")
    } catch (error) {
      toast.error("Failed to reorder education items")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      toast.success("Image selected successfully!")
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
    setEditForm((prev) => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("Image removed")
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!editForm.degree || !editForm.institution || !editForm.duration) {
        toast.error("Please fill in all required fields (Degree, Institution, Duration)")
        return
      }

      let imageUrl = editForm.image || ""

      // Handle image upload
      if (imageFile) {
        // In a real application, you would upload to a cloud service
        // For now, we'll create a blob URL for demonstration
        imageUrl = URL.createObjectURL(imageFile)
        toast.success("Image uploaded successfully!")
      }

      const formData = {
        ...editForm,
        image: imageUrl,
        degree: editForm.degree!,
        institution: editForm.institution!,
        duration: editForm.duration!,
        grade: editForm.grade || "",
        description: editForm.description || "",
        type: editForm.type || "",
      }

      if (isAdding) {
        await addEducation(formData)
        toast.success("Education entry added successfully!")
        setIsAdding(false)
      } else if (editingItem) {
        await updateEducation(editingItem.id, formData)
        toast.success("Education entry updated successfully!")
        setIsEditing(false)
      }

      resetForm()
    } catch (error) {
      toast.error("Failed to save education entry")
      console.error("Save error:", error)
    }
  }

  const resetForm = () => {
    setEditForm({
      degree: "",
      institution: "",
      duration: "",
      grade: "",
      description: "",
      type: "",
      image: "",
    })
    setEditingItem(null)
    setImagePreview("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    resetForm()
  }

  const handleInputChange = (field: keyof EducationItem, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Education Entries ({educationData.length})</h3>
        <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      <div className="grid gap-4">
        {educationData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.institution}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{item.degree}</CardTitle>
                    <p className="text-cyan-400">{item.institution}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleMoveUp(index)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleMoveDown(index)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                    disabled={index === educationData.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleEdit(item)} size="sm" variant="outline" className="border-slate-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.duration}</span>
                  {item.grade && <span className="text-slate-300">{item.grade}</span>}
                </div>
                {item.description && <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>}
                <div className="flex justify-between items-center">
                  {item.type && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">{item.type}</span>
                  )}
                  {item.image && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Image Added
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <EnhancedModal
        isOpen={isEditing || isAdding}
        onClose={handleCancel}
        title={isAdding ? "Add New Education" : "Edit Education"}
        size="xl"
        footerActions={
          <>
            <Button onClick={handleCancel} variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
              <Save className="w-4 h-4 mr-2" />
              {isAdding ? "Add Education" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-300 block">Institution Image</label>

            {/* Image Preview */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-600 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      onClick={handleRemoveImage}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-400">Recommended: 400x300px, JPG or PNG, max 5MB</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Degree/Course <span className="text-red-400">*</span>
              </label>
              <Input
                value={editForm.degree || ""}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., Bachelor of Computer Science"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Institution <span className="text-red-400">*</span>
              </label>
              <Input
                value={editForm.institution || ""}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., University Name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Duration <span className="text-red-400">*</span>
              </label>
              <Input
                value={editForm.duration || ""}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 2020 - 2024"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Grade/Score</label>
              <Input
                value={editForm.grade || ""}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., CGPA: 8.5/10"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Type</label>
              <select
                value={editForm.type || ""}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="Masters">Masters</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Secondary">Secondary</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
            <Textarea
              value={editForm.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Describe your educational experience, achievements, and key learnings..."
            />
          </div>
        </div>
      </EnhancedModal>
    </div>
  )
}
