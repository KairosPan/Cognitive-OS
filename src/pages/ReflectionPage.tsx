import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  BookOpen, Plus, Trash2, Edit2, Star, Sparkles, Heart, Brain, Gavel, AlertTriangle, Circle, Shuffle,
} from 'lucide-react';
import { Reflection, ReflectionCategory, ReflectionWeight } from '../types';

const CATEGORIES: ReflectionCategory[] = ['Interpersonal', 'Decision', 'Mindset', 'Lesson', 'Principle', 'Other'];
const WEIGHTS: ReflectionWeight[] = ['Fleeting', 'Notable', 'Permanent'];

const CATEGORY_META: Record<ReflectionCategory, { color: string; ring: string; Icon: any }> = {
  Interpersonal: { color: 'bg-rose-50 text-rose-700 border-rose-200',     ring: 'ring-rose-200',     Icon: Heart },
  Decision:      { color: 'bg-blue-50 text-blue-700 border-blue-200',     ring: 'ring-blue-200',     Icon: Gavel },
  Mindset:       { color: 'bg-purple-50 text-purple-700 border-purple-200', ring: 'ring-purple-200', Icon: Brain },
  Lesson:        { color: 'bg-amber-50 text-amber-700 border-amber-200',  ring: 'ring-amber-200',    Icon: AlertTriangle },
  Principle:     { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', ring: 'ring-emerald-200', Icon: Star },
  Other:         { color: 'bg-zinc-50 text-zinc-700 border-zinc-200',     ring: 'ring-zinc-200',     Icon: Circle },
};

const WEIGHT_META: Record<ReflectionWeight, { label: string; color: string }> = {
  Fleeting:  { label: 'Fleeting',  color: 'text-zinc-400' },
  Notable:   { label: 'Notable',   color: 'text-zinc-700' },
  Permanent: { label: 'Permanent', color: 'text-emerald-700 font-bold' },
};

function emptyForm(): Partial<Reflection> {
  return {
    date: new Date().toISOString().split('T')[0],
    category: 'Interpersonal',
    trigger: '',
    insight: '',
    principle: '',
    linkedProjectId: '',
    linkedPeople: '',
    weight: 'Notable',
  };
}

export default function ReflectionPage() {
  const { reflections, projects, addReflection, updateReflection, deleteReflection } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Reflection>>(emptyForm());

  const [filterCat, setFilterCat] = useState<ReflectionCategory | 'All'>('All');
  const [filterWeight, setFilterWeight] = useState<ReflectionWeight | 'All'>('All');

  const [principleSeed, setPrincipleSeed] = useState(0);

  const projectMap = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach(p => m.set(p.id, p.title));
    return m;
  }, [projects]);

  const sorted = useMemo(
    () => [...reflections].sort((a, b) => b.date.localeCompare(a.date)),
    [reflections]
  );

  const filtered = useMemo(() => sorted.filter(r =>
    (filterCat === 'All' || r.category === filterCat) &&
    (filterWeight === 'All' || r.weight === filterWeight)
  ), [sorted, filterCat, filterWeight]);

  const principles = useMemo(
    () => reflections.filter(r => r.weight === 'Permanent' || (r.principle && r.principle.trim())),
    [reflections]
  );

  const todaysPrinciple = useMemo(() => {
    if (principles.length === 0) return undefined;
    return principles[principleSeed % principles.length];
  }, [principles, principleSeed]);

  const thisMonth = useMemo(() => {
    const m = new Date().toISOString().slice(0, 7);
    return reflections.filter(r => r.date.startsWith(m)).length;
  }, [reflections]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowForm(true);
  };

  const handleEdit = (r: Reflection) => {
    setEditingId(r.id);
    setFormData({ ...r });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Reflection = {
      id: editingId ?? Math.random().toString(36).slice(2, 11),
      date: formData.date ?? new Date().toISOString().split('T')[0],
      category: (formData.category ?? 'Other') as ReflectionCategory,
      trigger: (formData.trigger ?? '').trim(),
      insight: (formData.insight ?? '').trim(),
      principle: formData.principle?.trim() || undefined,
      linkedProjectId: formData.linkedProjectId || undefined,
      linkedPeople: formData.linkedPeople?.trim() || undefined,
      weight: (formData.weight ?? 'Notable') as ReflectionWeight,
    };
    if (editingId) updateReflection(payload);
    else addReflection(payload);
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="text-zinc-700" size={26} /> Reflection
          </h2>
          <p className="text-zinc-500 mt-1">
            The internal mirror. Compress experience into principles, before the lesson fades.
          </p>
        </header>
        <button
          onClick={handleOpenAdd}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus size={16} /> New Reflection
        </button>
      </div>

      {/* Today's Principle banner */}
      {todaysPrinciple && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="text-emerald-600 mt-1 shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Today's Principle</div>
                <button
                  onClick={() => setPrincipleSeed(s => s + 1)}
                  className="text-xs text-emerald-700/70 hover:text-emerald-900 flex items-center gap-1"
                  title="Shuffle"
                >
                  <Shuffle size={12} /> shuffle
                </button>
              </div>
              <p className="text-base text-emerald-900 font-medium italic">
                "{todaysPrinciple.principle || todaysPrinciple.insight}"
              </p>
              <div className="mt-2 text-xs text-emerald-700/80">
                {todaysPrinciple.category} · {todaysPrinciple.date}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Total Reflections</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{reflections.length}</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Permanent Principles</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{principles.length}</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">This Month</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{thisMonth}</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ReflectionCategory })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Weight</label>
                <select
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value as ReflectionWeight })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  {WEIGHTS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">People (optional)</label>
                <input
                  type="text"
                  value={formData.linkedPeople ?? ''}
                  onChange={e => setFormData({ ...formData, linkedPeople: e.target.value })}
                  placeholder="Cofounder / Investor X / ..."
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Trigger</label>
              <input
                type="text"
                value={formData.trigger}
                onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                placeholder="What event / context prompted this?"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Insight</label>
              <textarea
                required
                rows={4}
                value={formData.insight}
                onChange={e => setFormData({ ...formData, insight: e.target.value })}
                placeholder="What did you actually realize? Be honest, not performative."
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-1">
                  <Star size={12} className="text-emerald-600" />
                  Distilled Principle (optional)
                </label>
                <input
                  type="text"
                  value={formData.principle ?? ''}
                  onChange={e => setFormData({ ...formData, principle: e.target.value })}
                  placeholder="One line. The rule you'd give yourself in 6 months."
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Linked Project (optional)</label>
                <select
                  value={formData.linkedProjectId ?? ''}
                  onChange={e => setFormData({ ...formData, linkedProjectId: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value="">-- None --</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">Filter:</span>
        <button
          onClick={() => setFilterCat('All')}
          className={`text-xs px-2 py-1 rounded-full border ${filterCat === 'All' ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'}`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`text-xs px-2 py-1 rounded-full border ${filterCat === c ? CATEGORY_META[c].color + ' border-current font-medium' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'}`}
          >
            {c}
          </button>
        ))}
        <span className="mx-2 text-zinc-300">|</span>
        <button
          onClick={() => setFilterWeight('All')}
          className={`text-xs px-2 py-1 rounded-full border ${filterWeight === 'All' ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'}`}
        >
          Any weight
        </button>
        {WEIGHTS.map(w => (
          <button
            key={w}
            onClick={() => setFilterWeight(w)}
            className={`text-xs px-2 py-1 rounded-full border ${filterWeight === w ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100'}`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Main grid: timeline + principles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-200 rounded-xl">
              No reflections match this filter.
            </div>
          )}
          {filtered.map(r => {
            const meta = CATEGORY_META[r.category];
            const Icon = meta.Icon;
            const projectTitle = r.linkedProjectId ? projectMap.get(r.linkedProjectId) : undefined;
            return (
              <div key={r.id} className={`group bg-white border rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow ${r.weight === 'Permanent' ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-zinc-200'}`}>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => handleEdit(r)} className="p-1 text-zinc-400 hover:text-zinc-900 bg-white rounded border border-zinc-200"><Edit2 size={12} /></button>
                  <button onClick={() => deleteReflection(r.id)} className="p-1 text-zinc-400 hover:text-red-600 bg-white rounded border border-zinc-200"><Trash2 size={12} /></button>
                </div>

                <div className="flex items-center gap-2 mb-2 flex-wrap pr-16">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${meta.color}`}>
                    <Icon size={10} /> {r.category}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider ${WEIGHT_META[r.weight].color}`}>
                    {WEIGHT_META[r.weight].label}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono ml-auto">{r.date}</span>
                </div>

                {r.trigger && (
                  <div className="text-xs text-zinc-500 italic mb-2">
                    Trigger: {r.trigger}
                  </div>
                )}

                <div className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">{r.insight}</div>

                {r.principle && (
                  <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-md p-2">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 flex items-center gap-1">
                      <Star size={10} /> Principle
                    </div>
                    <div className="text-sm text-emerald-900 mt-0.5 italic">"{r.principle}"</div>
                  </div>
                )}

                {(projectTitle || r.linkedPeople) && (
                  <div className="mt-3 pt-2 border-t border-zinc-100 text-xs text-zinc-500 flex gap-3">
                    {r.linkedPeople && <span>👤 {r.linkedPeople}</span>}
                    {projectTitle && <span>→ {projectTitle}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Principles Library */}
        <aside className="lg:col-span-1">
          <div className="bg-zinc-900 text-white rounded-2xl p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-emerald-400" />
              <h3 className="font-semibold text-white text-sm">Principles Library</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              Distilled rules that survive the day they were written.
            </p>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {principles.length === 0 && (
                <div className="text-xs text-zinc-500 italic">
                  No principles yet. Mark a reflection as <span className="text-emerald-400">Permanent</span> or add a distilled principle.
                </div>
              )}
              {principles.map(r => (
                <div key={r.id} className="border-l-2 border-emerald-500 pl-3 py-1">
                  <div className="text-sm text-zinc-100 leading-snug italic">
                    "{r.principle || r.insight}"
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                    {r.category} · {r.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
