import { EnergyLog, PipelineProject, Task } from '../types';

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
