"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useCategories } from "@/hooks/useCategories"
import type { CategoryData } from "@/lib/data/categoryService"
import { CategoryForm, colorOptions, iconOptions } from "./forms/CategoryForm"
import { Edit, Trash2, Plus, Save, X, ArrowUp, ArrowDown, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const CategoryManager = () => {
  const {
    data: categoriesData,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch,
  } = useCategories()

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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <span className="text-slate-400 font-medium pt-2">Loading categories data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4 bg-slate-800/40 backdrop-blur-md border border-red-500/20 p-6 rounded-xl shadow-lg">
          <div className="text-red-400 text-lg font-semibold">Error loading categories</div>
          <p className="text-slate-400 font-medium">{error}</p>
          <Button onClick={refetch} className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/25 border-0">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Categories <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">{categoriesData.length}</Badge>
            </h3>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button onClick={refetch} variant="outline" className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all h-10 w-10 p-0" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
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
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 shadow-lg group">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}40` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">{item.name}</CardTitle>
                      {!item.active && (
                        <Badge variant="outline" className="text-[10px] bg-slate-900 border-slate-700 text-slate-500 uppercase px-1.5 font-semibold">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
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
               className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
              <Save className="w-4 h-4 mr-2" />
              {isAdding ? "Add Category" : "Save Changes"}
            </Button>
          </>
        }
      >
        <CategoryForm editForm={editForm} handleInputChange={handleInputChange} />
      </EnhancedModal>
    </div>
  )
}

export default CategoryManager
