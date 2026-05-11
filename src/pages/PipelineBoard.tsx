import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PipelineStage, PipelineProject, Task, TaskEnergyRequired, TaskBestTime } from '../types';
import { Plus, Edit2, Trash2, Star, ChevronDown, ChevronRight, CheckCircle2, Circle, Zap } from 'lucide-react';

const STAGES: PipelineStage[] = ['Idea', 'Defined', 'Researching', 'Doing', 'Testing', 'Done', 'Archived'];

const ENERGY_BADGE: Record<TaskEnergyRequired, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
};

export default function PipelineBoard() {
  const {
    projects, addProject, updateProject, deleteProject,
    tasks, addTask, deleteTask, toggleTask,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<Partial<PipelineProject>>({
    title: '',
    track: 'Master Course Study',
    stage: 'Idea',
    depthScore: 5,
    expectedOutput: '',
    killCriteria: '',
    notes: '',
    importance: 1,
    focusTime: ''
  });

  const tasksByProject = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of tasks) {
      if (!t.pipelineId) continue;
      const list = m.get(t.pipelineId) ?? [];
      list.push(t);
      m.set(t.pipelineId, list);
    }
    return m;
  }, [tasks]);

  const unlinkedTasks = useMemo(
    () => tasks.filter(t => !t.pipelineId || !projects.some(p => p.id === t.pipelineId)),
    [tasks, projects],
  );

  const handleEdit = (project: PipelineProject) => {
    setFormData(project);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject({ ...formData, id: editingId } as PipelineProject);
    } else {
      addProject({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as PipelineProject);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '', track: 'Master Course Study', stage: 'Idea', depthScore: 5, expectedOutput: '', killCriteria: '', notes: '', importance: 1, focusTime: ''
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

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Pipeline Board</h2>
          <p className="text-zinc-500 mt-1">Project lifecycle + energy-aware execution. Tasks live inside projects.</p>
        </header>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', track: 'Master Course Study', stage: 'Idea', depthScore: 5, expectedOutput: '', killCriteria: '', notes: '', importance: 1, focusTime: '' });
            setShowForm(!showForm);
          }}
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
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Track</label>
                <select value={formData.track} onChange={e => setFormData({ ...formData, track: e.target.value as any })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Master Course Study">Master Course Study</option>
                  <option value="AI Agent Engineering">AI Agent Engineering</option>
                  <option value="Quant / BTC">Quant / BTC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Stage</label>
                <select value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value as any })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Depth Score (1-10)</label>
                <input type="number" min="1" max="10" required value={formData.depthScore} onChange={e => setFormData({ ...formData, depthScore: parseInt(e.target.value) })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Importance (1-3 Stars)</label>
                <select value={formData.importance} onChange={e => setFormData({ ...formData, importance: parseInt(e.target.value) as any })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Focus Time Slot (Optional)</label>
                <input type="text" value={formData.focusTime} onChange={e => setFormData({ ...formData, focusTime: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. 09:00 - 11:30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Expected Output</label>
                <input type="text" value={formData.expectedOutput} onChange={e => setFormData({ ...formData, expectedOutput: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. Formula and basic python script" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Kill Criteria (Crucial)</label>
                <input type="text" required value={formData.killCriteria} onChange={e => setFormData({ ...formData, killCriteria: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. 2 weeks no progress" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Create Project'}
              </button>
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
                className="w-80 bg-zinc-100/50 rounded-xl border border-zinc-200 flex flex-col"
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
                  {stageProjects.map(project => {
                    const projectTasks = tasksByProject.get(project.id) ?? [];
                    const doneCount = projectTasks.filter(t => t.completed).length;
                    const isExpanded = expanded.has(project.id);
                    return (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors group"
                      >
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, project.id)}
                          className="p-3 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-zinc-500">{project.track}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(project)} className="text-zinc-400 hover:text-zinc-900"><Edit2 size={14} /></button>
                              <button onClick={() => deleteProject(project.id)} className="text-zinc-400 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-2 leading-tight">{project.title}</h4>

                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3].map(star => (
                              <Star key={star} size={12} className={star <= (project.importance || 1) ? "fill-amber-400 text-amber-400" : "text-zinc-200"} />
                            ))}
                          </div>

                          {project.expectedOutput && (
                            <p className="text-xs text-zinc-600 mb-2 line-clamp-2">
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

                        <button
                          onClick={() => toggleExpanded(project.id)}
                          className="w-full flex items-center justify-between px-3 py-2 border-t border-zinc-100 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            Tasks
                            <span className="font-mono text-[10px] text-zinc-500">
                              {projectTasks.length === 0 ? '—' : `${doneCount}/${projectTasks.length}`}
                            </span>
                          </span>
                          {projectTasks.length > 0 && (
                            <div className="w-16 h-1 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${(doneCount / projectTasks.length) * 100}%` }}
                              />
                            </div>
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-zinc-100 px-3 py-2 space-y-1.5 bg-zinc-50/40">
                            {projectTasks.length === 0 && (
                              <div className="text-[11px] text-zinc-400 italic py-1">No tasks yet.</div>
                            )}
                            {projectTasks.map(task => (
                              <div key={task.id}>
                                <TaskRow
                                  task={task}
                                  onToggle={() => toggleTask(task.id)}
                                  onDelete={() => deleteTask(task.id)}
                                />
                              </div>
                            ))}
                            <InlineAddTask
                              onAdd={(t) =>
                                addTask({
                                  ...t,
                                  id: Math.random().toString(36).slice(2, 11),
                                  pipelineId: project.id,
                                  completed: false,
                                  date: new Date().toISOString().split('T')[0],
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlinked tasks — surface tasks whose project was deleted or never linked */}
      {unlinkedTasks.length > 0 && (
        <div className="bg-white border border-orange-200 rounded-xl p-4 shrink-0">
          <div className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
            <Zap size={14} className="text-orange-500" />
            Unlinked tasks <span className="text-xs text-zinc-500 font-normal">({unlinkedTasks.length})</span>
          </div>
          <p className="text-xs text-zinc-500 mb-3">Tasks not bound to a project. Link them or discard — orphaned tasks become noise.</p>
          <div className="space-y-1.5">
            {unlinkedTasks.map(task => (
              <div key={task.id}>
                <TaskRow
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  return (
    <div className="flex items-center gap-2 group/task text-xs">
      <button onClick={onToggle} className="text-zinc-400 hover:text-zinc-900 shrink-0">
        {task.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} />}
      </button>
      <span className={`flex-1 truncate ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
        {task.title}
      </span>
      <span className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded ${ENERGY_BADGE[task.energyRequired]}`}>
        {task.energyRequired}
      </span>
      <span className="shrink-0 text-[10px] text-zinc-500 font-mono w-12 text-right">{task.bestTime}</span>
      <button
        onClick={onDelete}
        className="text-zinc-300 hover:text-red-500 opacity-0 group-hover/task:opacity-100 transition-opacity shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

interface InlineAddTaskProps {
  onAdd: (t: { title: string; energyRequired: TaskEnergyRequired; bestTime: TaskBestTime }) => void;
}

function InlineAddTask({ onAdd }: InlineAddTaskProps) {
  const [title, setTitle] = useState('');
  const [energy, setEnergy] = useState<TaskEnergyRequired>('Medium');
  const [time, setTime] = useState<TaskBestTime>('Morning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), energyRequired: energy, bestTime: time });
    setTitle('');
    setEnergy('Medium');
    setTime('Morning');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1 pt-1.5 border-t border-zinc-200/60">
      <Plus size={12} className="text-zinc-400 shrink-0" />
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add task..."
        className="flex-1 text-xs bg-transparent outline-none placeholder:text-zinc-400 py-1"
      />
      <select
        value={energy}
        onChange={e => setEnergy(e.target.value as TaskEnergyRequired)}
        className="text-[10px] bg-white border border-zinc-200 rounded px-1 py-0.5 outline-none"
        title="Energy required"
      >
        <option value="High">High</option>
        <option value="Medium">Med</option>
        <option value="Low">Low</option>
      </select>
      <select
        value={time}
        onChange={e => setTime(e.target.value as TaskBestTime)}
        className="text-[10px] bg-white border border-zinc-200 rounded px-1 py-0.5 outline-none"
        title="Best time"
      >
        <option value="Morning">AM</option>
        <option value="Afternoon">PM</option>
        <option value="Night">Eve</option>
      </select>
    </form>
  );
}
