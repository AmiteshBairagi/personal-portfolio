
import { AddInterviewExperienceData } from '@/types/interface/interviewExperience/addInterviewExperienceData.interface';
import { InterviewExperience } from '@/types/interface/interviewExperience/InterviewExperience.interface';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export const InterviewExperienceService = {

    async getAllBlogPosts(): Promise<InterviewExperience[]> {

        try {
            const { data, error } = await supabase
                .from('interview_experiences')
                .select('*')
            if (error) {
                console.error('Error fetching interview experiences:', error)
            }

            return (data ?? []) as InterviewExperience[];

        } catch (error) {
            console.error('Error in getAllBlogPosts:', error)
            throw error
        }
    },



    // Get blog post by ID
    getBlogPostById: async (id: string): Promise<InterviewExperience | null> => {
        try {
            const { data, error } = await supabase
                .from('interview_experiences')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                console.error('Error fetching interview experience by ID:', error)
                return null
            }

            return data;

        } catch (error) {
            console.error('Error in getBlogPostById:', error)
            return null
        }
    },




    // Create new blog post
    createInterviewExperience: async (addInterviewExperienceData: AddInterviewExperienceData): Promise<InterviewExperience | null> => {
        try {

            const { data, error } = await supabase
                .from('interview_experiences')
                .insert([{
                    ...addInterviewExperienceData,
                }])
                .select()
                .single()

            if (error) {
                console.error('Error creating blog post:', error)
                return null
            }


            return {
                ...data,
            }
        } catch (error) {
            console.error('Error in createBlogPost:', error)
            return null
        }
    },



    // Update blog post
    // updateBlogPost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
    //     try {
    //         // If title is being updated, regenerate slug
    //         if (updates.title) {
    //             const newSlug = updates.title
    //                 .toLowerCase()
    //                 .trim()
    //                 .replace(/[^\w\s-]/g, '')
    //                 .replace(/[\s_-]+/g, '-')
    //                 .replace(/^-+|-+$/g, '')

    //             // Check if slug is unique (excluding current post)
    //             const { data: existingPost } = await supabase
    //                 .from('blog_posts')
    //                 .select('id')
    //                 .eq('slug', newSlug)
    //                 .neq('id', id)
    //                 .single()

    //             if (!existingPost) {
    //                 updates.slug = newSlug
    //             }
    //         }

    //         // Recalculate read time if content is updated
    //         if (updates.content) {
    //             updates.read_time = Math.max(1, Math.ceil(updates.content.trim().split(/\s+/).length / 200))
    //         }

    //         const { data, error } = await supabase
    //             .from('blog_posts')
    //             .update(updates)
    //             .eq('id', id)
    //             .select()
    //             .single()

    //         if (error) {
    //             console.error('Error updating blog post:', error)
    //             return null
    //         }

    //         // Invalidate cache
    //         blogCache = null
    //         cacheTimestamp = 0

    //         return {
    //             ...data,
    //             tags: data.tags || []
    //         }
    //     } catch (error) {
    //         console.error('Error in updateBlogPost:', error)
    //         return null
    //     }
    // },



    deleteBlogPost: async (id: string): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('interview_experiences')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Error deleting blog post:', error)
                return false
            }

            return true

        } catch (error) {
            console.error('Error in deleteBlogPost:', error)
            return false
        }
    },



    

}








































// import axios from "axios";

// const API_BASE_URL = "knsrnfwb"

// class InterviewExperienceService {
//     // ✅ GET all interview experiences
//     async getAll() {
//         const response = await axios.get(API_BASE_URL);
//         return response.data;
//     }

//     // ✅ GET single interview experience by ID
//     async getById(id: string) {
//         const response = await axios.get(`${API_BASE_URL}/${id}`);
//         return response.data;
//     }

//     // ✅ CREATE new interview experience
//     async create(experienceData: any) {
//         const response = await axios.post(API_BASE_URL, experienceData);
//         return response.data;
//     }

//     // ✅ UPDATE interview experience by ID
//     async update(id: string, updatedData: any) {
//         const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
//         return response.data;
//     }

//     // ✅ DELETE interview experience by ID
//     async delete(id: string) {
//         const response = await axios.delete(`${API_BASE_URL}/${id}`);
//         return response.data;
//     }

//     // ✅ FILTER or search experiences (optional helper)
//     async search(query: string) {
//         const response = await axios.get(`${API_BASE_URL}?search=${query}`);
//         return response.data;
//     }
// }

// export default new InterviewExperienceService();
