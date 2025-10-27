"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useCategoriesData } from "@/hooks/use-categories-data"
import type { CategoryData } from "@/lib/data/categories-data-manager"
import { Edit, Trash2, Plus, Save, X, ArrowUp, ArrowDown, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const colorOptions = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5A2B", // Brown
  "#6B7280", // Gray
]

const iconOptions = [
  "🚀",
  "🎨",
  "⚙️",
  "📱",
  "🌐",
  "🤖",
  "📊",
  "📈",
  "👥",
  "💻",
  "🔧",
  "🎯",
  "💡",
  "🔥",
  "⭐",
  "🎪",
  "🎭",
  "🎵",
  "🎮",
  "📚",
]

const CategoryManager = () => {
  const {
    data: categoriesData,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch,
  } = useCategoriesData()

  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<CategoryData | null>(null)

  const [editForm, setEditForm] = useState<Partial<CategoryData>>({
    name: "",
    description: "",
    color: colorOptions[0],
    icon: iconOptions[0],
    order: 1,
    active: true,
  })

  const handleAdd = () => {
    const maxOrder = Math.max(...categoriesData.map((cat) => cat.order), 0)
    setEditForm({
      name: "",
      description: "",
      color: colorOptions[0],
      icon: iconOptions[0],
      order: maxOrder + 1,
      active: true,
    })
    setIsAdding(true)
  }

  const handleEdit = (item: CategoryData) => {
    setEditForm(item)
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        await deleteCategory(id)
        toast.success("Category deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete category. Please try again.")
      }
    }
  }

  const handleSave = async () => {
    try {
      if (!editForm.name?.trim()) {
        toast.error("Category name is required")
        return
      }

      if (isAdding) {
        await addCategory(editForm as Omit<CategoryData, "id" | "created_at" | "updated_at">)
        toast.success("Category added successfully!")
        setIsAdding(false)
      } else if (editingItem) {
        await updateCategory(editingItem.id, editForm)
        toast.success("Category updated successfully!")
        setIsEditing(false)
      }
      resetForm()
    } catch (error) {
      toast.error("Failed to save category. Please try again.")
    }
  }

  const resetForm = () => {
    setEditForm({
      name: "",
      description: "",
      color: colorOptions[0],
      icon: iconOptions[0],
      order: 1,
      active: true,
    })
    setEditingItem(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    resetForm()
  }

  const handleInputChange = (field: keyof CategoryData, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading categories data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-lg">Error loading categories</div>
          <p className="text-slate-400">{error}</p>
          <Button onClick={refetch} variant="outline" className="border-slate-600 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const sortedCategories = [...categoriesData].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Categories ({categoriesData.length})</h3>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refetch} variant="outline" className="border-slate-600 bg-transparent" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {sortedCategories.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg text-white">{item.name}</CardTitle>
                      {!item.active && (
                        <Badge variant="secondary" className="bg-slate-600/50 text-slate-300">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <EnhancedModal
        isOpen={isEditing || isAdding}
        onClose={handleCancel}
        title={isAdding ? "Add New Category" : "Edit Category"}
        size="lg"
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
              {isAdding ? "Add Category" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Category Name *</label>
              <Input
                value={editForm.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="e.g., Full Stack"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
            <Textarea
              value={editForm.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={2}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    editForm.color === color ? "border-white" : "border-slate-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Icon</label>
            <div className="grid grid-cols-10 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange("icon", icon)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                    editForm.icon === icon ? "border-cyan-500 bg-cyan-500/20" : "border-slate-600 bg-slate-700"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

        </div>
      </EnhancedModal>
    </div>
  )
}

export default CategoryManager
