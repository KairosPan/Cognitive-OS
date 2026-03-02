import React, { createContext, useState, useContext } from 'react';
import { EnergyLog, PipelineProject, Task, ParkingLotItem, WeeklyPlan } from '../types';
import { mockEnergyLogs, mockProjects, mockTasks, mockParkingLot, mockWeeklyPlan } from '../data/mockData';

interface StoreContextType {
  energyLogs: EnergyLog[];
  projects: PipelineProject[];
  tasks: Task[];
  parkingLotItems: ParkingLotItem[];
  weeklyPlan: WeeklyPlan;
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(mockEnergyLogs);
  const [projects, setProjects] = useState<PipelineProject[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [parkingLotItems, setParkingLotItems] = useState<ParkingLotItem[]>(mockParkingLot);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(mockWeeklyPlan);

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

  return (
    <StoreContext.Provider value={{ 
      energyLogs, projects, tasks, parkingLotItems, weeklyPlan,
      addEnergyLog, addProject, updateProject, deleteProject, 
      addTask, updateTask, deleteTask, toggleTask,
      addParkingLotItem, updateParkingLotItem, deleteParkingLotItem,
      updateWeeklyPlan
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
