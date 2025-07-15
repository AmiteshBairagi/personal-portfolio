"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Download,
  Wifi,
  WifiOff,
  Clock,
  RefreshCw,
  Trash2,
  Plus,
} from "lucide-react"
import { useContactRealTime } from "@/hooks/use-contact-real-time"
import type { ContactFormData } from "@/lib/data/contact-data-manager"

export default function ContactManager() {
  const {
    contactData,
    loading,
    error,
    isOnline,
    lastSyncTime,
    updateContact,
    createContact,
    deleteContact,
    refreshData,
    clearCache,
    getCacheStatus,
  } = useContactRealTime()

  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editForm, setEditForm] = useState<ContactFormData>({
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    resume_url: "",
    bio: "",
    availability_status: "available",
  })

  const handleEdit = () => {
    if (contactData) {
      setEditForm({
        email: contactData.email,
        phone: contactData.phone || "",
        location: contactData.location || "",
        github_url: contactData.github_url || "",
        linkedin_url: contactData.linkedin_url || "",
        twitter_url: contactData.twitter_url || "",
        website_url: contactData.website_url || "",
        resume_url: contactData.resume_url || "",
        bio: contactData.bio || "",
        availability_status: contactData.availability_status,
      })
      setIsEditing(true)
    }
  }

  const handleCreate = () => {
    setEditForm({
      email: "",
      phone: "",
      location: "",
      github_url: "",
      linkedin_url: "",
      twitter_url: "",
      website_url: "",
      resume_url: "",
      bio: "",
      availability_status: "available",
    })
    setIsCreating(true)
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        await createContact(editForm)
        setIsCreating(false)
      } else {
        await updateContact(editForm)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving contact:", error)
    }
  }

  const handleDelete = async () => {
    if (contactData) {
      try {
        await deleteContact(contactData.id)
        setIsDeleting(false)
      } catch (error) {
        console.error("Error deleting contact:", error)
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setIsDeleting(false)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const contactItems = contactData
    ? [
        {
          icon: Mail,
          label: "Email",
          value: contactData.email,
          color: "text-red-400",
        },
        {
          icon: Phone,
          label: "Phone",
          value: contactData.phone || "Not provided",
          color: "text-green-400",
        },
        {
          icon: MapPin,
          label: "Location",
          value: contactData.location || "Not provided",
          color: "text-blue-400",
        },
        {
          icon: Github,
          label: "GitHub",
          value: contactData.github_url || "Not provided",
          color: "text-gray-400",
        },
        {
          icon: Linkedin,
          label: "LinkedIn",
          value: contactData.linkedin_url || "Not provided",
          color: "text-blue-500",
        },
        {
          icon: Twitter,
          label: "Twitter",
          value: contactData.twitter_url || "Not provided",
          color: "text-cyan-400",
        },
        {
          icon: Globe,
          label: "Website",
          value: contactData.website_url || "Not provided",
          color: "text-purple-400",
        },
        {
          icon: Download,
          label: "Resume",
          value: contactData.resume_url || "Not provided",
          color: "text-orange-400",
        },
      ]
    : []

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "busy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "unavailable":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case "available":
        return "Available for work"
      case "busy":
        return "Currently busy"
      case "unavailable":
        return "Not available"
      default:
        return "Status unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">Contact Management</h2>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
              isOnline
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? "Connected" : "Offline"}</span>
            {lastSyncTime && (
              <>
                <Clock className="w-3 h-3" />
                <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={refreshData}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {!contactData && (
            <Button onClick={handleCreate} size="sm" className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Contact
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="bg-slate-700/30 border-slate-600/30">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-600 rounded w-1/3"></div>
              <div className="h-4 bg-slate-600 rounded w-2/3"></div>
              <div className="h-4 bg-slate-600 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Contact Data */}
      {!loading && !contactData && (
        <Card className="bg-slate-700/30 border-slate-600/30">
          <CardContent className="p-8 text-center">
            <Mail className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Contact Information</h3>
            <p className="text-slate-300 mb-4">Create your contact information to get started.</p>
            <Button onClick={handleCreate} className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Contact Information
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Contact Data */}
      {contactData && (
        <Card className="bg-slate-700/30 border-slate-600/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg text-white">Contact Information</CardTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(contactData.availability_status)}`}
              >
                {getAvailabilityText(contactData.availability_status)}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleEdit} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setIsDeleting(true)}
                size="sm"
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bio Section */}
            {contactData.bio && (
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Bio</h4>
                <p className="text-white text-sm leading-relaxed">{contactData.bio}</p>
              </div>
            )}

            {/* Contact Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-300">{item.label}</div>
                    <div className="text-white text-sm truncate" title={item.value}>
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timestamps */}
            <div className="flex justify-between text-xs text-slate-400 pt-4 border-t border-slate-600">
              <span>Created: {new Date(contactData.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(contactData.updated_at).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Modal */}
      <EnhancedModal
        isOpen={isEditing || isCreating}
        onClose={handleCancel}
        title={isCreating ? "Create Contact Information" : "Edit Contact Information"}
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
            <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? "Create" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Basic Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address *</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Phone Number</label>
                <Input
                  value={editForm.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block">Location</label>
                <Input
                  value={editForm.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="City, State/Country"
                />
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Availability</h4>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Current Status</label>
              <Select
                value={editForm.availability_status}
                onValueChange={(value: "available" | "busy" | "unavailable") =>
                  handleInputChange("availability_status", value)
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="available" className="text-white hover:bg-slate-600">
                    Available for work
                  </SelectItem>
                  <SelectItem value="busy" className="text-white hover:bg-slate-600">
                    Currently busy
                  </SelectItem>
                  <SelectItem value="unavailable" className="text-white hover:bg-slate-600">
                    Not available
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Bio</h4>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">About You</label>
              <Textarea
                value={editForm.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Tell visitors about yourself, your availability, and what you're looking for..."
                rows={4}
              />
            </div>
          </div>

          {/* Social Media & Professional Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Social Media & Professional</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">GitHub Profile</label>
                <Input
                  value={editForm.github_url || ""}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">LinkedIn Profile</label>
                <Input
                  value={editForm.linkedin_url || ""}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Twitter Profile</label>
                <Input
                  value={editForm.twitter_url || ""}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Personal Website</label>
                <Input
                  value={editForm.website_url || ""}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-cyan-400">Resume</h4>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Resume URL</label>
              <Input
                value={editForm.resume_url || ""}
                onChange={(e) => handleInputChange("resume_url", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="/resume.pdf or https://example.com/resume.pdf"
              />
            </div>
          </div>
        </div>
      </EnhancedModal>

      {/* Delete Confirmation Modal */}
      <EnhancedModal
        isOpen={isDeleting}
        onClose={handleCancel}
        title="Delete Contact Information"
        size="sm"
        footerActions={
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="bg-red-500 hover:bg-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <Trash2 className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Delete Contact Information?</h3>
          <p className="text-slate-300">
            This action cannot be undone. All contact information will be permanently deleted.
          </p>
        </div>
      </EnhancedModal>
    </div>
  )
}
