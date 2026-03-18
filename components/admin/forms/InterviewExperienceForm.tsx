import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogCategories } from "@/lib/blog-data"

export interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string
  image: string
  author: string
  featured: boolean
  published: boolean
}

export const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Technical Tutorial",
  tags: "",
  image: "/placeholder.svg?height=400&width=600",
  author: "Amitesh",
  featured: false,
  published: true,
}

export interface InterviewExperienceFormProps {
  formData: BlogFormData
  handleInputChange: (field: keyof BlogFormData, value: string | boolean) => void
  formErrors: Record<string, string>
  imagePreview: string
  handleImageUpload: (file: File) => void
  handleImageRemove: () => void
}

export function InterviewExperienceForm({
  formData,
  handleInputChange,
  formErrors,
  imagePreview,
  handleImageUpload,
  handleImageRemove,
}: InterviewExperienceFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter blog post title"
            className={`bg-slate-900/50 border border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 ${formErrors.title ? "border-red-500/50" : ""}`}
          />
          {formErrors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.title}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            placeholder="auto-generated-from-title"
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-500">Leave empty to auto-generate from title</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">
            Author <span className="text-red-500">*</span>
          </Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            placeholder="Author name"
            className={`bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 ${formErrors.author ? "border-red-500/50" : ""}`}
          />
          {formErrors.author && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.author}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className={`bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 ${formErrors.category ? "border-red-500/50" : ""}`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {blogCategories
                .filter((cat) => cat !== "All")
                .map((category) => (
                  <SelectItem key={category} value={category} className="text-white focus:bg-slate-700">
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formErrors.category && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.category}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
          placeholder="Brief description (optional - will be auto-generated if empty)"
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Write your blog post content here (supports Markdown)"
          rows={12}
          className={`bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none ${formErrors.content ? "border-red-500/50" : ""}`}
        />
        {formErrors.content && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.content}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          placeholder="Enter tags separated by commas"
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-slate-300 mb-2 block">Featured Image</Label>

        {imagePreview ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Featured image preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white"
              onClick={() => document.getElementById("blog-image-upload")?.click()}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
            onClick={() => document.getElementById("blog-image-upload")?.click()}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform border border-slate-700 group-hover:border-cyan-500/50">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-300 font-medium group-hover:text-cyan-400 transition-colors">Click to upload featured image</p>
                <p className="text-xs text-slate-500">JPG, PNG or WebP, max 10MB</p>
              </div>
            </div>
          </div>
        )}

        <input
          id="blog-image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file)
          }}
          className="hidden"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange("featured", checked)}
          />
          <Label htmlFor="featured">Featured Post</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => handleInputChange("published", checked)}
          />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>
    </div>
  )
}
