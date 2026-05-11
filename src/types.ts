export type Track = 'Master Course Study' | 'AI Agent Engineering' | 'Quant / BTC' | 'Other';

export type PhysicalState = 'Good' | 'Normal' | 'Low';

export interface EnergyLog {
  id: string;
  date: string;
  sleepStart: string;    // "HH:MM", local time
  sleepEnd: string;      // "HH:MM", local time
  physicalState: PhysicalState;
  mentalClarity: number; // 1-10
  stressLevel: number;   // 1-10
  deepWorkDone: boolean;
  notes: string;
}

export type PipelineStage = 'Idea' | 'Defined' | 'Researching' | 'Doing' | 'Testing' | 'Done' | 'Archived';
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

// --- Information Firewall ---

export type InfoTier = 1 | 2 | 3;
export type OutputType = 'note' | 'judgment' | 'decision' | 'action' | 'artifact';
export type InfoStatus = 'blocked' | 'processed';

export interface InfoItem {
  id: string;
  source: string;          // e.g. "Customer call", "AI Twitter", "Paper", "Podcast"
  tier: InfoTier;          // 1=Mission Critical, 2=Strategic Optional, 3=Entertainment
  rawInput: string;        // the raw information
  frameworkId?: string;    // compression mapping to a Framework
  outputType?: OutputType; // bound output: note/judgment/decision/action/artifact
  outputContent?: string;  // the actual output
  linkedProjectId?: string;
  linkedTrack?: Track | '';
  date: string;
  status: InfoStatus;      // blocked = no output yet; processed = output bound
}

export interface Framework {
  id: string;
  name: string;            // e.g. "Distribution", "Retention", "Leverage"
  description: string;
}

// --- Strategy Layer (between Information Input and Execution) ---
//
// Founder thesis: creating is continuous Bayesian updating, not static
// optimization. New information should update the world model — but only
// when it has the right "strategic permission level". Signal repeats; FOMO
// is fake. This layer governs what is allowed to change strategy vs. what
// can only adjust tactics vs. what is plain noise.

export type StrategyLevel = 1 | 2 | 3;
// 1 = Noise              → no strategy/tactics change, only curiosity
// 2 = Tactical adjustment → can change execution / feature / stack, NOT mission
// 3 = Strategic signal    → can change strategy / mission

export type SignalCategory =
  | 'user_behavior'         // L3 — what users actually do
  | 'distribution_reality'  // L3 — CAC / acquisition channel truth
  | 'platform_shift'        // L3 — paradigm change (mobile → cloud → AI)
  | 'regulatory'            // L3 — legal / infra change
  | 'tech_discontinuity'    // L3 — moat-destroying tech
  | 'tactical_friction'     // L2 — onboarding / UX friction
  | 'tool_efficiency'       // L2 — new tool/API improves execution
  | 'competitor_move'       // L2 — pricing / feature shifts
  | 'vc_sentiment'          // L1 — fundraising vibes
  | 'trend_chatter'         // L1 — Twitter / threads / hype
  | 'meme_noise';           // L1 — "XX will replace everything"

export type SignalDecision =
  | 'pending'           // not yet reviewed
  | 'monitor'           // not enough evidence — wait for repeat
  | 'rejected'          // confirmed noise — do not act
  | 'tactical_adjust'   // adjust execution, not mission
  | 'strategic_update'; // update strategy / hypothesis

export interface StrategySignal {
  id: string;
  date: string;
  source: string;             // e.g. "Customer call", "Twitter", "Investor"
  description: string;
  category: SignalCategory;
  permissionLevel: StrategyLevel;
  repeatedCount: number;      // signal repeats → 真正重要的会出现两次
  evidence: string;
  decision: SignalDecision;
  decisionNote?: string;
  linkedInfoId?: string;
  linkedHypothesisId?: string;
}

export type HypothesisDomain =
  | 'user'
  | 'distribution'
  | 'paradigm'
  | 'moat'
  | 'market_timing'
  | 'technology';

export type HypothesisStatus = 'active' | 'validated' | 'invalidated' | 'pivoted';

export interface StrategyHypothesis {
  id: string;
  statement: string;          // "We believe X because Y"
  domain: HypothesisDomain;
  confidence: number;         // 0-100 — Bayesian prior
  evidenceFor: string;
  evidenceAgainst: string;
  lastReviewed: string;
  status: HypothesisStatus;
}

export type ReviewCadence = 'weekly' | 'monthly' | 'quarterly';
export type ReviewDecision =
  | 'execute_as_planned'
  | 'tactical_adjust'
  | 'strategic_pivot'
  | 'paradigm_change';

export interface StrategyReview {
  id: string;
  date: string;
  cadence: ReviewCadence;
  worldModelDelta: string;
  signalsProcessed: string[];
  hypothesesUpdated: string[];
  decision: ReviewDecision;
  notes: string;
}

// --- Reflection / Founder Principles ---

export type ReflectionCategory =
  | 'Interpersonal'   // 人情世故
  | 'Decision'        // 决策复盘
  | 'Mindset'         // 心态 / 情绪
  | 'Lesson'          // 教训
  | 'Principle'       // 已升格为原则
  | 'Other';

export type ReflectionWeight = 'Fleeting' | 'Notable' | 'Permanent';

export interface Reflection {
  id: string;
  date: string;
  category: ReflectionCategory;
  trigger: string;          // event/context that prompted the reflection
  insight: string;          // the reflection body
  principle?: string;       // one-line distilled principle (optional)
  linkedProjectId?: string;
  linkedPeople?: string;
  weight: ReflectionWeight;
}
