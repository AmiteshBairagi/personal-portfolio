import { InterviewExperienceService } from "@/lib/data/interviewExperienceService";
import { AddInterviewExperienceData } from "@/types/interface/interviewExperience/addInterviewExperienceData.interface";
import { InterviewExperience } from "@/types/interface/interviewExperience/InterviewExperience.interface";
import { useCallback } from "react";

export function useInterviewExperience() {


    const addInterviewExperience = useCallback(async (addInterviewExperienceData: AddInterviewExperienceData): Promise<InterviewExperience | null> => {
        try{
            const interviewExperience = await InterviewExperienceService.createInterviewExperience(addInterviewExperienceData);
            return interviewExperience;
        }catch(error){
            console.error("Failed to create interview experience", error);
            return null;
        }

    }, [])

    return { addInterviewExperience };
}