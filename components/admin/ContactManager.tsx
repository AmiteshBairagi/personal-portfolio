"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { ContactForm } from "./forms/ContactForm"
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

const ContactManager = () => {
  const {
    contactData,
    loading,
    error,
    // updateContact,
    // createContact,
    // deleteContact,
    refreshData,
  } = useContact()

  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  // const [editForm, setEditForm] = useState<ContactFormData>({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   message: "",
    
  // })

  // const handleEdit = () => {
  //   if (contactData) {
  //     setEditForm({
  //       email: contactData.email,
  //       phone: contactData.phone || "",
  //       name: contactData.name || "",
  //       message: ""
        
  //     })
  //     setIsEditing(true)
  //   }
  // }

  // const handleCreate = () => {
  //   setEditForm({
  //     email: "",
  //     phone: "",
  //     location: "",
  //     github_url: "",
  //     linkedin_url: "",
  //     twitter_url: "",
  //     website_url: "",
  //     resume_url: "",
  //     bio: "",
  //     availability_status: "available",
  //   })
  //   setIsCreating(true)
  // }

  // const handleSave = async () => {
  //   try {
  //     if (isCreating) {
  //       await createContact(editForm)
  //       setIsCreating(false)
  //     } else {
  //       await updateContact(editForm)
  //       setIsEditing(false)
  //     }
  //   } catch (error) {
  //     console.error("Error saving contact:", error)
  //   }
  // }

  // const handleDelete = async () => {
  //   if (contactData) {
  //     try {
  //       await deleteContact(contactData.id)
  //       setIsDeleting(false)
  //     } catch (error) {
  //       console.error("Error deleting contact:", error)
  //     }
  //   }
  // }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setIsDeleting(false)
  }

  // const handleInputChange = (field: keyof ContactFormData, value: string) => {
  //   setEditForm((prev) => ({ ...prev, [field]: value }))
  // }

  // const contactItems = contactData
  //   ? [
  //       {
  //         icon: Mail,
  //         label: "Email",
  //         value: contactData.email,
  //         color: "text-red-400",
  //       },
  //       {
  //         icon: Phone,
  //         label: "Phone",
  //         value: contactData.phone || "Not provided",
  //         color: "text-green-400",
  //       },
  //       {
  //         icon: MapPin,
  //         label: "Location",
  //         value: contactData.location || "Not provided",
  //         color: "text-blue-400",
  //       },
  //       {
  //         icon: Github,
  //         label: "GitHub",
  //         value: contactData.github_url || "Not provided",
  //         color: "text-gray-400",
  //       },
  //       {
  //         icon: Linkedin,
  //         label: "LinkedIn",
  //         value: contactData.linkedin_url || "Not provided",
  //         color: "text-blue-500",
  //       },
  //       {
  //         icon: Twitter,
  //         label: "Twitter",
  //         value: contactData.twitter_url || "Not provided",
  //         color: "text-cyan-400",
  //       },
  //       {
  //         icon: Globe,
  //         label: "Website",
  //         value: contactData.website_url || "Not provided",
  //         color: "text-purple-400",
  //       },
  //       {
  //         icon: Download,
  //         label: "Resume",
  //         value: contactData.resume_url || "Not provided",
  //         color: "text-orange-400",
  //       },
  //     ]
  //   : []


  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Mail className="w-5 h-5 text-cyan-400" />
            Lead Management
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

          {/* {!contactData && (
            <Button onClick={handleCreate} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0 h-10 px-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Contact
            </Button>
          )} */}
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
      {/* {!loading && !contactData && (
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
      )} */}

      {/* Current Contact Data */}
     

      {/* Edit/Create Modal */}
      {/* <EnhancedModal
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
      </EnhancedModal> */}

      {/* Delete Confirmation Modal */}
      
    </div>
  )
}

export default ContactManager
