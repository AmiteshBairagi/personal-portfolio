import { api } from "@/lib/axios";

// Matches Spring Boot Blog model (Jackson camelCase serialization)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  readTime: number;
  tags: string[];
  category: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
}

export const blogDataManager = {
  // GET /api/get-all-blogs
  getAllBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data } = await api.get<BlogPost[]>("/api/get-all-blogs");
      return data ?? [];
    } catch (error) {
      console.error("Error in getAllBlogPosts:", error);
      return [];
    }
  },

  // GET /api/get-blogs-by-category/{category}
  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    if (category === "All") {
      return blogDataManager.getAllBlogPosts();
    }

    try {
      const { data } = await api.get<BlogPost[]>(
        `/api/get-blogs-by-category/${encodeURIComponent(category)}`,
      );
      return data ?? [];
    } catch (error) {
      console.error("Error in getBlogPostsByCategory:", error);
      return [];
    }
  },

  // POST /api/add-blog
  // Backend expects: @RequestPart("data") Blog + @RequestPart("image") MultipartFile
  createBlogPost: async (
    postData: Partial<BlogPost>,
    imageFile?: File,
  ): Promise<BlogPost | null> => {
    try {
      const formData = new FormData();

      // Send the blog data as a JSON blob with content type application/json
      const blogJson = JSON.stringify(postData);
      formData.append(
        "data",
        new Blob([blogJson], { type: "application/json" }),
      );

      // Append image file
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await api.post<BlogPost>("/api/add-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data || null;
    } catch (error) {
      console.error("Error creating blog post:", error);
      return null;
    }
  },

  // DELETE /api/delete-blog/{id}
  deleteBlogPost: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/delete-blog/${id}`);
      return true;
    } catch (error) {
      console.error("Error in deleteBlogPost:", error);
      return false;
    }
  },

  // --- Placeholder methods (backend endpoints not yet available) ---

  // Update blog post (needs backend endpoint)
  updateBlogPost: async (
    id: string,
    updates: Partial<BlogPost>,
    imageFile?: File,
  ): Promise<BlogPost | null> => {
    try {
      const formData = new FormData();

      const blogJson = JSON.stringify(updates);
      formData.append(
        "data",
        new Blob([blogJson], { type: "application/json" }),
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // TODO: Update this endpoint when backend adds PUT/PATCH support
      const { data } = await api.put<BlogPost>(
        `/api/update-blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data || null;
    } catch (error) {
      console.error("Error in updateBlogPost:", error);
      return null;
    }
  },

  // Toggle featured status (needs backend endpoint)
  toggleFeatured: async (id: string): Promise<boolean> => {
    try {
      // TODO: Update when backend adds toggle/update endpoint
      await api.put(`/api/update-blog/${id}/featured`);
      return true;
    } catch (error) {
      console.error("Error in toggleFeatured:", error);
      return false;
    }
  },

  // Toggle published status (needs backend endpoint)
  togglePublished: async (id: string): Promise<boolean> => {
    try {
      // TODO: Update when backend adds toggle/update endpoint
      await api.put(`/api/update-blog/${id}/published`);
      return true;
    } catch (error) {
      console.error("Error in togglePublished:", error);
      return false;
    }
  },
};
