import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PipelineStage, PipelineProject } from '../types';
import { Plus, MoreHorizontal } from 'lucide-react';

const STAGES: PipelineStage[] = ['Idea', 'Defined', 'Researching', 'Building', 'Testing', 'Done', 'Archived'];

export default function PipelineBoard() {
  const { projects, addProject, updateProject } = useStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Partial<PipelineProject>>({
    title: '',
    track: 'Master Course Study',
    stage: 'Idea',
    depthScore: 5,
    expectedOutput: '',
    killCriteria: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as PipelineProject);
    setShowForm(false);
    setFormData({
      title: '', track: 'Master Course Study', stage: 'Idea', depthScore: 5, expectedOutput: '', killCriteria: '', notes: ''
    });
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData('projectId', projectId);
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    const project = projects.find(p => p.id === projectId);
    if (project && project.stage !== stage) {
      updateProject({ ...project, stage });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Pipeline Board</h2>
          <p className="text-zinc-500 mt-1">Lifecycle management for research and building.</p>
        </header>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm shrink-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Project Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Track</label>
                <select value={formData.track} onChange={e => setFormData({...formData, track: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Master Course Study">Master Course Study</option>
                  <option value="AI Agent Engineering">AI Agent Engineering</option>
                  <option value="Quant / BTC">Quant / BTC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Stage</label>
                <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Depth Score (1-10)</label>
                <input type="number" min="1" max="10" required value={formData.depthScore} onChange={e => setFormData({...formData, depthScore: parseInt(e.target.value)})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Expected Output</label>
                <input type="text" value={formData.expectedOutput} onChange={e => setFormData({...formData, expectedOutput: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. Formula and basic python script" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Kill Criteria (Crucial)</label>
                <input type="text" required value={formData.killCriteria} onChange={e => setFormData({...formData, killCriteria: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. 2 weeks no progress" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">Create Project</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map(stage => {
            const stageProjects = projects.filter(p => p.stage === stage);
            return (
              <div 
                key={stage} 
                className="w-72 bg-zinc-100/50 rounded-xl border border-zinc-200 flex flex-col"
                onDrop={(e) => handleDrop(e, stage)}
                onDragOver={handleDragOver}
              >
                <div className="p-3 border-b border-zinc-200 flex justify-between items-center bg-zinc-100 rounded-t-xl">
                  <h3 className="font-semibold text-zinc-700 text-sm">{stage}</h3>
                  <span className="bg-zinc-200 text-zinc-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {stageProjects.length}
                  </span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {stageProjects.map(project => (
                    <div 
                      key={project.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                      className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-zinc-500">{project.track}</span>
                        <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={14} /></button>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-900 mb-2 leading-tight">{project.title}</h4>
                      {project.expectedOutput && (
                        <p className="text-xs text-zinc-600 mb-3 line-clamp-2">
                          <span className="font-medium">Output:</span> {project.expectedOutput}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-red-500 truncate pr-2" title={project.killCriteria}>
                          Kill: {project.killCriteria || 'None'}
                        </span>
                        <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                          D:{project.depthScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
