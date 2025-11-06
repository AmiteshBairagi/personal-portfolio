// src/types/InterviewExperience.ts
export interface AddInterviewExperienceData {
  companyName: string;
  jobProfile: string;
  interviewDate: string; // ISO string or formatted date
  rounds: number;
  qualifiedRounds: number;
  finalResult: "Selected" | "Rejected" | "Pending";
  featured: boolean;
  description: string; // Full story / experience text
  excerpt: string; // Short summary for card view
}
