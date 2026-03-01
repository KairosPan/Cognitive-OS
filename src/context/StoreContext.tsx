import React, { createContext, useState, useContext } from 'react';
import { EnergyLog, PipelineProject, Task } from '../types';
import { mockEnergyLogs, mockProjects, mockTasks } from '../data/mockData';

interface StoreContextType {
  energyLogs: EnergyLog[];
  projects: PipelineProject[];
  tasks: Task[];
  addEnergyLog: (log: EnergyLog) => void;
  addProject: (project: PipelineProject) => void;
  updateProject: (project: PipelineProject) => void;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(mockEnergyLogs);
  const [projects, setProjects] = useState<PipelineProject[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const addEnergyLog = (log: EnergyLog) => setEnergyLogs([log, ...energyLogs]);
  const addProject = (project: PipelineProject) => setProjects([project, ...projects]);
  const updateProject = (updated: PipelineProject) => setProjects(projects.map(p => p.id === updated.id ? updated : p));
  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const toggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <StoreContext.Provider value={{ energyLogs, projects, tasks, addEnergyLog, addProject, updateProject, addTask, toggleTask }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
