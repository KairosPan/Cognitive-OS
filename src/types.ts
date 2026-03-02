export type Track = 'Master Course Study' | 'AI Agent Engineering' | 'Quant / BTC' | 'Other';

export type PhysicalState = 'Good' | 'Normal' | 'Low';

export interface EnergyLog {
  id: string;
  date: string;
  sleepHours: number;
  physicalState: PhysicalState;
  mentalClarity: number; // 1-10
  stressLevel: number; // 1-10
  deepWorkDone: boolean;
  notes: string;
}

export type PipelineStage = 'Idea' | 'Defined' | 'Researching' | 'Building' | 'Testing' | 'Done' | 'Archived';
export type Importance = 1 | 2 | 3;

export interface PipelineProject {
  id: string;
  title: string;
  track: Track;
  stage: PipelineStage;
  depthScore: number; // 1-10
  expectedOutput: string;
  killCriteria: string;
  notes: string;
  importance?: Importance;
  focusTime?: string;
}

export type TaskEnergyRequired = 'High' | 'Medium' | 'Low';
export type TaskBestTime = 'Morning' | 'Afternoon' | 'Night';

export interface Task {
  id: string;
  title: string;
  energyRequired: TaskEnergyRequired;
  bestTime: TaskBestTime;
  pipelineId?: string;
  date: string;
  completed: boolean;
}

export type ParkingCategory = 'Startup' | 'Research' | 'Trading' | 'Personal';
export type Urgency = 'Low' | 'Medium' | 'High';

export interface ParkingLotItem {
  id: string;
  idea: string;
  category: ParkingCategory;
  urgency: Urgency;
  linkedTrack?: Track | '';
  reviewWeek: string;
}

export interface WeeklyPlan {
  focus1: string;
  focus2: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}
