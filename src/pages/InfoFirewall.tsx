import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Trash2, Edit2, Shield, AlertCircle, ArrowRight, Zap, Layers } from 'lucide-react';
import { InfoItem, InfoTier, OutputType, Framework, Track } from '../types';

const MANIFESTO: { rule: string; gloss: string }[] = [
  { rule: 'Control bandwidth, not stack tasks', gloss: 'Cognition is finite. Tasks are infinite.' },
  { rule: 'No output → no input', gloss: 'Ingest only when you can produce a decision.' },
  { rule: 'Compression > Expansion', gloss: 'Map signals into existing frameworks.' },
  { rule: 'Signal repeats — FOMO is fake', gloss: 'Truly important info finds you twice.' },
];

const TIER_META: Record<InfoTier, { label: string; sub: string; color: string; ring: string; cap?: number }> = {
  1: {
    label: 'Tier 1 — Mission Critical',
    sub: 'Daily. Hard limit: 5 items / day.',
    color: 'bg-red-50/70 border-red-200',
    ring: 'ring-red-200',
    cap: 5,
  },
  2: {
    label: 'Tier 2 — Strategic Optional',
    sub: 'Weekly batch processing. Not real-time.',
    color: 'bg-amber-50/70 border-amber-200',
    ring: 'ring-amber-200',
  },
  3: {
    label: 'Tier 3 — Entertainment',
    sub: 'Strict ration. Many founders die here.',
    color: 'bg-zinc-100/70 border-zinc-200',
    ring: 'ring-zinc-200',
  },
};

const OUTPUT_TYPES: OutputType[] = ['note', 'judgment', 'decision', 'action', 'artifact'];

const TRACKS: Track[] = ['Master Course Study', 'AI Agent Engineering', 'Quant / BTC', 'Other'];

function emptyForm(): Partial<InfoItem> {
  return {
    source: '',
    tier: 2,
    rawInput: '',
    frameworkId: '',
    outputType: undefined,
    outputContent: '',
    linkedProjectId: '',
    linkedTrack: '',
    date: new Date().toISOString().split('T')[0],
    status: 'blocked',
  };
}

