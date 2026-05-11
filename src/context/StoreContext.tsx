import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import {
  EnergyLog, PipelineProject, Task, ParkingLotItem, WeeklyPlan,
  InfoItem, Framework, Reflection,
  StrategySignal, StrategyHypothesis, StrategyReview,
} from '../types';
import {
  mockEnergyLogs, mockProjects, mockTasks, mockParkingLot, mockWeeklyPlan,
  mockInfoItems, mockFrameworks, mockReflections,
  mockStrategySignals, mockStrategyHypotheses, mockStrategyReviews,
} from '../data/mockData';

interface StoreContextType {
  energyLogs: EnergyLog[];
  projects: PipelineProject[];
  tasks: Task[];
  parkingLotItems: ParkingLotItem[];
  weeklyPlan: WeeklyPlan;
  infoItems: InfoItem[];
  frameworks: Framework[];
  addEnergyLog: (log: EnergyLog) => void;
  addProject: (project: PipelineProject) => void;
  updateProject: (project: PipelineProject) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addParkingLotItem: (item: ParkingLotItem) => void;
  updateParkingLotItem: (item: ParkingLotItem) => void;
  deleteParkingLotItem: (id: string) => void;
  updateWeeklyPlan: (plan: WeeklyPlan) => void;
  addInfoItem: (item: InfoItem) => void;
  updateInfoItem: (item: InfoItem) => void;
  deleteInfoItem: (id: string) => void;
  addFramework: (fw: Framework) => void;
  updateFramework: (fw: Framework) => void;
  deleteFramework: (id: string) => void;
  reflections: Reflection[];
  addReflection: (r: Reflection) => void;
  updateReflection: (r: Reflection) => void;
  deleteReflection: (id: string) => void;
  // Strategy layer
  strategySignals: StrategySignal[];
  strategyHypotheses: StrategyHypothesis[];
  strategyReviews: StrategyReview[];
  addStrategySignal: (s: StrategySignal) => void;
  updateStrategySignal: (s: StrategySignal) => void;
  deleteStrategySignal: (id: string) => void;
  addStrategyHypothesis: (h: StrategyHypothesis) => void;
  updateStrategyHypothesis: (h: StrategyHypothesis) => void;
  deleteStrategyHypothesis: (id: string) => void;
  addStrategyReview: (r: StrategyReview) => void;
  updateStrategyReview: (r: StrategyReview) => void;
  deleteStrategyReview: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

async function loadFromServer() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && data.energyLogs) return data;
    }
  } catch {
    // server not available
  }
  return null;
}

