export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type AssetType = 'Video' | 'Doc' | 'Sandbox';
export type LearningStyle = 'Visual' | 'Text' | 'Hands-on';
export type Status = 'Locked' | 'Pending' | 'In-Progress' | 'Completed' | 'Failed';
export type Role = 'Admin' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  learningPreference: LearningStyle;
  streak: number;
  xp: number;
  avgScore: number;
  hoursLearned: number;
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  durationMinutes: number; 
  contentUrl?: string; 
  learningObjectives: string[];
}

export interface Assignment {
  id: string;
  userId: string;
  assetId: string;
  assignedBy: string;
  assignedDate: string;
  status: Status;
  progress: number; // 0-100
  score?: number;
  completedDate?: string;
  attempts: number;
}

export interface AnalyticsSummary {
  totalEmployees: number;
  totalAssets: number;
  avgScore: number;
  completionRate: number;
}

export interface LearningPathItem {
  id: string;
  assetId: string;
  status: Status;
  isRemedial?: boolean;
  isFastTracked?: boolean;
}

export interface UserProgress {
  quizScore?: number;
}