"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Save, X, Trash2, RefreshCw, User, ImageIcon } from "lucide-react"
import { useAboutData } from "@/hooks/use-about-data"
import type { AboutData } from "@/lib/data/about-data"

export default function AboutManager() {
  const { aboutData, loading, error, updateData, deleteData, refreshData } = useAboutData()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<AboutData>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => {
    setEditData({
      title: aboutData?.title || "About Me",
      description: aboutData?.description || "",
      image_url: aboutData?.image_url || "",
      skills: aboutData?.skills || [],
      experience_years: aboutData?.experience_years || 0,
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({})
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateData(editData)
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      console.error("Error saving about data:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the about data? This action cannot be undone.")) {
      return
    }

    try {
      setDeleting(true)
      await deleteData()
    } catch (error) {
      console.error("Error deleting about data:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
    setEditData((prev) => ({ ...prev, skills }))
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading about data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Section</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information and bio</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {!isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>{aboutData ? "Edit" : "Create"}</span>
              </button>

              {aboutData && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
                >
                  {deleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete</span>
                </button>
              )}
            </>
          )}

          {isEditing && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save</span>
              </button>

              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="About Me"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editData.image_url || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editData.skills?.join(", ") || ""}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, TypeScript, Python"
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={editData.experience_years || 0}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, experience_years: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {aboutData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{aboutData.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{aboutData.description}</p>
                  </div>

                  {aboutData.image_url && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <ImageIcon className="w-4 h-4" />
                      <span>Image: {aboutData.image_url}</span>
                    </div>
                  )}

                  {aboutData.skills && aboutData.skills.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {aboutData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aboutData.experience_years && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Experience:</strong> {aboutData.experience_years} years
                    </div>
                  )}

                  <div className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                    Last updated: {aboutData.updated_at ? new Date(aboutData.updated_at).toLocaleString() : "Never"}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No about information found. Click "Create" to add your personal information.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
