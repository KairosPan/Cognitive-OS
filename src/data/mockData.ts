import {
  EnergyLog, PipelineProject, Task, ParkingLotItem, WeeklyPlan,
  InfoItem, Framework, Reflection,
  StrategySignal, StrategyHypothesis, StrategyReview,
} from '../types';

export const mockEnergyLogs: EnergyLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    sleepStart: '23:30',
    sleepEnd: '07:00',
    physicalState: 'Good',
    mentalClarity: 8,
    stressLevel: 4,
    deepWorkDone: true,
    notes: 'Good sleep, felt focused.',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    sleepStart: '01:00',
    sleepEnd: '07:00',
    physicalState: 'Normal',
    mentalClarity: 5,
    stressLevel: 7,
    deepWorkDone: false,
    notes: 'A bit stressed about deadlines.',
  }
];

export const mockProjects: PipelineProject[] = [
  {
    id: 'p1',
    title: 'NHPP Likelihood Derivation',
    track: 'Quant / BTC',
    stage: 'Researching',
    depthScore: 9,
    expectedOutput: 'Formula and basic python script',
    killCriteria: '2 weeks no progress',
    notes: 'Need to review stochastic processes.',
    importance: 3,
    focusTime: '09:00 - 11:30',
  },
  {
    id: 'p2',
    title: 'Agent Memory Architecture',
    track: 'AI Agent Engineering',
    stage: 'Doing',
    depthScore: 8,
    expectedOutput: 'Working prototype with vector DB',
    killCriteria: 'If latency > 2s, rethink approach',
    notes: 'Using Pinecone for now.',
    importance: 2,
    focusTime: '14:00 - 16:00',
  },
  {
    id: 'p3',
    title: 'Read "Deep Work"',
    track: 'Other',
    stage: 'Idea',
    depthScore: 4,
    expectedOutput: 'Summary notes',
    killCriteria: 'N/A',
    notes: '',
    importance: 1,
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Write simulation for NHPP',
    energyRequired: 'High',
    bestTime: 'Morning',
    pipelineId: 'p1',
    date: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 't2',
    title: 'Review Agent PRs',
    energyRequired: 'Medium',
    bestTime: 'Afternoon',
    pipelineId: 'p2',
    date: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 't3',
    title: 'Reply to emails',
    energyRequired: 'Low',
    bestTime: 'Night',
    date: new Date().toISOString().split('T')[0],
    completed: true,
  }
];

export const mockParkingLot: ParkingLotItem[] = [
  {
    id: 'pl1',
    idea: 'Look into new reasoning models for agents',
    category: 'Research',
    urgency: 'Medium',
    linkedTrack: 'AI Agent Engineering',
    reviewWeek: 'Week 1',
  }
];

export const mockWeeklyPlan: WeeklyPlan = {
  focus1: 'Finish NHPP Derivation',
  focus2: 'Agent Memory Prototype',
  mon: 'NHPP Math (2h)',
  tue: 'Agent Vector DB (2h)',
  wed: 'NHPP Simulation (3h)',
  thu: 'Agent Integration (2h)',
  fri: 'Weekly Review & Buffer',
};

export const mockFrameworks: Framework[] = [
  { id: 'fw1', name: 'Distribution', description: 'How users find and adopt a product.' },
  { id: 'fw2', name: 'Retention', description: 'Why users stay or leave.' },
  { id: 'fw3', name: 'Leverage', description: 'Disproportionate output per unit input.' },
  { id: 'fw4', name: 'Infra Shift', description: 'Underlying platform or technology change.' },
  { id: 'fw5', name: 'Human Incentive', description: 'What people are actually optimizing for.' },
  { id: 'fw6', name: 'Market Timing', description: 'Why now and not earlier.' },
  { id: 'fw7', name: 'Regulatory Moat', description: 'Defensibility from compliance / legal terrain.' },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const mockReflections: Reflection[] = [
  {
    id: 'r1',
    date: new Date().toISOString().split('T')[0],
    category: 'Interpersonal',
    trigger: 'Call with a senior investor who pushed back hard on the GTM angle.',
    insight: 'When someone challenges aggressively, separating "are they right?" from "are they intimidating?" matters more than counter-arguing. Felt the urge to defend; resisting it gave better information.',
    principle: 'Pressure ≠ correctness. Decouple emotion from signal.',
    weight: 'Permanent',
    linkedPeople: 'Investor X',
  },
  {
    id: 'r2',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    category: 'Decision',
    trigger: 'Spent 3 days debating the choice between two infra vendors.',
    insight: 'The decision had ~5% performance delta but we treated it like 50%. Most reversible decisions deserve much faster commit times.',
    principle: 'For reversible decisions, optimize for speed of decision, not quality of decision.',
    weight: 'Permanent',
  },
  {
    id: 'r3',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    category: 'Mindset',
    trigger: 'Felt anxious after seeing competitor launch trending on Twitter.',
    insight: 'The anxiety lasted ~2 hours and produced 0 useful output. Should have closed Twitter and gone back to product within 15 minutes.',
    weight: 'Notable',
  },
];

const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];

