import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Upload } from "lucide-react"
import type { CertificationItem } from "@/lib/data/certificationService"

export interface CertificationFormProps {
  editForm: CertificationItem
  imagePreview: string
  handleInputChange: (field: keyof CertificationItem, value: any) => void
  handleSkillsChange: (value: string) => void
  handleImageUpload: (file: File) => void
}

export function CertificationForm({
  editForm,
  imagePreview,
  handleInputChange,
  handleSkillsChange,
  handleImageUpload,
}: CertificationFormProps) {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-300 block">Certificate Image</label>
        <div className="flex items-center space-x-4">
          {/* Image Preview */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Certificate preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              id="certification-image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => document.getElementById("certification-image-upload")?.click()}
              variant="outline"
              className="bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <p className="text-xs text-slate-400 mt-1">Recommended: 600x400px, less than 10mb</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Certification Title *</label>
          <Input
            value={editForm.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., AWS Certified Solutions Architect"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Issuing Organization *</label>
          <Input
            value={editForm.issuer}
            onChange={(e) => handleInputChange("issuer", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., Amazon Web Services"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Issue Date *</label>
          <Input
            value={editForm.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., 2024, March 2024"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Valid Until *</label>
          <Input
            value={editForm.valid_until}
            onChange={(e) => handleInputChange("valid_until", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., 2027, Lifetime"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Credential ID *</label>
          <Input
            value={editForm.credential_id}
            onChange={(e) => handleInputChange("credential_id", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., AWS-SAA-2024-001"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Exam Score</label>
          <Input
            value={editForm.exam_score}
            onChange={(e) => handleInputChange("exam_score", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., 892/1000, 85%"
          />
        </div>
      </div>

      {/* Level Selection */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Certification Level *</label>
        <Select
          value={editForm.level}
          onValueChange={(value: "Professional" | "Associate" | "Expert") => handleInputChange("level", value)}
        >
          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20">
            <SelectValue placeholder="Select certification level" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="Associate" className="text-white focus:bg-slate-700">
              Associate
            </SelectItem>
            <SelectItem value="Professional" className="text-white focus:bg-slate-700">
              Professional
            </SelectItem>
            <SelectItem value="Expert" className="text-white focus:bg-slate-700">
              Expert
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Description *</label>
        <Textarea
          value={editForm.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="Brief description of what this certification validates..."
          required
        />
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">
          Skills Validated (comma-separated) *
        </label>
        <Textarea
          value={(editForm.skills || []).join(",")}
          onChange={(e) => handleSkillsChange(e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="AWS, Cloud Architecture, Security, etc."
          required
        />
      </div>

      {/* Verification URL */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Verification URL *</label>
        <Input
          value={editForm.verification_url}
          onChange={(e) => handleInputChange("verification_url", e.target.value)}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
          placeholder="https://verify.certification.com"
          type="url"
          required
        />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={editForm.featured}
          onChange={(e) => handleInputChange("featured", e.target.checked)}
          className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-slate-300">
          Featured Certification (Display prominently on the website)
        </label>
      </div>
    </div>
  )
}
