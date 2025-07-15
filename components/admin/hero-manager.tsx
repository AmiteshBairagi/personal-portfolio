"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Save,
  RefreshCw,
  Upload,
  X,
  Plus,
  Github,
  Linkedin,
  Twitter,
  Mail,
  User,
  Briefcase,
  Users,
  ImageIcon,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useHeroData } from "@/hooks/use-hero-data"
import { toast } from "sonner"
import Image from "next/image"

export default function HeroManager() {
  const { heroData, isLoading, error, createHeroData, updateHeroData, deleteHeroData, resetHeroData, lastUpdate } =
    useHeroData()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    hero_image: "",
    skills: [] as string[],
    social_links: {
      github: "",
      linkedin: "",
      twitter: "",
      email: "",
    },
  })
  const [newSkill, setNewSkill] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsConnected(true)
    const handleOffline = () => setIsConnected(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Update form data when hero data changes
  useEffect(() => {
    if (heroData) {
      setFormData({
        name: heroData.name,
        title: heroData.title,
        description: heroData.description,
        hero_image: heroData.hero_image || heroData.heroImage || "",
        skills: [...heroData.skills],
        social_links: heroData.social_links ||
          heroData.socialLinks || {
            github: "",
            linkedin: "",
            twitter: "",
            email: "",
          },
      })
      setPreviewImage(heroData.hero_image || heroData.heroImage || null)
    }
  }, [heroData])

  // Show connection status changes
  useEffect(() => {
    if (lastUpdate) {
      toast.success("Hero section synced successfully!", {
        duration: 2000,
      })
    }
  }, [lastUpdate])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Immediate validation
    validateField(field, value)
  }

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreviewImage(result)
      setFormData((prev) => ({
        ...prev,
        hero_image: result,
      }))
    }
    reader.onerror = () => {
      toast.error("Failed to read image file.")
    }
    reader.readAsDataURL(file)
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.name) {
      errors.name = "Name is required"
    }
    if (!formData.title) {
      errors.title = "Title is required"
    }
    if (!formData.description) {
      errors.description = "Description is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateField = (field: string, value: string) => {
    if (field === "name" && !value) {
      setFormErrors((prev) => ({ ...prev, name: "Name is required" }))
    } else if (field === "title" && !value) {
      setFormErrors((prev) => ({ ...prev, title: "Title is required" }))
    } else if (field === "description" && !value) {
      setFormErrors((prev) => ({ ...prev, description: "Description is required" }))
    } else {
      setFormErrors((prev) => {
        const { [field]: removed, ...rest } = prev
        return rest
      })
    }
  }

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.")
      return
    }

    try {
      setIsSaving(true)
      toast.success("Creating hero section...", {
        duration: 2000,
      })
      await createHeroData(formData)
      setIsEditing(false)
      toast.success("Hero section created and synced successfully!", {
        duration: 3000,
      })
    } catch (error) {
      toast.error("Failed to create hero section")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.")
      return
    }

    try {
      setIsSaving(true)
      // Optimistic update
      toast.success("Hero section updating...", {
        duration: 2000,
      })
      await updateHeroData(formData)
      setIsEditing(false)
      toast.success("Hero section updated and synced across all devices!", {
        duration: 3000,
      })
    } catch (error) {
      toast.error("Failed to update hero section")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the hero section? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteHeroData()
      setIsEditing(false)
      setPreviewImage(null)
      toast.success("Hero section deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete hero section")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the hero section to default values?")) {
      return
    }

    try {
      await resetHeroData()
      setIsEditing(false)
      setPreviewImage(null)
      toast.success("Hero section reset and synced!")
    } catch (error) {
      toast.error("Failed to reset hero section")
    }
  }

  const handleCancel = () => {
    if (heroData) {
      setFormData({
        name: heroData.name,
        title: heroData.title,
        description: heroData.description,
        hero_image: heroData.hero_image || heroData.heroImage || "",
        skills: [...heroData.skills],
        social_links: heroData.social_links ||
          heroData.socialLinks || {
            github: "",
            linkedin: "",
            twitter: "",
            email: "",
          },
      })
      setPreviewImage(heroData.hero_image || heroData.heroImage || null)
    }
    setIsEditing(false)
    setFormErrors({})
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert className="bg-red-500/10 border-red-500/30 text-red-300 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            Hero Section Management
            {isConnected ? (
              <Wifi className="w-5 h-5 ml-2 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 ml-2 text-red-400" />
            )}
          </h2>
          <p className="text-slate-400">
            Manage your hero section content, image, and social links with full CRUD operations
            {lastUpdate && (
              <span className="text-green-400 ml-2">
                • Last synced: {new Date(Number.parseInt(lastUpdate)).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              {heroData ? (
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Update & Sync
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={isSaving} size="sm">
                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create & Sync
                </Button>
              )}
            </>
          ) : (
            <>
              {heroData && (
                <>
                  <Button onClick={handleDelete} variant="outline" size="sm" disabled={isDeleting}>
                    {isDeleting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
              <Button onClick={() => setIsEditing(true)} size="sm">
                {isEditing ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {heroData ? "Edit Hero" : "Create Hero"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Database Status */}
      <Card className="bg-slate-800/60 border-slate-600/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {heroData ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">Hero data exists in database</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-300">No hero data found - create new entry</span>
                </>
              )}
            </div>
            <span className="text-xs text-slate-500">{isConnected ? "Database connected" : "Database offline"}</span>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Real-time Sync Status */}
            <Card className="bg-slate-800/60 border-slate-600/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">Real-time sync active</span>
                  </div>
                  <span className="text-xs text-slate-500">Changes will appear instantly on the frontend</span>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-slate-800/60 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-cyan-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`bg-slate-700/50 border-slate-600 text-white ${formErrors.name ? "border-red-500" : ""}`}
                      placeholder="Your name"
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-slate-300">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={`bg-slate-700/50 border-slate-600 text-white ${formErrors.title ? "border-red-500" : ""}`}
                      placeholder="Your professional title"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`bg-slate-700/50 border-slate-600 text-white min-h-[100px] ${formErrors.description ? "border-red-500" : ""}`}
                    placeholder="Brief description about yourself"
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Hero Image */}
            <Card className="bg-slate-800/60 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-purple-400" />
                  Hero Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="heroImage" className="text-slate-300">
                      Image Upload
                    </Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        id="heroImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        ref={imageInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Image
                      </Button>
                    </div>
                  </div>
                  {(previewImage || formData.hero_image) && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700">
                      <Image
                        src={previewImage || formData.hero_image || "/placeholder.svg"}
                        alt="Hero preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-slate-800/60 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-400" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="bg-slate-700/50 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-slate-700 text-slate-200 hover:bg-slate-600">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-slate-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-slate-800/60 border-slate-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Label>
                    <Input
                      value={formData.social_links.github}
                      onChange={(e) => handleNestedInputChange("social_links", "github", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 flex items-center">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Label>
                    <Input
                      value={formData.social_links.linkedin}
                      onChange={(e) => handleNestedInputChange("social_links", "linkedin", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 flex items-center">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Label>
                    <Input
                      value={formData.social_links.twitter}
                      onChange={(e) => handleNestedInputChange("social_links", "twitter", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Twitter profile URL"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      value={formData.social_links.email}
                      onChange={(e) => handleNestedInputChange("social_links", "email", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {heroData ? (
              /* Current Hero Data Display */
              <Card className="bg-slate-800/60 border-slate-600/50">
                <CardHeader>
                  <CardTitle className="text-white">Current Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center space-x-4">
                    {heroData.hero_image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                        <Image
                          src={heroData.hero_image || "/placeholder.svg"}
                          alt="Hero"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">{heroData.name}</h3>
                      <p className="text-cyan-400">{heroData.title}</p>
                      <p className="text-slate-400 text-sm mt-1">{heroData.description}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Skills */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {heroData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-slate-700 text-slate-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Social Links */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Social Links</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="text-slate-400">
                        <Github className="w-4 h-4 inline mr-1" />
                        {heroData.social_links?.github || "Not set"}
                      </div>
                      <div className="text-slate-400">
                        <Linkedin className="w-4 h-4 inline mr-1" />
                        {heroData.social_links?.linkedin || "Not set"}
                      </div>
                      <div className="text-slate-400">
                        <Twitter className="w-4 h-4 inline mr-1" />
                        {heroData.social_links?.twitter || "Not set"}
                      </div>
                      <div className="text-slate-400">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {heroData.social_links?.email || "Not set"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* No Data State */
              <Card className="bg-slate-800/60 border-slate-600/50">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto" />
                    <h3 className="text-xl font-semibold text-white">No Hero Data Found</h3>
                    <p className="text-slate-400">
                      No hero section data exists in the database. Click "Create Hero" to set up your hero section.
                    </p>
                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Hero Section
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
