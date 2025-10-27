"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EnhancedModal } from "@/components/ui/enhanced-modal"
import { useToast } from "@/hooks/use-toast"
import { useBlogRealTime } from "@/hooks/use-blog-real-time"
import type { BlogPost } from "@/lib/data/blog-data-manager"
import { blogCategories } from "@/lib/blog-data"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Clock,
  Tag,
  User,
  FileText,
  Save,
  X,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react"

interface BlogFormData {
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

const initialFormData: BlogFormData = {
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

export default function BlogManager() {
  const { toast } = useToast()
  const {
    posts,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    createPost,
    updatePost,
    deletePost,
    reorderPost,
    toggleFeatured,
    togglePublished,
    refreshData,
    getPostById,
  } = useBlogRealTime()

  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [showOnlyPublished, setShowOnlyPublished] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
  const [formData, setFormData] = useState<BlogFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      const matchesFeatured = !showOnlyFeatured || post.featured
      const matchesPublished = !showOnlyPublished || post.published

      return matchesSearch && matchesCategory && matchesFeatured && matchesPublished
    })
  }, [posts, searchTerm, selectedCategory, showOnlyFeatured, showOnlyPublished])

  // Handle form input changes
  const handleInputChange = (field: keyof BlogFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required"
    }

    if (!formData.author.trim()) {
      errors.author = "Author is required"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle create post
  const handleCreatePost = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const postData = {
        title: formData.title.trim(),
        slug:
          formData.slug.trim() ||
          formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 150) + "...",
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        image: formData.image || "/placeholder.svg?height=400&width=600",
        featured: formData.featured,
        published: formData.published,
        published_at: new Date().toISOString().split("T")[0],
        read_time: Math.max(1, Math.ceil(formData.content.trim().split(/\s+/).length / 200)),
        is_active: true,
      }

      const result = await createPost(postData)

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post created successfully.",
        })
        resetCreateForm()
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit post
  const handleEditPost = async () => {
    if (!editingPost || !validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updates = {
        title: formData.title.trim(),
        slug:
          formData.slug.trim() ||
          formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 150) + "...",
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        image: formData.image || "/placeholder.svg?height=400&width=600",
        featured: formData.featured,
        published: formData.published,
      }

      const result = await updatePost(editingPost.id, updates)

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post updated successfully.",
        })
        resetEditForm()
      } else {
        throw new Error("Failed to update post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete post
  const handleDeletePost = async () => {
    if (!deletingPostId) return

    try {
      const result = await deletePost(deletingPostId)

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post.",
        variant: "destructive",
      })
    } finally {
      setDeletingPostId(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Handle reorder post
  const handleReorderPost = async (postId: string, direction: "up" | "down") => {
    try {
      const result = await reorderPost(postId, direction)

      if (result) {
        toast({
          title: "Success!",
          description: `Post moved ${direction} successfully.`,
        })
      } else {
        toast({
          title: "Info",
          description: `Cannot move post ${direction} any further.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reorder post.",
        variant: "destructive",
      })
    }
  }

  // Handle toggle featured
  const handleToggleFeatured = async (postId: string) => {
    try {
      const result = await toggleFeatured(postId)

      if (result) {
        const post = getPostById(postId)
        toast({
          title: "Success!",
          description: `Post ${post?.featured ? "added to" : "removed from"} featured section.`,
        })
      } else {
        throw new Error("Failed to toggle featured status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update featured status.",
        variant: "destructive",
      })
    }
  }

  // Handle toggle published
  const handleTogglePublished = async (postId: string) => {
    try {
      const result = await togglePublished(postId)

      if (result) {
        const post = getPostById(postId)
        toast({
          title: "Success!",
          description: `Post ${post?.published ? "published" : "unpublished"} successfully.`,
        })
      } else {
        throw new Error("Failed to toggle published status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update published status.",
        variant: "destructive",
      })
    }
  }

  // Open edit modal
  const openEditModal = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(", "),
      image: post.image,
      author: post.author,
      featured: post.featured,
      published: post.published,
    })
    setFormErrors({})
    setIsEditModalOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (postId: string) => {
    setDeletingPostId(postId)
    setIsDeleteDialogOpen(true)
  }

  // Reset create form
  const resetCreateForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
    setIsCreateModalOpen(false)
  }

  // Reset edit form
  const resetEditForm = () => {
    setFormData(initialFormData)
    setEditingPost(null)
    setFormErrors({})
    setIsEditModalOpen(false)
  }

  // Blog form component
  const BlogForm = () => (
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
            className={formErrors.title ? "border-red-500" : ""}
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
            className={formErrors.author ? "border-red-500" : ""}
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
            <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories
                .filter((cat) => cat !== "All")
                .map((category) => (
                  <SelectItem key={category} value={category}>
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
          className={formErrors.content ? "border-red-500" : ""}
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Featured Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="Enter image URL"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">
            Manage your blog posts with real-time updates. Changes are instantly reflected on the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refreshData()} disabled={isLoading} className="border-slate-600 text-slate-300 bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} disabled={isLoading}  className="border-slate-600 text-slate-300 bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
          
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex justify-center">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            isOnline
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isOnline ? "Live" : "Offline"}
          {lastSyncTime && <span className="text-slate-400">• Last sync: {lastSyncTime.toLocaleTimeString()}</span>}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card  className="bg-slate-700 border-slate-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card  className="bg-slate-700 border-slate-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((post) => post.published).length}</div>
          </CardContent>
        </Card>
        <Card  className="bg-slate-700 border-slate-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((post) => post.featured).length}</div>
          </CardContent>
        </Card>
        <Card  className="bg-slate-700 border-slate-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((post) => !post.published).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card  className="bg-slate-700 border-slate-600 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1bg-slate-700 border-slate-600 text-white">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title, excerpt, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} >
              <SelectTrigger className="w-full sm:w-[200px] bg-slate-700 border-slate-600 text-white" >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                {blogCategories.map((category) => (
                  <SelectItem key={category} value={category} >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 ">
                <Switch 
                  id="featured-filter" 
                  checked={showOnlyFeatured} 
                  onCheckedChange={setShowOnlyFeatured} 
                  className="data-[state=checked]:bg-slate-800 bg-slate-300 border-slate-400 [&>span]:bg-slate-100"
                />
                <Label htmlFor="featured-filter" className="text-sm">
                  Featured Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published-filter" 
                  checked={showOnlyPublished} 
                  onCheckedChange={setShowOnlyPublished} 
                  className="data-[state=checked]:bg-slate-800 bg-slate-300 border-slate-400 [&>span]:bg-slate-100"
                />
                <Label htmlFor="published-filter" className="text-sm">
                  Published Only
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading posts...</span>
            </CardContent>
          </Card>
        )}

        {!isLoading && filteredPosts.length === 0 && (
          <Card  >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {posts.length === 0
                  ? "You haven't created any blog posts yet."
                  : "No posts match your current filters."}
              </p>
              {posts.length === 0 && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!isLoading &&
          filteredPosts.map((post, index) => (
            <Card key={post.id} className="overflow-hidden bg-slate-700 border-slate-600 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Post Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-32 lg:h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title and Description */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>

                    {/* Post Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.read_time} min read
                      </div>
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {/* Reorder buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderPost(post.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderPost(post.id, "down")}
                          disabled={index === filteredPosts.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant={post.featured ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleFeatured(post.id)}
                        className={post.featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      >
                        {post.featured ? (
                          <Star className="h-3 w-3 mr-1 fill-current" />
                        ) : (
                          <Star className="h-3 w-3 mr-1" />
                        )}
                        {post.featured ? "Featured" : "Feature"}
                      </Button>

                      <Button
                        variant={post.published ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePublished(post.id)}
                        className={post.published ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {post.published ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {post.published ? "Published" : "Publish"}
                      </Button>

                      <Button variant="outline" size="sm" onClick={() => openEditModal(post)} className="bg-slate-700 border-slate-600 text-white">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(post.id)}
                        className="text-destructive hover:text-destructive bg-slate-700 border-slate-600 text-white"
                        
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Create Modal */}
      <EnhancedModal
        isOpen={isCreateModalOpen}
        onClose={resetCreateForm}
        title="Create New Blog Post"
        size="lg"
        footerActions={
          <>
            <Button variant="outline" onClick={resetCreateForm} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </>
        }
      >
        <BlogForm />
      </EnhancedModal>

      {/* Edit Modal */}
      <EnhancedModal
        isOpen={isEditModalOpen}
        onClose={resetEditForm}
        title="Edit Blog Post"
        size="lg"
        footerActions={
          <>
            <Button variant="outline" onClick={resetEditForm} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleEditPost} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Post
                </>
              )}
            </Button>
          </>
        }
      >
        <BlogForm />
      </EnhancedModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone and will immediately remove
              the post from the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingPostId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
