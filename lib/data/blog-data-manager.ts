import { api } from "@/lib/axios";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated_at: string;
  created_at: string;
  read_time: number;
  tags: string[];
  category: string;
  image: string;
  featured: boolean;
  published: boolean;
}

export const blogDataManager = {
  // Get all blog posts
  getAllBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data } = await api.get<BlogPost[]>("/api/blog-posts");
      return data ?? [];
    } catch (error) {
      console.error("Error in getAllBlogPosts:", error);
      return [];
    }
  },

  // Get published blog posts only
  getPublishedBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data } = await api.get<BlogPost[]>("/api/blog-posts/published");
      return data ?? [];
    } catch (error) {
      console.error("Error in getPublishedBlogPosts:", error);
      return [];
    }
  },

  // Get featured blog posts
  getFeaturedBlogPosts: async (limit?: number): Promise<BlogPost[]> => {
    try {
      const { data } = await api.get<BlogPost[]>("/api/blog-posts/featured");
      const featured = data ?? [];
      return limit ? featured.slice(0, limit) : featured;
    } catch (error) {
      console.error("Error in getFeaturedBlogPosts:", error);
      return [];
    }
  },

  // Get blog post by slug
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data } = await api.get<BlogPost>(`/api/blog-posts/slug/${slug}`);
      return data || null;
    } catch (error) {
      console.error("Error in getBlogPostBySlug:", error);
      return null;
    }
  },

  // Get blog post by ID
  getBlogPostById: async (id: string): Promise<BlogPost | null> => {
    try {
      const { data } = await api.get<BlogPost>(`/api/blog-posts/${id}`);
      return data || null;
    } catch (error) {
      console.error("Error in getBlogPostById:", error);
      return null;
    }
  },

  // Create new blog post
  async createBlogPost(postData: Partial<BlogPost>, imageFile?: File) {
    try {
      const formData = new FormData();

      // append all text fields
      Object.entries(postData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // append image file
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.post(
        "http://localhost:8080/api/posts",
        formData,
      );

      return response.data;
    } catch (error) {
      console.error("Error creating blog post:", error);
      return null;
    }
  },

  // Update blog post
  updateBlogPost: async (
    id: string,
    updates: Partial<BlogPost>,
    imageFile?: File,
  ): Promise<BlogPost | null> => {
    try {
      const formData = new FormData();

      Object.keys(updates).forEach((key) => {
        const value = updates[key as keyof BlogPost];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const { data } = await api.put<BlogPost>(
        `/api/blog-posts/${id}`,
        formData,
      );
      return data || null;
    } catch (error) {
      console.error("Error in updateBlogPost:", error);
      return null;
    }
  },

  // Delete blog post
  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/blog-posts/${id}`);
      return true;
    } catch (error) {
      console.error("Error in deleteBlogPost:", error);
      return false;
    }
  },

  // Toggle featured status
  toggleFeatured: async (id: string): Promise<boolean> => {
    try {
      const currentPost = await blogDataManager.getBlogPostById(id);
      if (!currentPost) return false;
      await api.put(`/api/blog-posts/${id}`, {
        featured: !currentPost.featured,
      });
      return true;
    } catch (error) {
      console.error("Error in toggleFeatured:", error);
      return false;
    }
  },

  // Toggle published status
  togglePublished: async (id: string): Promise<boolean> => {
    try {
      const currentPost = await blogDataManager.getBlogPostById(id);
      if (!currentPost) return false;
      await api.put(`/api/blog-posts/${id}`, {
        published: !currentPost.published,
      });
      return true;
    } catch (error) {
      console.error("Error in togglePublished:", error);
      return false;
    }
  },

  // Search blog posts
  searchBlogPosts: async (
    query: string,
    category?: string,
  ): Promise<BlogPost[]> => {
    try {
      const params: Record<string, string> = {};
      if (query.trim()) params.search = query;
      if (category && category !== "All") params.category = category;

      const { data } = await api.get<BlogPost[]>("/api/blog-posts/search", {
        params,
      });
      return data ?? [];
    } catch (error) {
      console.error("Error in searchBlogPosts:", error);
      return [];
    }
  },

  // Get blog posts by category
  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    if (category === "All") {
      return blogDataManager.getPublishedBlogPosts();
    }

    try {
      const { data } = await api.get<BlogPost[]>("/api/blog-posts/category", {
        params: { category },
      });
      return data ?? [];
    } catch (error) {
      console.error("Error in getBlogPostsByCategory:", error);
      return [];
    }
  },
};
