import { EnergyLog, PipelineProject, Task, ParkingLotItem, WeeklyPlan } from '../types';

export const mockEnergyLogs: EnergyLog[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    sleepHours: 7.5,
    physicalState: 'Good',
    mentalClarity: 8,
    stressLevel: 4,
    deepWorkDone: true,
    notes: 'Good sleep, felt focused.',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    sleepHours: 6,
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
    stage: 'Building',
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