export const mockStrategySignals: StrategySignal[] = [
  {
    id: 'sig1',
    date: today,
    source: 'User interview x3',
    description: 'Three power users say the dashboard latency makes them avoid the morning workflow.',
    category: 'user_behavior',
    permissionLevel: 3,
    repeatedCount: 3,
    evidence: 'Same complaint from independent users across two weeks. Behavior change confirmed in retention data.',
    decision: 'strategic_update',
    decisionNote: 'Latency is now treated as a 1st-class metric, not a "feature".',
  },
  {
    id: 'sig2',
    date: yesterday,
    source: 'AI Twitter',
    description: 'New OSS agent framework launched, claims 3x faster than LangGraph.',
    category: 'trend_chatter',
    permissionLevel: 1,
    repeatedCount: 1,
    evidence: 'Single thread. No production usage data. No retention curve.',
    decision: 'rejected',
    decisionNote: 'Interesting ≠ strategically relevant. Do not change roadmap on a Twitter thread.',
  },
  {
    id: 'sig3',
    date: threeDaysAgo,
    source: 'Stripe pricing change',
    description: 'Competitor B dropped pricing to $19/mo flat.',
    category: 'competitor_move',
    permissionLevel: 2,
    repeatedCount: 1,
    evidence: 'Single observation. May or may not stick.',
    decision: 'tactical_adjust',
    decisionNote: 'Adjust pricing page wording to emphasize per-seat value. Do NOT rewrite pricing model.',
  },
  {
    id: 'sig4',
    date: today,
    source: 'OpenAI API changelog',
    description: 'New model with 5x cheaper inference + native tool use shipped.',
    category: 'tech_discontinuity',
    permissionLevel: 3,
    repeatedCount: 1,
    evidence: 'Confirmed via official changelog. Pricing reduction is real and measurable.',
    decision: 'monitor',
    decisionNote: 'Need 2 more weeks of throughput data + 1 internal benchmark before reweighting moat hypothesis.',
  },
];

export const mockStrategyHypotheses: StrategyHypothesis[] = [
  {
    id: 'hyp1',
    statement: 'Power users adopt because of inference quality, not UI polish.',
    domain: 'user',
    confidence: 70,
    evidenceFor: 'NPS comments mention "answers are right" 3:1 vs "UI feels nice".',
    evidenceAgainst: 'Two users churned citing onboarding confusion (UI), not quality.',
    lastReviewed: tenDaysAgo,
    status: 'active',
  },
  {
    id: 'hyp2',
    statement: 'Distribution will come from technical Twitter and dev forums, not paid ads.',
    domain: 'distribution',
    confidence: 45,
    evidenceFor: '12 of last 20 signups attributed to organic Twitter.',
    evidenceAgainst: 'CAC math does not yet pencil; we have only 20 data points.',
    lastReviewed: threeDaysAgo,
    status: 'active',
  },
  {
    id: 'hyp3',
    statement: 'Agentic workflows replace single-shot LLM apps within 12 months.',
    domain: 'paradigm',
    confidence: 60,
    evidenceFor: 'Adoption curves of Claude Agent SDK / OpenAI Agents API.',
    evidenceAgainst: 'Reliability still <90% on long-horizon tasks. Hype-led, not user-led.',
    lastReviewed: today,
    status: 'active',
  },
  {
    id: 'hyp4',
    statement: 'Our moat is the proprietary memory layer.',
    domain: 'moat',
    confidence: 35,
    evidenceFor: 'Two competitors lack persistent memory.',
    evidenceAgainst: 'OpenAI shipped server-side memory. Cheap inference erodes architectural complexity advantage.',
    lastReviewed: today,
    status: 'active',
  },
];

export const mockStrategyReviews: StrategyReview[] = [
  {
    id: 'rev1',
    date: tenDaysAgo,
    cadence: 'monthly',
    worldModelDelta: 'Lowered confidence in paid acquisition. Raised confidence in dev-forum distribution.',
    signalsProcessed: ['sig2'],
    hypothesesUpdated: ['hyp2'],
    decision: 'tactical_adjust',
    notes: 'Cut ad spend in half. Reallocated to dev advocacy.',
  },
  {
    id: 'rev2',
    date: threeDaysAgo,
    cadence: 'weekly',
    worldModelDelta: 'No paradigm shift in last 7 days. Latency surfaced as user-behavior signal.',
    signalsProcessed: ['sig1'],
    hypothesesUpdated: ['hyp1'],
    decision: 'execute_as_planned',
    notes: 'Adjust roadmap to prioritize latency, but no mission change.',
  },
];

export const mockInfoItems: InfoItem[] = [
  {
    id: 'info1',
    source: 'Customer call',
    tier: 1,
    rawInput: 'Top 3 users complained about latency over 2s during checkout flow.',
    frameworkId: 'fw2',
    outputType: 'decision',
    outputContent: 'Prioritize backend latency sprint this week.',
    linkedTrack: 'AI Agent Engineering',
    date: today,
    status: 'processed',
  },
  {
    id: 'info2',
    source: 'AI Twitter',
    tier: 2,
    rawInput: 'New OSS agent framework launched, claims 3x faster than LangGraph.',
    date: today,
    status: 'blocked',
  },
  {
    id: 'info3',
    source: 'All-In Podcast',
    tier: 3,
    rawInput: '"AI bubble" debate, no specific actionable insight.',
    date: yesterday,
    status: 'blocked',
  },
];
