import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Task } from '../types';
import { Plus, CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

export default function TaskEngine() {
  const { tasks, projects, addTask, updateTask, deleteTask, toggleTask } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    energyRequired: 'Medium',
    bestTime: 'Morning',
    pipelineId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleEdit = (task: Task) => {
    setFormData(task);
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTask({ ...formData, id: editingId } as Task);
    } else {
      addTask({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
      } as Task);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', energyRequired: 'Medium', bestTime: 'Morning', pipelineId: '', date: new Date().toISOString().split('T')[0] });
  };

  const activeProjects = projects.filter(p => p.stage !== 'Archived' && p.stage !== 'Done');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Task Engine</h2>
          <p className="text-zinc-500 mt-1">Energy-aware execution. No random thoughts.</p>
        </header>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', energyRequired: 'Medium', bestTime: 'Morning', pipelineId: '', date: new Date().toISOString().split('T')[0] });
            setShowForm(!showForm);
          }}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Task Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Energy Required</label>
                <select value={formData.energyRequired} onChange={e => setFormData({...formData, energyRequired: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Best Time</label>
                <select value={formData.bestTime} onChange={e => setFormData({...formData, bestTime: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Scheduled Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Pipeline Link (Optional)</label>
                <select value={formData.pipelineId} onChange={e => setFormData({...formData, pipelineId: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="">-- No Link --</option>
                  {activeProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex gap-4 text-sm font-medium text-zinc-500">
          <div className="w-8"></div>
          <div className="flex-1">Task</div>
          <div className="w-32">Energy</div>
          <div className="w-32">Time</div>
          <div className="w-48">Pipeline</div>
          <div className="w-32">Date</div>
          <div className="w-16"></div>
        </div>
        <div className="divide-y divide-zinc-200">
          {tasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(task => {
            const project = projects.find(p => p.id === task.pipelineId);
            return (
              <div key={task.id} className={`p-4 flex items-center gap-4 transition-colors hover:bg-zinc-50 group ${task.completed ? 'opacity-60' : ''}`}>
                <button onClick={() => toggleTask(task.id)} className="w-8 flex justify-center text-zinc-400 hover:text-zinc-900 transition-colors">
                  {task.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle />}
                </button>
                <div className={`flex-1 font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-900'}`}>
                  {task.title}
                </div>
                <div className="w-32">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.energyRequired === 'High' ? 'bg-red-100 text-red-700' :
                    task.energyRequired === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {task.energyRequired}
                  </span>
                </div>
                <div className="w-32 text-sm text-zinc-600">
                  {task.bestTime}
                </div>
                <div className="w-48 text-sm text-zinc-600 truncate">
                  {project ? (
                    <span className="bg-zinc-100 px-2 py-1 rounded text-xs">{project.title}</span>
                  ) : (
                    <span className="text-zinc-400 italic">Unlinked</span>
                  )}
                </div>
                <div className="w-32 text-sm text-zinc-600 font-mono">
                  {task.date}
                </div>
                <div className="w-16 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(task)} className="text-zinc-400 hover:text-zinc-900"><Edit2 size={16} /></button>
                  <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-zinc-500">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
