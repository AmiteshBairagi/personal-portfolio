import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ContactFormData } from "@/lib/data/contactService"

export interface ContactFormProps {
  editForm: ContactFormData
  handleInputChange: (field: keyof ContactFormData, value: string) => void
}

export function ContactForm({
  editForm,
  handleInputChange,
}: ContactFormProps) {
  return (
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
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Phone Number</label>
            <Input
              value={editForm.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-300 mb-2 block">Location</label>
            <Input
              value={editForm.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="City, State/Country"
            />
          </div>
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
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
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
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">LinkedIn Profile</label>
            <Input
              value={editForm.linkedin_url || ""}
              onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Twitter Profile</label>
            <Input
              value={editForm.twitter_url || ""}
              onChange={(e) => handleInputChange("twitter_url", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Personal Website</label>
            <Input
              value={editForm.website_url || ""}
              onChange={(e) => handleInputChange("website_url", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
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
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="/resume.pdf or https://example.com/resume.pdf"
          />
        </div>
      </div>
    </div>
  )
}
