"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { ContactForm } from "./forms/ContactForm"
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
  RefreshCw,
  Trash2,
  Plus,
  User,
} from "lucide-react"
import { useContact } from "@/hooks/useContact"
import type { ContactFormData } from "@/lib/data/contactService"

const ContactManager = () => {
  const {
    contactData,
    loading,
    error,
    updateContact,
    createContact,
    deleteContact,
    refreshData,
  } = useContact()

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


  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Mail className="w-5 h-5 text-cyan-400" />
            Contact Management
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={refreshData}
            size="sm"
            variant="outline"
            className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all h-10 px-3"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {!contactData && (
            <Button onClick={handleCreate} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0 h-10 px-4">
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
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-700/50 rounded-lg w-1/3"></div>
              <div className="h-4 bg-slate-700/50 rounded-lg w-2/3"></div>
              <div className="h-4 bg-slate-700/50 rounded-lg w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Contact Data */}
      {!loading && !contactData && (
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 mb-6">
              <Mail className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Contact Information</h3>
            <p className="text-slate-400 mb-6 max-w-md">Create your contact information to display it on your portfolio and let people reach out to you.</p>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Contact Information
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Contact Data */}
      {contactData && (
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-lg group pointer-events-none">
          <div className="pointer-events-auto">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                 <CardTitle className="text-lg text-white flex items-center gap-2">
                   Contact Details
                   <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ml-2">Active</span>
                 </CardTitle>
              </div>
              <div className="flex items-center gap-2 opacity-100 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity">
                <Button onClick={handleEdit} size="sm" variant="outline" className="h-8 bg-slate-800/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white">
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  onClick={() => setIsDeleting(true)}
                  size="sm"
                  variant="outline"
                  className="h-8 bg-slate-800/50 border-red-900/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Bio Section */}
              {contactData.bio && (
                <div className="p-5 bg-slate-900/40 rounded-xl border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                    <User className="w-4 h-4" /> Bio / About
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{contactData.bio}</p>
                </div>
              )}

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-4 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group/item"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-slate-800/50 group-hover/item:scale-110 transition-transform duration-300`}
                      style={{ 
                        borderColor: `color-mix(in srgb, currentColor 20%, transparent)`,
                        color: `color-mix(in srgb, currentColor, transparent)` // Fallback
                      }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className={`text-sm truncate ${item.value === "Not provided" ? "text-slate-500 italic" : "text-slate-200 font-medium"}`} title={item.value}>
                        {item.value || "Not provided"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </div>
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
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0">
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? "Create Contact" : "Save Changes"}
            </Button>
          </>
        }
      >
        <ContactForm editForm={editForm} handleInputChange={handleInputChange} />
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
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-lg shadow-red-500/25 border-0">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Contact
            </Button>
          </>
        }
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Delete Contact Information?</h3>
          <p className="text-slate-400 max-w-xs mx-auto">
            This action cannot be undone. All contact information will be permanently deleted from the system.
          </p>
        </div>
      </EnhancedModal>
    </div>
  )
}

export default ContactManager