export default function InfoFirewall() {
  const {
    infoItems, frameworks, projects,
    addInfoItem, updateInfoItem, deleteInfoItem,
    addFramework, updateFramework, deleteFramework,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<InfoItem>>(emptyForm());

  const [showFwForm, setShowFwForm] = useState(false);
  const [editingFwId, setEditingFwId] = useState<string | null>(null);
  const [fwData, setFwData] = useState<Partial<Framework>>({ name: '', description: '' });

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const stats = useMemo(() => {
    const tier1Today = infoItems.filter(i => i.tier === 1 && i.date === today).length;
    const blocked = infoItems.filter(i => i.status === 'blocked').length;
    const tier3Week = infoItems.filter(i => i.tier === 3 && i.date >= sevenDaysAgo).length;
    return { tier1Today, blocked, tier3Week };
  }, [infoItems, today, sevenDaysAgo]);

  const tier1Over = stats.tier1Today > (TIER_META[1].cap ?? Infinity);

  const itemsByTier = useMemo(() => ({
    1: infoItems.filter(i => i.tier === 1),
    2: infoItems.filter(i => i.tier === 2),
    3: infoItems.filter(i => i.tier === 3),
  }), [infoItems]);

  const frameworkMap = useMemo(() => {
    const m = new Map<string, Framework>();
    frameworks.forEach(f => m.set(f.id, f));
    return m;
  }, [frameworks]);

  const projectMap = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach(p => m.set(p.id, p.title));
    return m;
  }, [projects]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowForm(true);
  };

  const handleEdit = (item: InfoItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasOutput = !!(formData.outputType && formData.outputContent?.trim());
    const payload: InfoItem = {
      id: editingId ?? Math.random().toString(36).slice(2, 11),
      source: (formData.source ?? '').trim(),
      tier: (formData.tier ?? 2) as InfoTier,
      rawInput: (formData.rawInput ?? '').trim(),
      frameworkId: formData.frameworkId || undefined,
      outputType: hasOutput ? formData.outputType : undefined,
      outputContent: hasOutput ? formData.outputContent?.trim() : undefined,
      linkedProjectId: formData.linkedProjectId || undefined,
      linkedTrack: (formData.linkedTrack as Track) || '',
      date: formData.date ?? today,
      status: hasOutput ? 'processed' : 'blocked',
    };
    if (editingId) updateInfoItem(payload);
    else addInfoItem(payload);
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm());
  };

  const handleBindOutput = (item: InfoItem, type: OutputType, content: string) => {
    if (!content.trim()) return;
    updateInfoItem({ ...item, outputType: type, outputContent: content.trim(), status: 'processed' });
  };

  const handleFwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Framework = {
      id: editingFwId ?? `fw_${Math.random().toString(36).slice(2, 9)}`,
      name: (fwData.name ?? '').trim(),
      description: (fwData.description ?? '').trim(),
    };
    if (!payload.name) return;
    if (editingFwId) updateFramework(payload);
    else addFramework(payload);
    setShowFwForm(false);
    setEditingFwId(null);
    setFwData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Shield className="text-zinc-700" size={26} /> Info Firewall
          </h2>
          <p className="text-zinc-500 mt-1">
            Cognitive bandwidth gate. Information must compress into a framework and bind to an output — or it does not enter.
          </p>
        </header>
        <button
          onClick={handleOpenAdd}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus size={16} /> Ingest Info
        </button>
      </div>

      {/* Manifesto */}
      <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="text-xs uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <Zap size={12} /> Founder Constitution
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {MANIFESTO.map((m, i) => (
            <div key={i} className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-3">
              <div className="text-sm font-semibold text-zinc-100">{i + 1}. {m.rule}</div>
              <div className="text-xs text-zinc-400 mt-1">{m.gloss}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-white border rounded-xl p-4 ${tier1Over ? 'border-red-300 ring-2 ring-red-100' : 'border-zinc-200'}`}>
          <div className="text-xs uppercase tracking-wider text-zinc-500">Tier 1 Today</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${tier1Over ? 'text-red-600' : 'text-zinc-900'}`}>{stats.tier1Today}</span>
            <span className="text-sm text-zinc-400">/ {TIER_META[1].cap}</span>
          </div>
          {tier1Over && <div className="text-xs text-red-600 mt-1">Cap exceeded — what is truly critical?</div>}
        </div>
        <div className={`bg-white border rounded-xl p-4 ${stats.blocked > 0 ? 'border-orange-300' : 'border-zinc-200'}`}>
          <div className="text-xs uppercase tracking-wider text-zinc-500">Blocked (no output)</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${stats.blocked > 0 ? 'text-orange-600' : 'text-zinc-900'}`}>{stats.blocked}</span>
          </div>
          {stats.blocked > 0 && <div className="text-xs text-orange-600 mt-1">Bind an output before ingesting more.</div>}
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Tier 3 (last 7d)</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${stats.tier3Week > 10 ? 'text-zinc-700' : 'text-zinc-900'}`}>{stats.tier3Week}</span>
          </div>
          {stats.tier3Week > 10 && <div className="text-xs text-zinc-500 mt-1">Entertainment intake high. Deep work may be eroded.</div>}
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Source</label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Customer call / Twitter / Paper..."
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Tier</label>
                <select
                  value={formData.tier}
                  onChange={e => setFormData({ ...formData, tier: Number(e.target.value) as InfoTier })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value={1}>Tier 1 — Mission Critical</option>
                  <option value={2}>Tier 2 — Strategic Optional</option>
                  <option value={3}>Tier 3 — Entertainment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Raw Input</label>
              <textarea
                required
                rows={2}
                value={formData.rawInput}
                onChange={e => setFormData({ ...formData, rawInput: e.target.value })}
                placeholder="The actual information / signal..."
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Framework (compression)</label>
                <select
                  value={formData.frameworkId}
                  onChange={e => setFormData({ ...formData, frameworkId: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value="">-- None --</option>
                  {frameworks.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Linked Project</label>
                <select
                  value={formData.linkedProjectId}
                  onChange={e => setFormData({ ...formData, linkedProjectId: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value="">-- None --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Linked Track</label>
                <select
                  value={formData.linkedTrack}
                  onChange={e => setFormData({ ...formData, linkedTrack: e.target.value as Track })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value="">-- None --</option>
                  {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight size={14} className="text-zinc-500" />
                <span className="text-sm font-semibold text-zinc-900">Output Binding</span>
                <span className="text-xs text-zinc-500">— No output, item is marked blocked.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Output Type</label>
                  <select
                    value={formData.outputType ?? ''}
                    onChange={e => setFormData({ ...formData, outputType: (e.target.value || undefined) as OutputType | undefined })}
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                  >
                    <option value="">-- None (Blocked) --</option>
                    {OUTPUT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Output Content</label>
                  <input
                    type="text"
                    value={formData.outputContent}
                    onChange={e => setFormData({ ...formData, outputContent: e.target.value })}
                    placeholder="What did you decide / write / build / act on?"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Ingest'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main grid: tiers + frameworks panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {([1, 2, 3] as InfoTier[]).map(tier => {
            const meta = TIER_META[tier];
            const items = itemsByTier[tier];
            return (
              <div key={tier} className={`border rounded-2xl p-4 ${meta.color} min-h-[300px]`}>
                <div className="mb-3">
                  <div className="text-sm font-bold text-zinc-900">{meta.label}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{meta.sub}</div>
                  <div className="text-xs text-zinc-500 mt-2 font-mono">{items.length} item{items.length === 1 ? '' : 's'}</div>
                </div>
                <div className="space-y-3">
                  {items.length === 0 && (
                    <div className="text-xs text-zinc-500 italic p-3 border-2 border-dashed border-zinc-300 rounded-lg text-center">
                      Empty
                    </div>
                  )}
                  {items.map(item => (
                    <div key={item.id}>
                      <InfoCard
                        item={item}
                        frameworkName={item.frameworkId ? frameworkMap.get(item.frameworkId)?.name : undefined}
                        projectTitle={item.linkedProjectId ? projectMap.get(item.linkedProjectId) : undefined}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteInfoItem(item.id)}
                        onBindOutput={(type, content) => handleBindOutput(item, type, content)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Frameworks Library */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-zinc-500" />
                <h3 className="font-semibold text-zinc-900 text-sm">Compression Frameworks</h3>
              </div>
              <button
                onClick={() => { setEditingFwId(null); setFwData({ name: '', description: '' }); setShowFwForm(!showFwForm); }}
                className="text-zinc-500 hover:text-zinc-900"
                title="Add framework"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">Map signals to patterns. Few frameworks, much compression.</p>

            {showFwForm && (
              <form onSubmit={handleFwSubmit} className="space-y-2 mb-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50">
                <input
                  type="text"
                  required
                  placeholder="Name (e.g. Liquidity)"
                  value={fwData.name}
                  onChange={e => setFwData({ ...fwData, name: e.target.value })}
                  className="w-full border border-zinc-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <textarea
                  rows={2}
                  placeholder="One-line description"
                  value={fwData.description}
                  onChange={e => setFwData({ ...fwData, description: e.target.value })}
                  className="w-full border border-zinc-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <div className="flex gap-1 justify-end">
                  <button type="button" onClick={() => setShowFwForm(false)} className="text-xs px-2 py-1 text-zinc-500">Cancel</button>
                  <button type="submit" className="text-xs px-2 py-1 bg-zinc-900 text-white rounded">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {frameworks.length === 0 && (
                <div className="text-xs text-zinc-400 italic">No frameworks yet.</div>
              )}
              {frameworks.map(fw => {
                const usage = infoItems.filter(i => i.frameworkId === fw.id).length;
                return (
                  <div key={fw.id} className="group border border-zinc-200 rounded-lg p-2 hover:bg-zinc-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-900">{fw.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{fw.description}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-1 shrink-0">
                        <button onClick={() => { setEditingFwId(fw.id); setFwData(fw); setShowFwForm(true); }} className="text-zinc-400 hover:text-zinc-900"><Edit2 size={12} /></button>
                        <button onClick={() => deleteFramework(fw.id)} className="text-zinc-400 hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-1">{usage} signal{usage === 1 ? '' : 's'} mapped</div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- InfoCard subcomponent ---

interface InfoCardProps {
  item: InfoItem;
  frameworkName?: string;
  projectTitle?: string;
  onEdit: () => void;
  onDelete: () => void;
  onBindOutput: (type: OutputType, content: string) => void;
}

function InfoCard({ item, frameworkName, projectTitle, onEdit, onDelete, onBindOutput }: InfoCardProps) {
  const [quickType, setQuickType] = useState<OutputType>('decision');
  const [quickContent, setQuickContent] = useState('');
  const isBlocked = item.status === 'blocked';

  return (
    <div className={`group relative bg-white border rounded-xl p-3 shadow-sm ${isBlocked ? 'border-orange-300 ring-1 ring-orange-100' : 'border-zinc-200'}`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button onClick={onEdit} className="p-1 text-zinc-400 hover:text-zinc-900 bg-white rounded border border-zinc-200"><Edit2 size={11} /></button>
        <button onClick={onDelete} className="p-1 text-zinc-400 hover:text-red-600 bg-white rounded border border-zinc-200"><Trash2 size={11} /></button>
      </div>

      <div className="flex items-center gap-1.5 mb-2 flex-wrap pr-12">
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 text-white">
          {item.source}
        </span>
        {frameworkName && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {frameworkName}
          </span>
        )}
        {isBlocked && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-0.5">
            <AlertCircle size={9} /> BLOCKED
          </span>
        )}
      </div>

      <div className="text-sm text-zinc-900 leading-snug">{item.rawInput}</div>

      {item.outputType && item.outputContent && (
        <div className="mt-2 bg-emerald-50/70 border border-emerald-200 rounded-md p-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 flex items-center gap-1">
            <ArrowRight size={10} /> {item.outputType}
          </div>
          <div className="text-xs text-emerald-900 mt-0.5">{item.outputContent}</div>
        </div>
      )}

      {isBlocked && (
        <div className="mt-2 border-t border-orange-200 pt-2">
          <div className="text-[10px] uppercase tracking-wider text-orange-700 font-bold mb-1">Bind output to unblock</div>
          <div className="flex gap-1">
            <select
              value={quickType}
              onChange={e => setQuickType(e.target.value as OutputType)}
              className="text-xs border border-zinc-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-zinc-900"
            >
              {OUTPUT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              type="text"
              value={quickContent}
              onChange={e => setQuickContent(e.target.value)}
              placeholder="Your output..."
              className="flex-1 text-xs border border-zinc-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <button
              onClick={() => { onBindOutput(quickType, quickContent); setQuickContent(''); }}
              className="text-xs px-2 py-0.5 bg-zinc-900 text-white rounded hover:bg-zinc-800"
            >
              Bind
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2 pt-2 border-t border-zinc-100">
        <span>{item.date}</span>
        <span className="font-mono">
          {projectTitle ? `→ ${projectTitle}` : item.linkedTrack || ''}
        </span>
      </div>
    </div>
  );
}
