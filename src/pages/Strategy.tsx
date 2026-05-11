import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  StrategySignal, StrategyHypothesis, StrategyReview,
  StrategyLevel, SignalCategory, SignalDecision,
  HypothesisDomain, HypothesisStatus,
  ReviewCadence, ReviewDecision,
} from '../types';
import {
  Compass, Plus, Edit2, Trash2, ArrowRight, ArrowUp, ArrowDown,
  Layers, Activity, Calendar, ChevronRight, ChevronDown, Target, CheckCircle2, XCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Strategic Permission Hierarchy — the "constitution" of the strategy layer
// ---------------------------------------------------------------------------

const PERMISSION_LEVELS: {
  level: StrategyLevel;
  name: string;
  zh: string;
  description: string;
  allowed: string;
  forbidden: string;
  accent: { bg: string; border: string; text: string; chip: string };
}[] = [
  {
    level: 1,
    name: 'Noise',
    zh: '噪音',
    description: 'Twitter, threads, VC sentiment, "X will replace everything".',
    allowed: 'Curiosity only',
    forbidden: 'No roadmap change. No mission change.',
    accent: { bg: 'bg-zinc-50', border: 'border-zinc-300', text: 'text-zinc-700', chip: 'bg-zinc-200 text-zinc-700' },
  },
  {
    level: 2,
    name: 'Tactical Adjustment',
    zh: '战术微调',
    description: 'Onboarding friction, competitor pricing, tool/API change.',
    allowed: 'Adjust execution / feature / stack',
    forbidden: 'Mission stays. No pivot.',
    accent: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', chip: 'bg-amber-200 text-amber-900' },
  },
  {
    level: 3,
    name: 'Strategic Signal',
    zh: '战略级别',
    description: 'User behavior shift, distribution reality, platform/regulatory/tech discontinuity.',
    allowed: 'Update strategy / mission / hypothesis',
    forbidden: 'Only on repeated, structural evidence.',
    accent: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900', chip: 'bg-indigo-200 text-indigo-900' },
  },
];

const SIGNAL_CATEGORY_META: Record<SignalCategory, { label: string; defaultLevel: StrategyLevel }> = {
  user_behavior: { label: 'User behavior', defaultLevel: 3 },
  distribution_reality: { label: 'Distribution reality', defaultLevel: 3 },
  platform_shift: { label: 'Platform shift', defaultLevel: 3 },
  regulatory: { label: 'Regulatory / infra', defaultLevel: 3 },
  tech_discontinuity: { label: 'Tech discontinuity', defaultLevel: 3 },
  tactical_friction: { label: 'Tactical friction', defaultLevel: 2 },
  tool_efficiency: { label: 'Tool / API change', defaultLevel: 2 },
  competitor_move: { label: 'Competitor move', defaultLevel: 2 },
  vc_sentiment: { label: 'VC sentiment', defaultLevel: 1 },
  trend_chatter: { label: 'Trend chatter', defaultLevel: 1 },
  meme_noise: { label: 'Meme / hype noise', defaultLevel: 1 },
};

const DECISION_META: Record<SignalDecision, { label: string; className: string }> = {
  pending:           { label: 'Pending',           className: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  monitor:           { label: 'Monitor',           className: 'bg-amber-50 text-amber-800 border-amber-200' },
  rejected:          { label: 'Rejected',          className: 'bg-red-50 text-red-700 border-red-200' },
  tactical_adjust:   { label: 'Tactical adjust',   className: 'bg-amber-100 text-amber-900 border-amber-300' },
  strategic_update:  { label: 'Strategic update',  className: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
};

const HYPOTHESIS_DOMAIN_META: Record<HypothesisDomain, { label: string }> = {
  user: { label: 'User' },
  distribution: { label: 'Distribution' },
  paradigm: { label: 'Paradigm' },
  moat: { label: 'Moat' },
  market_timing: { label: 'Market timing' },
  technology: { label: 'Technology' },
};

const HYPOTHESIS_STATUS_META: Record<HypothesisStatus, { label: string; className: string }> = {
  active:      { label: 'Active',      className: 'bg-zinc-900 text-white' },
  validated:   { label: 'Validated',   className: 'bg-emerald-100 text-emerald-800' },
  invalidated: { label: 'Invalidated', className: 'bg-red-100 text-red-700' },
  pivoted:     { label: 'Pivoted',     className: 'bg-indigo-100 text-indigo-800' },
};

const REVIEW_DECISION_META: Record<ReviewDecision, { label: string; className: string }> = {
  execute_as_planned: { label: 'Execute as planned', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  tactical_adjust:    { label: 'Tactical adjust',    className: 'bg-amber-50 text-amber-800 border-amber-200' },
  strategic_pivot:    { label: 'Strategic pivot',    className: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  paradigm_change:    { label: 'Paradigm change',    className: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200' },
};

const CADENCE_META: Record<ReviewCadence, { label: string; zh: string }> = {
  weekly:    { label: 'Weekly',    zh: '每周战术 review' },
  monthly:   { label: 'Monthly',   zh: '每月战略 review' },
  quarterly: { label: 'Quarterly', zh: '每季度世界模型更新' },
};

// 70 / 20 / 10 budget
const BUDGET = [
  { pct: 70, label: 'Execution-driven learning', zh: '执行驱动学习', sub: 'build · ship · users · metrics', accent: 'bg-zinc-900' },
  { pct: 20, label: 'Strategic monitoring',      zh: '战略监控',     sub: 'industry · paradigm · competitors', accent: 'bg-indigo-500' },
  { pct: 10, label: 'Exploratory curiosity',     zh: '探索性好奇',   sub: 'crazy ideas · research · future', accent: 'bg-amber-400' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const today = () => new Date().toISOString().split('T')[0];
const id = () => Math.random().toString(36).slice(2, 11);

type Tab = 'signals' | 'hypotheses' | 'reviews';

export default function Strategy() {
  const {
    strategySignals, strategyHypotheses, strategyReviews,
    addStrategySignal, updateStrategySignal, deleteStrategySignal,
    addStrategyHypothesis, updateStrategyHypothesis, deleteStrategyHypothesis,
    addStrategyReview, updateStrategyReview, deleteStrategyReview,
  } = useStore();

  const [tab, setTab] = useState<Tab>('signals');

  const stats = useMemo(() => {
    const pending = strategySignals.filter(s => s.decision === 'pending').length;
    const monitoring = strategySignals.filter(s => s.decision === 'monitor').length;
    const strategicLast30 = strategySignals.filter(s => {
      const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      return s.date >= cutoff && s.decision === 'strategic_update';
    }).length;
    const activeHypotheses = strategyHypotheses.filter(h => h.status === 'active').length;
    const lowConfidence = strategyHypotheses.filter(h => h.status === 'active' && h.confidence < 50).length;
    const lastReview = strategyReviews[0];
    return { pending, monitoring, strategicLast30, activeHypotheses, lowConfidence, lastReview };
  }, [strategySignals, strategyHypotheses, strategyReviews]);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Compass className="text-zinc-700" size={26} /> Strategy
          </h2>
          <p className="text-zinc-500 mt-1 max-w-2xl">
            The layer between information input and execution. Continuous Bayesian updating —
            not every signal earns the right to change strategy.
          </p>
        </div>
      </header>

      {/* --- Strategic Permission Hierarchy --- */}
      <section>
        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2 font-medium">
          <Layers size={12} /> Strategic Permission Hierarchy · 战略权限层级
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERMISSION_LEVELS.map(p => (
            <div
              key={p.level}
              className={`relative border-2 ${p.accent.border} ${p.accent.bg} rounded-2xl p-5 overflow-hidden`}
            >
              <div className="absolute top-3 right-3 font-mono text-[10px] tracking-widest text-zinc-400">
                L{p.level}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${p.accent.chip}`}>
                  LEVEL {p.level}
                </span>
              </div>
              <h3 className={`text-lg font-bold ${p.accent.text} leading-tight`}>{p.name}</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5 italic">{p.zh}</p>
              <p className="text-sm text-zinc-700 mt-3 leading-snug">{p.description}</p>
              <div className="mt-4 space-y-1.5 border-t border-zinc-200/70 pt-3">
                <div className="flex items-start gap-1.5 text-xs">
                  <CheckCircle2 size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                  <span className={p.accent.text}>{p.allowed}</span>
                </div>
                <div className="flex items-start gap-1.5 text-xs">
                  <XCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-600">{p.forbidden}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 70 / 20 / 10 Budget --- */}
      <section className="bg-zinc-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2 font-medium">
              <Target size={12} /> 70 / 20 / 10 Allocation Budget
            </div>
            <p className="text-sm text-zinc-300 mt-1">Defend the ratio. "持续正确" beats "瞬间聪明".</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Most info is</div>
            <div className="text-sm font-mono text-zinc-300">noise · low strategic permission</div>
          </div>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-zinc-700">
          {BUDGET.map(b => (
            <div key={b.label} className={`${b.accent}`} style={{ width: `${b.pct}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {BUDGET.map(b => (
            <div key={b.label} className="flex gap-3">
              <div className={`w-1 rounded-full ${b.accent} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular-nums">{b.pct}<span className="text-sm text-zinc-400">%</span></span>
                  <span className="text-[10px] text-zinc-500 italic">{b.zh}</span>
                </div>
                <div className="text-sm font-medium text-zinc-200 mt-0.5">{b.label}</div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Stats strip --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Signals pending" value={stats.pending} sub="awaiting decision" highlight={stats.pending > 5} />
        <Stat label="Under monitor" value={stats.monitoring} sub="need repeated evidence" />
        <Stat label="Strategic / 30d" value={stats.strategicLast30} sub="strategy-level changes" />
        <Stat
          label="Active hypotheses"
          value={stats.activeHypotheses}
          sub={stats.lowConfidence > 0 ? `${stats.lowConfidence} below 50% confidence` : 'world model'}
          highlight={stats.lowConfidence > 0}
        />
      </section>

      {/* --- Tabs --- */}
      <section>
        <div className="border-b border-zinc-200 flex gap-1">
          <TabButton active={tab === 'signals'} onClick={() => setTab('signals')} icon={<Activity size={14} />} count={strategySignals.length}>
            Signal Queue
          </TabButton>
          <TabButton active={tab === 'hypotheses'} onClick={() => setTab('hypotheses')} icon={<Layers size={14} />} count={strategyHypotheses.length}>
            World Model
          </TabButton>
          <TabButton active={tab === 'reviews'} onClick={() => setTab('reviews')} icon={<Calendar size={14} />} count={strategyReviews.length}>
            Reviews
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === 'signals' && (
            <SignalsTab
              signals={strategySignals}
              hypotheses={strategyHypotheses}
              onAdd={addStrategySignal}
              onUpdate={updateStrategySignal}
              onDelete={deleteStrategySignal}
            />
          )}
          {tab === 'hypotheses' && (
            <HypothesesTab
              hypotheses={strategyHypotheses}
              signals={strategySignals}
              onAdd={addStrategyHypothesis}
              onUpdate={updateStrategyHypothesis}
              onDelete={deleteStrategyHypothesis}
            />
          )}
          {tab === 'reviews' && (
            <ReviewsTab
              reviews={strategyReviews}
              signals={strategySignals}
              hypotheses={strategyHypotheses}
              onAdd={addStrategyReview}
              onUpdate={updateStrategyReview}
              onDelete={deleteStrategyReview}
            />
          )}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat + Tab primitives
// ---------------------------------------------------------------------------

function Stat({ label, value, sub, highlight }: { label: string; value: number; sub: string; highlight?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-4 ${highlight ? 'border-orange-300 ring-2 ring-orange-100' : 'border-zinc-200'}`}>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${highlight ? 'text-orange-600' : 'text-zinc-900'}`}>
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 mt-0.5">{sub}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, count, children }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; count: number; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition-colors ${
        active
          ? 'border-zinc-900 text-zinc-900'
          : 'border-transparent text-zinc-500 hover:text-zinc-900'
      }`}
    >
      {icon}
      {children}
      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
        {count}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Signals tab
// ---------------------------------------------------------------------------

function emptySignal(): Partial<StrategySignal> {
  return {
    source: '',
    description: '',
    category: 'tactical_friction',
    permissionLevel: 2,
    repeatedCount: 1,
    evidence: '',
    decision: 'pending',
    date: today(),
  };
}

function SignalsTab({
  signals, hypotheses, onAdd, onUpdate, onDelete,
}: {
  signals: StrategySignal[];
  hypotheses: StrategyHypothesis[];
  onAdd: (s: StrategySignal) => void;
  onUpdate: (s: StrategySignal) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<StrategySignal>>(emptySignal());

  const groups: { key: SignalDecision | 'pending'; signals: StrategySignal[] }[] = useMemo(() => {
    const buckets: Record<SignalDecision, StrategySignal[]> = {
      pending: [], monitor: [], tactical_adjust: [], strategic_update: [], rejected: [],
    };
    signals.forEach(s => { buckets[s.decision].push(s); });
    return [
      { key: 'pending', signals: buckets.pending },
      { key: 'monitor', signals: buckets.monitor },
      { key: 'tactical_adjust', signals: buckets.tactical_adjust },
      { key: 'strategic_update', signals: buckets.strategic_update },
      { key: 'rejected', signals: buckets.rejected },
    ];
  }, [signals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StrategySignal = {
      id: editingId ?? id(),
      date: form.date ?? today(),
      source: (form.source ?? '').trim(),
      description: (form.description ?? '').trim(),
      category: (form.category ?? 'tactical_friction') as SignalCategory,
      permissionLevel: (form.permissionLevel ?? 2) as StrategyLevel,
      repeatedCount: Math.max(1, Number(form.repeatedCount ?? 1)),
      evidence: (form.evidence ?? '').trim(),
      decision: (form.decision ?? 'pending') as SignalDecision,
      decisionNote: form.decisionNote?.trim() || undefined,
      linkedHypothesisId: form.linkedHypothesisId || undefined,
    };
    if (editingId) onUpdate(payload);
    else onAdd(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptySignal());
  };

  const handleEdit = (s: StrategySignal) => {
    setEditingId(s.id);
    setForm({ ...s });
    setShowForm(true);
  };

  const handleQuickDecide = (s: StrategySignal, decision: SignalDecision) => {
    onUpdate({ ...s, decision });
  };

  const handleBumpRepeated = (s: StrategySignal) => {
    onUpdate({ ...s, repeatedCount: s.repeatedCount + 1 });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 max-w-xl">
          Every potentially-strategic signal lands here. Assign a permission level. Wait for repeats. Then decide.
        </p>
        <button
          onClick={() => { setEditingId(null); setForm(emptySignal()); setShowForm(true); }}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus size={16} /> Capture Signal
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Source</label>
                <input type="text" required value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="Customer call / Twitter / Changelog..." className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Category</label>
                <select
                  value={form.category}
                  onChange={e => {
                    const cat = e.target.value as SignalCategory;
                    setForm({ ...form, category: cat, permissionLevel: SIGNAL_CATEGORY_META[cat].defaultLevel });
                  }}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  {(Object.keys(SIGNAL_CATEGORY_META) as SignalCategory[]).map(k => (
                    <option key={k} value={k}>L{SIGNAL_CATEGORY_META[k].defaultLevel} · {SIGNAL_CATEGORY_META[k].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Permission Level</label>
                <select
                  value={form.permissionLevel}
                  onChange={e => setForm({ ...form, permissionLevel: Number(e.target.value) as StrategyLevel })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value={1}>Level 1 — Noise (curiosity only)</option>
                  <option value={2}>Level 2 — Tactical (adjust execution)</option>
                  <option value={3}>Level 3 — Strategic (update mission)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">What is the signal?</label>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="The signal in one or two lines..."
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Evidence (the why)</label>
              <textarea
                rows={2}
                value={form.evidence}
                onChange={e => setForm({ ...form, evidence: e.target.value })}
                placeholder="What concrete evidence supports this? How many users / observations?"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Repeated Count</label>
                <input type="number" min={1} value={form.repeatedCount} onChange={e => setForm({ ...form, repeatedCount: Number(e.target.value) })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
                <p className="text-[10px] text-zinc-500 mt-1">Truly important info finds you twice.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Decision</label>
                <select
                  value={form.decision}
                  onChange={e => setForm({ ...form, decision: e.target.value as SignalDecision })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  {(Object.keys(DECISION_META) as SignalDecision[]).map(d => (
                    <option key={d} value={d}>{DECISION_META[d].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Linked Hypothesis</label>
                <select
                  value={form.linkedHypothesisId || ''}
                  onChange={e => setForm({ ...form, linkedHypothesisId: e.target.value })}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
                >
                  <option value="">-- None --</option>
                  {hypotheses.map(h => <option key={h.id} value={h.id}>{h.statement.slice(0, 40)}{h.statement.length > 40 ? '…' : ''}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Decision Note (optional)</label>
              <input type="text" value={form.decisionNote || ''} onChange={e => setForm({ ...form, decisionNote: e.target.value })} placeholder="What did you decide and why?" className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Capture'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Signal groups */}
      <div className="space-y-4">
        {groups.map(g => g.signals.length === 0 ? null : (
          <div key={g.key}>
            <SignalGroup
              decision={g.key as SignalDecision}
              signals={g.signals}
              hypotheses={hypotheses}
              onEdit={handleEdit}
              onDelete={onDelete}
              onQuickDecide={handleQuickDecide}
              onBumpRepeated={handleBumpRepeated}
            />
          </div>
        ))}
        {signals.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center text-zinc-500 text-sm">
            No signals captured yet. The strategy layer is empty — execution-only mode.
          </div>
        )}
      </div>
    </div>
  );
}

function SignalGroup({
  decision, signals, hypotheses, onEdit, onDelete, onQuickDecide, onBumpRepeated,
}: {
  decision: SignalDecision;
  signals: StrategySignal[];
  hypotheses: StrategyHypothesis[];
  onEdit: (s: StrategySignal) => void;
  onDelete: (id: string) => void;
  onQuickDecide: (s: StrategySignal, d: SignalDecision) => void;
  onBumpRepeated: (s: StrategySignal) => void;
}) {
  const [collapsed, setCollapsed] = useState(decision === 'rejected');
  const meta = DECISION_META[decision];
  const hypMap = useMemo(() => new Map(hypotheses.map(h => [h.id, h])), [hypotheses]);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-5 py-3 border-b border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50"
      >
        <div className="flex items-center gap-2">
          {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${meta.className}`}>
            {meta.label}
          </span>
          <span className="text-xs text-zinc-500 font-mono">{signals.length}</span>
        </div>
      </button>
      {!collapsed && (
        <div className="divide-y divide-zinc-100">
          {signals.map(s => (
            <div key={s.id}>
              <SignalRow
                signal={s}
                hypothesis={s.linkedHypothesisId ? hypMap.get(s.linkedHypothesisId) : undefined}
                onEdit={() => onEdit(s)}
                onDelete={() => onDelete(s.id)}
                onQuickDecide={(d) => onQuickDecide(s, d)}
                onBumpRepeated={() => onBumpRepeated(s)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignalRow({
  signal, hypothesis, onEdit, onDelete, onQuickDecide, onBumpRepeated,
}: {
  signal: StrategySignal;
  hypothesis?: StrategyHypothesis;
  onEdit: () => void;
  onDelete: () => void;
  onQuickDecide: (d: SignalDecision) => void;
  onBumpRepeated: () => void;
}) {
  const level = PERMISSION_LEVELS.find(p => p.level === signal.permissionLevel)!;
  return (
    <div className="px-5 py-4 hover:bg-zinc-50/50 group/sig">
      <div className="flex items-start gap-4">
        {/* Left: level marker */}
        <div className={`shrink-0 w-1 self-stretch rounded-full ${
          signal.permissionLevel === 3 ? 'bg-indigo-500' : signal.permissionLevel === 2 ? 'bg-amber-400' : 'bg-zinc-300'
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${level.accent.chip}`}>
              L{signal.permissionLevel} · {level.name}
            </span>
            <span className="text-[10px] font-medium text-zinc-500 px-1.5 py-0.5 bg-zinc-100 rounded">
              {SIGNAL_CATEGORY_META[signal.category].label}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">{signal.source}</span>
            <span className="text-[10px] text-zinc-400 font-mono ml-auto">{signal.date}</span>
          </div>

          <div className="text-sm text-zinc-900 leading-snug">{signal.description}</div>
          {signal.evidence && (
            <div className="text-xs text-zinc-600 mt-1.5 italic leading-snug">
              <span className="font-semibold not-italic text-zinc-500">Evidence —</span> {signal.evidence}
            </div>
          )}

          {signal.decisionNote && (
            <div className={`mt-2 inline-flex items-start gap-1.5 text-xs px-2 py-1 rounded border ${DECISION_META[signal.decision].className}`}>
              <ArrowRight size={11} className="mt-0.5 shrink-0" /> {signal.decisionNote}
            </div>
          )}

          {hypothesis && (
            <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
              <Layers size={10} /> Linked to: <span className="text-zinc-700 italic">{hypothesis.statement}</span>
            </div>
          )}

          {/* Quick actions row */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={onBumpRepeated}
              title="Signal observed again — bump count"
              className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Activity size={11} /> repeated × {signal.repeatedCount}
              {signal.repeatedCount >= 3 && <span className="ml-1 text-emerald-600">●</span>}
            </button>

            {signal.decision === 'pending' && (
              <div className="flex items-center gap-1 ml-auto opacity-0 group-hover/sig:opacity-100 transition-opacity">
                <QuickDecideButton onClick={() => onQuickDecide('monitor')}>Monitor</QuickDecideButton>
                <QuickDecideButton onClick={() => onQuickDecide('rejected')}>Reject</QuickDecideButton>
                <QuickDecideButton onClick={() => onQuickDecide('tactical_adjust')}>Tactical</QuickDecideButton>
                <QuickDecideButton onClick={() => onQuickDecide('strategic_update')} strong>Strategic</QuickDecideButton>
              </div>
            )}
          </div>
        </div>

        {/* Right: edit / delete */}
        <div className="shrink-0 opacity-0 group-hover/sig:opacity-100 transition-opacity flex gap-1">
          <button onClick={onEdit} className="p-1 text-zinc-400 hover:text-zinc-900"><Edit2 size={13} /></button>
          <button onClick={onDelete} className="p-1 text-zinc-400 hover:text-red-600"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );
}

function QuickDecideButton({ onClick, strong, children }: { onClick: () => void; strong?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] px-2 py-1 rounded border font-medium transition-colors ${
        strong
          ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Hypotheses tab — the world model with Bayesian confidence
// ---------------------------------------------------------------------------

function emptyHypothesis(): Partial<StrategyHypothesis> {
  return {
    statement: '', domain: 'user', confidence: 50,
    evidenceFor: '', evidenceAgainst: '', lastReviewed: today(), status: 'active',
  };
}

function HypothesesTab({
  hypotheses, signals, onAdd, onUpdate, onDelete,
}: {
  hypotheses: StrategyHypothesis[];
  signals: StrategySignal[];
  onAdd: (h: StrategyHypothesis) => void;
  onUpdate: (h: StrategyHypothesis) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<StrategyHypothesis>>(emptyHypothesis());

  const signalsByHyp = useMemo(() => {
    const m = new Map<string, number>();
    signals.forEach(s => {
      if (s.linkedHypothesisId) m.set(s.linkedHypothesisId, (m.get(s.linkedHypothesisId) ?? 0) + 1);
    });
    return m;
  }, [signals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StrategyHypothesis = {
      id: editingId ?? id(),
      statement: (form.statement ?? '').trim(),
      domain: (form.domain ?? 'user') as HypothesisDomain,
      confidence: Math.max(0, Math.min(100, Number(form.confidence ?? 50))),
      evidenceFor: (form.evidenceFor ?? '').trim(),
      evidenceAgainst: (form.evidenceAgainst ?? '').trim(),
      lastReviewed: form.lastReviewed ?? today(),
      status: (form.status ?? 'active') as HypothesisStatus,
    };
    if (editingId) onUpdate(payload);
    else onAdd(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyHypothesis());
  };

  const adjustConfidence = (h: StrategyHypothesis, delta: number) => {
    const newConfidence = Math.max(0, Math.min(100, h.confidence + delta));
    onUpdate({ ...h, confidence: newConfidence, lastReviewed: today() });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 max-w-xl">
          The current world model. Each belief carries a Bayesian prior — confidence updates as evidence accumulates.
        </p>
        <button
          onClick={() => { setEditingId(null); setForm(emptyHypothesis()); setShowForm(true); }}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus size={16} /> New Hypothesis
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Statement</label>
              <textarea
                required rows={2}
                value={form.statement}
                onChange={e => setForm({ ...form, statement: e.target.value })}
                placeholder='"We believe X because Y."'
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Domain</label>
                <select value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value as HypothesisDomain })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {(Object.keys(HYPOTHESIS_DOMAIN_META) as HypothesisDomain[]).map(k => (
                    <option key={k} value={k}>{HYPOTHESIS_DOMAIN_META[k].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Confidence ({form.confidence}%)</label>
                <input type="range" min={0} max={100} value={form.confidence} onChange={e => setForm({ ...form, confidence: Number(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as HypothesisStatus })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {(Object.keys(HYPOTHESIS_STATUS_META) as HypothesisStatus[]).map(k => (
                    <option key={k} value={k}>{HYPOTHESIS_STATUS_META[k].label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-1 uppercase tracking-wider">Evidence For</label>
                <textarea rows={2} value={form.evidenceFor} onChange={e => setForm({ ...form, evidenceFor: e.target.value })} className="w-full border border-emerald-200 bg-emerald-50/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-red-700 mb-1 uppercase tracking-wider">Evidence Against</label>
                <textarea rows={2} value={form.evidenceAgainst} onChange={e => setForm({ ...form, evidenceAgainst: e.target.value })} className="w-full border border-red-200 bg-red-50/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Add Hypothesis'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hypotheses.map(h => (
          <div key={h.id}>
            <HypothesisCard
              hyp={h}
              signalCount={signalsByHyp.get(h.id) ?? 0}
              onEdit={() => { setEditingId(h.id); setForm({ ...h }); setShowForm(true); }}
              onDelete={() => onDelete(h.id)}
              onAdjust={(delta) => adjustConfidence(h, delta)}
            />
          </div>
        ))}
        {hypotheses.length === 0 && (
          <div className="md:col-span-2 border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center text-zinc-500 text-sm">
            No hypotheses yet. Write down what you currently believe — that is your prior.
          </div>
        )}
      </div>
    </div>
  );
}

function HypothesisCard({
  hyp, signalCount, onEdit, onDelete, onAdjust,
}: {
  hyp: StrategyHypothesis;
  signalCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onAdjust: (delta: number) => void;
}) {
  const status = HYPOTHESIS_STATUS_META[hyp.status];
  const isLow = hyp.confidence < 50;
  const isHigh = hyp.confidence >= 75;
  return (
    <div className={`bg-white border rounded-2xl p-5 group/hyp ${
      isLow ? 'border-red-200' : isHigh ? 'border-emerald-200' : 'border-zinc-200'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ${status.className}`}>
            {status.label}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 px-1.5 py-0.5 bg-zinc-100 rounded">
            {HYPOTHESIS_DOMAIN_META[hyp.domain].label}
          </span>
        </div>
        <div className="opacity-0 group-hover/hyp:opacity-100 transition-opacity flex gap-1">
          <button onClick={onEdit} className="p-1 text-zinc-400 hover:text-zinc-900"><Edit2 size={13} /></button>
          <button onClick={onDelete} className="p-1 text-zinc-400 hover:text-red-600"><Trash2 size={13} /></button>
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-900 leading-snug mb-4">"{hyp.statement}"</p>

      {/* Confidence */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-zinc-500 uppercase tracking-wider font-medium">Confidence</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onAdjust(-10)} className="text-zinc-400 hover:text-red-600 p-0.5"><ArrowDown size={12} /></button>
            <span className={`text-base font-bold tabular-nums ${isLow ? 'text-red-600' : isHigh ? 'text-emerald-700' : 'text-zinc-900'}`}>
              {hyp.confidence}%
            </span>
            <button onClick={() => onAdjust(10)} className="text-zinc-400 hover:text-emerald-600 p-0.5"><ArrowUp size={12} /></button>
          </div>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isLow ? 'bg-red-400' : isHigh ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            style={{ width: `${hyp.confidence}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {hyp.evidenceFor && (
          <div className="flex gap-2">
            <span className="shrink-0 text-emerald-600 mt-0.5"><ArrowUp size={11} /></span>
            <p className="text-zinc-700 leading-snug"><span className="text-emerald-700 font-medium">For —</span> {hyp.evidenceFor}</p>
          </div>
        )}
        {hyp.evidenceAgainst && (
          <div className="flex gap-2">
            <span className="shrink-0 text-red-600 mt-0.5"><ArrowDown size={11} /></span>
            <p className="text-zinc-700 leading-snug"><span className="text-red-700 font-medium">Against —</span> {hyp.evidenceAgainst}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 text-[10px] text-zinc-500 font-mono">
        <span>last reviewed · {hyp.lastReviewed}</span>
        <span>{signalCount} signal{signalCount === 1 ? '' : 's'} linked</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reviews tab — cadenced strategy review log
// ---------------------------------------------------------------------------

function emptyReview(): Partial<StrategyReview> {
  return {
    date: today(),
    cadence: 'weekly',
    worldModelDelta: '',
    signalsProcessed: [],
    hypothesesUpdated: [],
    decision: 'execute_as_planned',
    notes: '',
  };
}

function ReviewsTab({
  reviews, signals, hypotheses, onAdd, onUpdate, onDelete,
}: {
  reviews: StrategyReview[];
  signals: StrategySignal[];
  hypotheses: StrategyHypothesis[];
  onAdd: (r: StrategyReview) => void;
  onUpdate: (r: StrategyReview) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<StrategyReview>>(emptyReview());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: StrategyReview = {
      id: editingId ?? id(),
      date: form.date ?? today(),
      cadence: (form.cadence ?? 'weekly') as ReviewCadence,
      worldModelDelta: (form.worldModelDelta ?? '').trim(),
      signalsProcessed: form.signalsProcessed ?? [],
      hypothesesUpdated: form.hypothesesUpdated ?? [],
      decision: (form.decision ?? 'execute_as_planned') as ReviewDecision,
      notes: (form.notes ?? '').trim(),
    };
    if (editingId) onUpdate(payload);
    else onAdd(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyReview());
  };

  const toggleArrayItem = (key: 'signalsProcessed' | 'hypothesesUpdated', id: string) => {
    const current = (form[key] ?? []) as string[];
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    setForm({ ...form, [key]: next });
  };

  const sorted = useMemo(() => [...reviews].sort((a, b) => b.date.localeCompare(a.date)), [reviews]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 max-w-xl">
          Strategy review at the right cadence — weekly tactical, monthly strategic, quarterly world model.
          Daily belongs to execution, not strategy.
        </p>
        <button
          onClick={() => { setEditingId(null); setForm(emptyReview()); setShowForm(true); }}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus size={16} /> Log Review
        </button>
      </div>

      {/* Cadence legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(CADENCE_META) as ReviewCadence[]).map(c => {
          const count = reviews.filter(r => r.cadence === c).length;
          const meta = CADENCE_META[c];
          return (
            <div key={c} className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3">
              <div className="text-2xl font-bold tabular-nums text-zinc-900 w-10">{count}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900">{meta.label}</div>
                <div className="text-[11px] text-zinc-500 italic">{meta.zh}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Cadence</label>
                <select value={form.cadence} onChange={e => setForm({ ...form, cadence: e.target.value as ReviewCadence })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {(Object.keys(CADENCE_META) as ReviewCadence[]).map(c => (
                    <option key={c} value={c}>{CADENCE_META[c].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Decision</label>
                <select value={form.decision} onChange={e => setForm({ ...form, decision: e.target.value as ReviewDecision })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  {(Object.keys(REVIEW_DECISION_META) as ReviewDecision[]).map(d => (
                    <option key={d} value={d}>{REVIEW_DECISION_META[d].label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">World Model Delta</label>
              <textarea
                required rows={2}
                value={form.worldModelDelta}
                onChange={e => setForm({ ...form, worldModelDelta: e.target.value })}
                placeholder="What changed in your model of the world this period?"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Signals processed</label>
                <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1 bg-zinc-50/50">
                  {signals.length === 0 && <div className="text-xs text-zinc-400 italic p-1">No signals.</div>}
                  {signals.map(s => (
                    <label key={s.id} className="flex items-start gap-2 text-xs hover:bg-white rounded p-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form.signalsProcessed ?? []).includes(s.id)}
                        onChange={() => toggleArrayItem('signalsProcessed', s.id)}
                        className="mt-0.5"
                      />
                      <span className="flex-1 text-zinc-700 leading-snug">
                        <span className="font-mono text-[10px] text-zinc-400">L{s.permissionLevel}</span> {s.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Hypotheses updated</label>
                <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1 bg-zinc-50/50">
                  {hypotheses.length === 0 && <div className="text-xs text-zinc-400 italic p-1">No hypotheses.</div>}
                  {hypotheses.map(h => (
                    <label key={h.id} className="flex items-start gap-2 text-xs hover:bg-white rounded p-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(form.hypothesesUpdated ?? []).includes(h.id)}
                        onChange={() => toggleArrayItem('hypothesesUpdated', h.id)}
                        className="mt-0.5"
                      />
                      <span className="flex-1 text-zinc-700 leading-snug">{h.statement}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1 uppercase tracking-wider">Notes</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Log Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-zinc-200" />
        {sorted.map(r => {
          const dec = REVIEW_DECISION_META[r.decision];
          const cad = CADENCE_META[r.cadence];
          return (
            <div key={r.id} className="relative pb-6 group/rev">
              <div className="absolute -left-[18px] top-2 w-3 h-3 rounded-full bg-white border-2 border-zinc-400" />
              <div className="bg-white border border-zinc-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-zinc-500">{r.date}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white">
                      {cad.label}
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border ${dec.className}`}>
                      {dec.label}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover/rev:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => { setEditingId(r.id); setForm({ ...r }); setShowForm(true); }} className="p-1 text-zinc-400 hover:text-zinc-900"><Edit2 size={13} /></button>
                    <button onClick={() => onDelete(r.id)} className="p-1 text-zinc-400 hover:text-red-600"><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-sm text-zinc-900 leading-snug">{r.worldModelDelta}</p>
                {r.notes && (
                  <p className="text-xs text-zinc-600 mt-2 italic leading-snug border-l-2 border-zinc-200 pl-2">{r.notes}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3 pt-2 border-t border-zinc-100 text-[10px] font-mono text-zinc-500">
                  <span>{r.signalsProcessed.length} signal{r.signalsProcessed.length === 1 ? '' : 's'}</span>
                  <span>{r.hypothesesUpdated.length} hypothesis updated</span>
                </div>
              </div>
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center text-zinc-500 text-sm">
            No reviews logged yet. The first review establishes the baseline world model.
          </div>
        )}
      </div>
    </div>
  );
}
