import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SkillItem } from "@/lib/data/skillsService"

export interface SkillFormProps {
  editForm: Partial<SkillItem>
  handleInputChange: (field: keyof SkillItem, value: any) => void
  handleProjectsChange: (value: string) => void
}

export function SkillForm({
  editForm,
  handleInputChange,
  handleProjectsChange,
}: SkillFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Skill Name *</label>
          <Input
            value={editForm.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., React, Node.js, Python"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Category *</label>
          <select
            value={editForm.category || "Frontend"}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-md focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:outline-none"
            required
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Tools & Others">Tools & Others</option>
            <option value="Mobile">Mobile</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Experience *</label>
          <Input
            value={editForm.experience || ""}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., 2+ years, 6 months"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Projects (comma-separated)</label>
        <Textarea
          value={editForm.projects?.join(",") || ""}
          onChange={(e) => handleProjectsChange(e.target.value)}
          rows={3}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="E-Commerce Platform, Task Manager, Portfolio Website"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={editForm.is_active !== false}
          onChange={(e) => handleInputChange("is_active", e.target.checked)}
          className="w-4 h-4 text-cyan-500 bg-slate-900/50 border-slate-700 rounded focus:ring-cyan-500/20"
        />
        <label htmlFor="is_active" className="text-sm text-slate-300">
          Show on frontend
        </label>
      </div>
    </div>
  )
}