function saveToServer(data: unknown) {
  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {});
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(mockEnergyLogs);
  const [projects, setProjects] = useState<PipelineProject[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [parkingLotItems, setParkingLotItems] = useState<ParkingLotItem[]>(mockParkingLot);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(mockWeeklyPlan);
  const [infoItems, setInfoItems] = useState<InfoItem[]>(mockInfoItems);
  const [frameworks, setFrameworks] = useState<Framework[]>(mockFrameworks);
  const [reflections, setReflections] = useState<Reflection[]>(mockReflections);
  const [strategySignals, setStrategySignals] = useState<StrategySignal[]>(mockStrategySignals);
  const [strategyHypotheses, setStrategyHypotheses] = useState<StrategyHypothesis[]>(mockStrategyHypotheses);
  const [strategyReviews, setStrategyReviews] = useState<StrategyReview[]>(mockStrategyReviews);
  const [loaded, setLoaded] = useState(false);
  const initialLoad = useRef(true);

  // Load data from server on mount. Server is the source of truth — always
  // adopt its arrays, even when empty, so deletions persist across reloads.
  useEffect(() => {
    loadFromServer().then((data) => {
      if (data) {
        if (Array.isArray(data.energyLogs)) setEnergyLogs(data.energyLogs);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.parkingLotItems)) setParkingLotItems(data.parkingLotItems);
        if (data.weeklyPlan && typeof data.weeklyPlan === 'object') setWeeklyPlan(data.weeklyPlan);
        if (Array.isArray(data.infoItems)) setInfoItems(data.infoItems);
        if (Array.isArray(data.frameworks)) setFrameworks(data.frameworks);
        if (Array.isArray(data.reflections)) setReflections(data.reflections);
        if (Array.isArray(data.strategySignals)) setStrategySignals(data.strategySignals);
        if (Array.isArray(data.strategyHypotheses)) setStrategyHypotheses(data.strategyHypotheses);
        if (Array.isArray(data.strategyReviews)) setStrategyReviews(data.strategyReviews);
      }
      setLoaded(true);
    });
  }, []);

  // Save to server on every change (skip initial load)
  useEffect(() => {
    if (!loaded) return;
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const data = {
      energyLogs, projects, tasks, parkingLotItems, weeklyPlan,
      infoItems, frameworks, reflections,
      strategySignals, strategyHypotheses, strategyReviews,
    };
    saveToServer(data);
  }, [
    energyLogs, projects, tasks, parkingLotItems, weeklyPlan,
    infoItems, frameworks, reflections,
    strategySignals, strategyHypotheses, strategyReviews,
    loaded,
  ]);

  const addEnergyLog = (log: EnergyLog) => setEnergyLogs([log, ...energyLogs]);
  const addProject = (project: PipelineProject) => setProjects([project, ...projects]);
  const updateProject = (updated: PipelineProject) => setProjects(projects.map(p => p.id === updated.id ? updated : p));
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const updateTask = (updated: Task) => setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const addParkingLotItem = (item: ParkingLotItem) => setParkingLotItems([item, ...parkingLotItems]);
  const updateParkingLotItem = (updated: ParkingLotItem) => setParkingLotItems(parkingLotItems.map(p => p.id === updated.id ? updated : p));
  const deleteParkingLotItem = (id: string) => setParkingLotItems(parkingLotItems.filter(p => p.id !== id));

  const updateWeeklyPlan = (plan: WeeklyPlan) => setWeeklyPlan(plan);

  const addInfoItem = (item: InfoItem) => setInfoItems([item, ...infoItems]);
  const updateInfoItem = (updated: InfoItem) => setInfoItems(infoItems.map(i => i.id === updated.id ? updated : i));
  const deleteInfoItem = (id: string) => setInfoItems(infoItems.filter(i => i.id !== id));

  const addFramework = (fw: Framework) => setFrameworks([...frameworks, fw]);
  const updateFramework = (updated: Framework) => setFrameworks(frameworks.map(f => f.id === updated.id ? updated : f));
  const deleteFramework = (id: string) => setFrameworks(frameworks.filter(f => f.id !== id));

  const addReflection = (r: Reflection) => setReflections([r, ...reflections]);
  const updateReflection = (updated: Reflection) => setReflections(reflections.map(r => r.id === updated.id ? updated : r));
  const deleteReflection = (id: string) => setReflections(reflections.filter(r => r.id !== id));

  const addStrategySignal = (s: StrategySignal) => setStrategySignals([s, ...strategySignals]);
  const updateStrategySignal = (updated: StrategySignal) => setStrategySignals(strategySignals.map(s => s.id === updated.id ? updated : s));
  const deleteStrategySignal = (id: string) => setStrategySignals(strategySignals.filter(s => s.id !== id));

  const addStrategyHypothesis = (h: StrategyHypothesis) => setStrategyHypotheses([h, ...strategyHypotheses]);
  const updateStrategyHypothesis = (updated: StrategyHypothesis) => setStrategyHypotheses(strategyHypotheses.map(h => h.id === updated.id ? updated : h));
  const deleteStrategyHypothesis = (id: string) => setStrategyHypotheses(strategyHypotheses.filter(h => h.id !== id));

  const addStrategyReview = (r: StrategyReview) => setStrategyReviews([r, ...strategyReviews]);
  const updateStrategyReview = (updated: StrategyReview) => setStrategyReviews(strategyReviews.map(r => r.id === updated.id ? updated : r));
  const deleteStrategyReview = (id: string) => setStrategyReviews(strategyReviews.filter(r => r.id !== id));

  return (
    <StoreContext.Provider value={{
      energyLogs, projects, tasks, parkingLotItems, weeklyPlan, infoItems, frameworks, reflections,
      addEnergyLog, addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask, toggleTask,
      addParkingLotItem, updateParkingLotItem, deleteParkingLotItem,
      updateWeeklyPlan,
      addInfoItem, updateInfoItem, deleteInfoItem,
      addFramework, updateFramework, deleteFramework,
      addReflection, updateReflection, deleteReflection,
      strategySignals, strategyHypotheses, strategyReviews,
      addStrategySignal, updateStrategySignal, deleteStrategySignal,
      addStrategyHypothesis, updateStrategyHypothesis, deleteStrategyHypothesis,
      addStrategyReview, updateStrategyReview, deleteStrategyReview,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
