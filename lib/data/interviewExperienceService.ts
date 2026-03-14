
import { AddInterviewExperienceData } from '@/types/interface/interviewExperience/AddInterviewExperienceData.interface';
import { InterviewExperience } from '@/types/interface/interviewExperience/InterviewExperience.interface';
import { api } from '@/lib/axios'

export const InterviewExperienceService = {

    async getAllBlogPosts(): Promise<InterviewExperience[]> {
        try {
            const { data } = await api.get<InterviewExperience[]>('/api/interview-experiences')
            return data ?? [];
        } catch (error) {
            console.error('Error in getAllBlogPosts:', error)
            throw error
        }
    },

    // Get blog post by ID
    getBlogPostById: async (id: string): Promise<InterviewExperience | null> => {
        try {
            const { data } = await api.get<InterviewExperience>(`/api/interview-experiences/${id}`)
            return data || null;
        } catch (error) {
            console.error('Error in getBlogPostById:', error)
            return null
        }
    },

    // Create new interview experience
    createInterviewExperience: async (addInterviewExperienceData: AddInterviewExperienceData): Promise<InterviewExperience | null> => {
        try {
            const { data } = await api.post<InterviewExperience>('/api/interview-experiences', addInterviewExperienceData)
            return data || null;
        } catch (error) {
            console.error('Error in createInterviewExperience:', error)
            return null
        }
    },

    // Delete interview experience
    deleteBlogPost: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/api/interview-experiences/${id}`)
            return true
        } catch (error) {
            console.error('Error in deleteBlogPost:', error)
            return false
        }
    },
}
