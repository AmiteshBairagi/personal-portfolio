import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CategoryData } from "@/lib/data/categoryService"

export const colorOptions = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5A2B", // Brown
  "#6B7280", // Gray
]

export const iconOptions = [
  "🚀",
  "🎨",
  "⚙️",
  "📱",
  "🌐",
  "🤖",
  "📊",
  "📈",
  "👥",
  "💻",
  "🔧",
  "🎯",
  "💡",
  "🔥",
  "⭐",
  "🎪",
  "🎭",
  "🎵",
  "🎮",
  "📚",
]

export interface CategoryFormProps {
  editForm: Partial<CategoryData>
  handleInputChange: (field: keyof CategoryData, value: any) => void
}

export function CategoryForm({
  editForm,
  handleInputChange,
}: CategoryFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Category Name *</label>
          <Input
            value={editForm.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
            placeholder="e.g., Full Stack"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
        <Textarea
          value={editForm.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={2}
          className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500 resize-none"
          placeholder="Brief description of this category"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Color</label>
        <div className="grid grid-cols-8 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleInputChange("color", color)}
              className={`w-8 h-8 rounded-lg border-2 ${
                editForm.color === color ? "border-white" : "border-slate-600"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Icon</label>
        <div className="grid grid-cols-10 gap-2">
          {iconOptions.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => handleInputChange("icon", icon)}
              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-lg ${
                editForm.icon === icon ? "border-cyan-500 bg-cyan-500/20" : "border-slate-600 bg-slate-700"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
