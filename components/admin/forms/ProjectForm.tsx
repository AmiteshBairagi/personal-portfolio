import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { ProjectData } from "@/lib/data/projectsService"

export interface ProjectFormProps {
  editForm: Partial<ProjectData>
  activeCategories: any[]
  imagePreview: string
  handleInputChange: (
    field: keyof ProjectData | "problem" | "solution" | "challenges" | "features",
    value: any,
  ) => void
  handleArrayInputChange: (field: "technologies", value: string) => void
  handleImageUpload: (file: File) => void
  handleImageRemove: () => void
}

export function ProjectForm({
  editForm,
  activeCategories,
  imagePreview,
  handleInputChange,
  handleArrayInputChange,
  handleImageUpload,
  handleImageRemove,
}: ProjectFormProps) {
  const suggestedCategories = [
    "Web App",
    "Mobile App",
    "Frontend",
    "Backend",
    "Full Stack",
    "API",
    "Open Source",
    "Tooling",
    "Automation",
    "ML/AI",
  ]

  const activeCategoryNames = new Set(
    activeCategories.map((category) => String(category.name)),
  )
  const filteredSuggestedCategories = suggestedCategories.filter(
    (category) => !activeCategoryNames.has(category),
  )

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Project Title *</label>
          <Input
            value={editForm.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., E-Commerce Platform"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Category *</label>
          <select
            value={editForm.category || ""}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-md px-3 py-2 focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:outline-none"
            required
          >
            <option value="">Select a category</option>
            {activeCategories.length > 0 && (
              <optgroup label="Saved categories">
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </optgroup>
            )}
            {filteredSuggestedCategories.length > 0 && (
              <optgroup label="Suggested categories">
                {filteredSuggestedCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Duration</label>
          <Input
            value={editForm.duration || ""}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., 3 months"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">GitHub URL</label>
          <Input
            value={editForm.github_url || ""}
            onChange={(e) => handleInputChange("github_url", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="https://github.com/username/project"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Live URL</label>
          <Input
            value={editForm.live_url || ""}
            onChange={(e) => handleInputChange("live_url", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="https://project-demo.com"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Short Description *</label>
        <Input
          value={editForm.short_description || ""}
          onChange={(e) => handleInputChange("short_description", e.target.value)}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
          placeholder="Brief one-line description for cards"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Full Description *</label>
        <Textarea
          value={editForm.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="Detailed project description"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Problem Statement</label>
        <Textarea
          value={editForm.details?.problem || ""}
          onChange={(e) => handleInputChange("problem", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="What problem does this project solve?"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Solution</label>
        <Textarea
          value={editForm.details?.solution || ""}
          onChange={(e) => handleInputChange("solution", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="How does this project solve the problem?"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Challenges</label>
        <Textarea
          value={editForm.details?.challenges || ""}
          onChange={(e) => handleInputChange("challenges", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="What challenges did you face and how did you overcome them?"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Technologies (comma-separated) *</label>
        <Textarea
          value={editForm.technologies?.join(",") || ""}
          onChange={(e) => handleArrayInputChange("technologies", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="React, Node.js, MongoDB, etc."
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Key Features (comma-separated)</label>
        <Textarea
          value={editForm.details?.features?.join(",") || ""}
          onChange={(e) => handleInputChange("features", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="Real-time updates, User authentication, etc."
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-300 mb-2 block">Project Image</label>

        {imagePreview ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Project preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white"
              onClick={() => document.getElementById("project-image-upload")?.click()}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/50 transition-colors group"
            onClick={() => document.getElementById("project-image-upload")?.click()}
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">Click to upload project image</p>
              <p className="text-xs text-slate-500">JPG or PNG, max 10MB</p>
            </div>
          </div>
        )}

        <input
          id="project-image-upload"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
          }}
          className="hidden"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={editForm.featured || false}
            onChange={(e) => handleInputChange("featured", e.target.checked)}
            className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-slate-300">
            Featured Project
          </label>
        </div>
      </div>
    </div>
  )
}
