"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EnhancedModal } from "@/components/ui/enhanced-modal";
import { useToast } from "@/hooks/use-toast";
import { useBlogRealTime } from "@/hooks/use-blog-real-time";
import type { BlogPost } from "@/lib/data/blog-data-manager";
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
  RefreshCw,
} from "lucide-react";
import {
  InterviewExperienceForm,
  type BlogFormData,
  initialFormData,
} from "./forms/InterviewExperienceForm";

const InterviewExperienceManager = () => {
  const { toast } = useToast();
  const {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    toggleFeatured,
    togglePublished,
    refreshData,
    getPostById,
  } = useBlogRealTime();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp")
    ) {
      if (file.size <= 10 * 1024 * 1024) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Error",
          description: "Image size should be less than 10MB.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a valid image file (JPG, PNG or WebP).",
        variant: "destructive",
      });
    }
  };

  // Handle image remove
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesFeatured = !showOnlyFeatured || post.featured;
      const matchesPublished = !showOnlyPublished || post.published;

      return (
        matchesSearch && matchesCategory && matchesFeatured && matchesPublished
      );
    });
  }, [
    posts,
    searchTerm,
    selectedCategory,
    showOnlyFeatured,
    showOnlyPublished,
  ]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof BlogFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (!formData.author.trim()) {
      errors.author = "Author is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create post
  const handleCreatePost = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

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
        excerpt:
          formData.excerpt.trim() || formData.content.substring(0, 150) + "...",
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        featured: formData.featured,
        published: formData.published,
        publishedAt: new Date().toISOString().split("T")[0],
        readTime: Math.max(
          1,
          Math.ceil(formData.content.trim().split(/\s+/).length / 200),
        ),
      };

      // if (imageFile) {
      //   delete postData.image;
      // }
      const result = await createPost(postData, imageFile || undefined);

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post created successfully.",
        });
        resetCreateForm();
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create blog post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit post
  const handleEditPost = async () => {
    if (!editingPost || !validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

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
        excerpt:
          formData.excerpt.trim() || formData.content.substring(0, 150) + "...",
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: formData.category,
        featured: formData.featured,
        published: formData.published,
      };

      const result = await updatePost(
        editingPost.id,
        updates,
        imageFile || undefined,
      );

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post updated successfully.",
        });
        resetEditForm();
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update blog post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!deletingPostId) return;

    try {
      const result = await deletePost(deletingPostId);

      if (result) {
        toast({
          title: "Success!",
          description: "Blog post deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete blog post.",
        variant: "destructive",
      });
    } finally {
      setDeletingPostId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (postId: string) => {
    try {
      const result = await toggleFeatured(postId);

      if (result) {
        const post = getPostById(postId);
        toast({
          title: "Success!",
          description: `Post ${post?.featured ? "added to" : "removed from"} featured section.`,
        });
      } else {
        throw new Error("Failed to toggle featured status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update featured status.",
        variant: "destructive",
      });
    }
  };

  // Handle toggle published
  const handleTogglePublished = async (postId: string) => {
    try {
      const result = await togglePublished(postId);

      if (result) {
        const post = getPostById(postId);
        toast({
          title: "Success!",
          description: `Post ${post?.published ? "published" : "unpublished"} successfully.`,
        });
      } else {
        throw new Error("Failed to toggle published status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update published status.",
        variant: "destructive",
      });
    }
  };

  // Open edit modal
  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(", "),
      image: post.imageUrl || "",
      author: post.author,
      featured: post.featured,
      published: post.published,
    });
    setImagePreview(post.imageUrl || "");
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (postId: string) => {
    setDeletingPostId(postId);
    setIsDeleteDialogOpen(true);
  };

  // Reset create form
  const resetCreateForm = () => {
    setFormData(initialFormData);
    setImagePreview("");
    setImageFile(null);
    setFormErrors({});
    setIsCreateModalOpen(false);
  };

  // Reset edit form
  const resetEditForm = () => {
    setFormData(initialFormData);
    setImagePreview("");
    setImageFile(null);
    setEditingPost(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-cyan-400" />
            Blog Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your blog posts with real-time updates. Changes are instantly
            reflected on the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshData()}
            disabled={isLoading}
            className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all h-10 px-3"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0 h-10 px-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
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
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Posts
            </CardTitle>
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{posts.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Published
            </CardTitle>
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
              <Eye className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {posts.filter((post) => post.published).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Featured
            </CardTitle>
            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {posts.filter((post) => post.featured).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Drafts
            </CardTitle>
            <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center border border-slate-500/20">
              <EyeOff className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {posts.filter((post) => !post.published).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 text-white shadow-lg">
        <CardHeader className="pb-3 border-b border-slate-700/50">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-slate-900/40 px-4 py-2 rounded-lg border border-slate-700/50">
                <Switch
                  id="featured-filter"
                  checked={showOnlyFeatured}
                  onCheckedChange={setShowOnlyFeatured}
                  className="data-[state=checked]:bg-cyan-500 bg-slate-600 border-transparent [&>span]:bg-white"
                />
                <Label
                  htmlFor="featured-filter"
                  className="text-sm text-slate-300 font-medium cursor-pointer"
                >
                  Featured Only
                </Label>
              </div>
              <div className="flex items-center space-x-3 bg-slate-900/40 px-4 py-2 rounded-lg border border-slate-700/50">
                <Switch
                  id="published-filter"
                  checked={showOnlyPublished}
                  onCheckedChange={setShowOnlyPublished}
                  className="data-[state=checked]:bg-cyan-500 bg-slate-600 border-transparent [&>span]:bg-white"
                />
                <Label
                  htmlFor="published-filter"
                  className="text-sm text-slate-300 font-medium cursor-pointer"
                >
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
          <Card>
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
            <Card
              key={post.id}
              className="overflow-hidden bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 text-white shadow-lg group"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Post Image */}
                  <div className="lg:w-56 flex-shrink-0 relative rounded-xl overflow-hidden border border-slate-700/50 group/image">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-40 lg:h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title and Description */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-semibold line-clamp-2 text-white group-hover:text-cyan-400 transition-colors">
                            {post.title}
                          </h3>
                          <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Post Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50 mb-4 inline-flex">
                        <div className="flex items-center gap-1.5 border-r border-slate-700 pr-4">
                          <User className="h-3.5 w-3.5 text-cyan-500/70" />
                          <span className="text-slate-300">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 border-r border-slate-700 pr-4">
                          <Calendar className="h-3.5 w-3.5 text-cyan-500/70" />
                          <span className="text-slate-300">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-cyan-500/70" />
                          <span className="text-slate-300">
                            {post.readTime} min read
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-800 border-slate-700 text-slate-300 text-[11px] hover:bg-slate-700 transition-colors"
                          >
                            <Tag className="h-2.5 w-2.5 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="bg-slate-800 border-slate-700 text-slate-400 text-[11px]"
                          >
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-700/50">
                      <Button
                        variant={post.featured ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`text-xs h-8 ${post.featured ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}
                      >
                        {post.featured ? (
                          <Star className="h-3.5 w-3.5 mr-1.5 fill-yellow-400" />
                        ) : (
                          <Star className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {post.featured ? "Featured" : "Feature"}
                      </Button>

                      <Button
                        variant={post.published ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePublished(post.id)}
                        className={`text-xs h-8 ${post.published ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}
                      >
                        {post.published ? (
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {post.published ? "Published" : "Publish"}
                      </Button>

                      <div className="flex-1"></div>

                      <div className="opacity-80 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(post)}
                          className="h-8 bg-slate-800/50 border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(post.id)}
                          className="h-8 bg-slate-800/50 border-red-900/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
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
            <Button
              variant="outline"
              onClick={resetCreateForm}
              disabled={isSubmitting}
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0"
            >
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
        <InterviewExperienceForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
        />
      </EnhancedModal>

      {/* Edit Modal */}
      <EnhancedModal
        isOpen={isEditModalOpen}
        onClose={resetEditForm}
        title="Edit Blog Post"
        size="lg"
        footerActions={
          <>
            <Button
              variant="outline"
              onClick={resetEditForm}
              disabled={isSubmitting}
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleEditPost}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0"
            >
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
        <InterviewExperienceForm
          formData={formData}
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          handleImageRemove={handleImageRemove}
        />
      </EnhancedModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone and will immediately remove the post from the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingPostId(null)}>
              Cancel
            </AlertDialogCancel>
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
  );
};

export default InterviewExperienceManager;
