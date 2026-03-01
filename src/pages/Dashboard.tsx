import React from 'react';
import { useStore } from '../context/StoreContext';
import { AlertCircle, BatteryCharging, BrainCircuit, Target } from 'lucide-react';

export default function Dashboard() {
  const { tasks, projects, energyLogs } = useStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayLog = energyLogs.find(log => log.date === today);
  const todayMentalClarity = todayLog?.mentalClarity || 10; // Default to 10 if no log
  
  // Rule: Mental Clarity <= 5 -> No High Energy tasks
  const canDoHighEnergy = todayMentalClarity > 5;

  const todayTasks = tasks.filter(t => t.date === today);
  
  const activeProjects = projects.filter(p => p.stage !== 'Archived' && p.stage !== 'Done');
  
  const highDepthProjects = projects.filter(p => 
    p.depthScore >= 8 && 
    (p.stage === 'Researching' || p.stage === 'Building')
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Execution Dashboard</h2>
        <p className="text-zinc-500 mt-1">Your cognitive operating system overview.</p>
      </header>

      {/* Energy Status Alert */}
      {!canDoHighEnergy && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-red-800">Low Mental Clarity Detected (≤ 5)</h4>
            <p className="text-sm text-red-600 mt-1">High Energy tasks are restricted today. Focus on Medium/Low energy tasks or recovery.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy-Aware Today View */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BatteryCharging className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-zinc-900">Energy-Aware Today</h3>
          </div>
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-zinc-500">No tasks scheduled for today.</p>
            ) : (
              todayTasks.map(task => {
                const isRestricted = task.energyRequired === 'High' && !canDoHighEnergy;
                return (
                  <div key={task.id} className={`p-3 rounded-lg border ${isRestricted ? 'bg-zinc-50 border-zinc-200 opacity-60' : 'bg-white border-zinc-200'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                        {task.title}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.energyRequired === 'High' ? 'bg-red-100 text-red-700' :
                        task.energyRequired === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {task.energyRequired}
                      </span>
                    </div>
                    {isRestricted && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle size={12} /> Restricted by energy level
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* High-Depth Focus View */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-white">High-Depth Focus</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-4">Depth Score ≥ 8 • Researching/Building</p>
          <div className="space-y-3">
            {highDepthProjects.length === 0 ? (
              <p className="text-sm text-zinc-500">No high-depth projects active.</p>
            ) : (
              highDepthProjects.map(project => (
                <div key={project.id} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-zinc-100">{project.title}</span>
                    <span className="text-xs font-mono bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">
                      Depth: {project.depthScore}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Stage: <span className="text-zinc-300">{project.stage}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Pipeline View */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-zinc-900">Active Pipeline</h3>
          </div>
          <div className="space-y-3">
            {activeProjects.length === 0 ? (
              <p className="text-sm text-zinc-500">No active projects.</p>
            ) : (
              activeProjects.map(project => (
                <div key={project.id} className="p-3 rounded-lg border border-zinc-200">
                  <div className="text-sm font-medium text-zinc-900 mb-1">{project.title}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">{project.track}</span>
                    <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                      {project.stage}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
