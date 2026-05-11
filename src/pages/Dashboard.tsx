import React from 'react';
import { useStore } from '../context/StoreContext';
import { AlertCircle, BatteryCharging, BrainCircuit, Target, Calendar, Shield, ArrowRight, Sparkles, Star, Compass, Activity } from 'lucide-react';

export default function Dashboard() {
  const {
    tasks, projects, energyLogs, weeklyPlan, updateWeeklyPlan,
    infoItems, frameworks, reflections,
    strategySignals, strategyHypotheses, strategyReviews,
  } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = energyLogs.find(log => log.date === today);
  const todayMentalClarity = todayLog?.mentalClarity || 10;

  // Rule: Mental Clarity <= 5 -> No High Energy tasks
  const canDoHighEnergy = todayMentalClarity > 5;

  const todayTasks = tasks.filter(t => t.date === today);

  const activeProjects = projects.filter(p => p.stage !== 'Archived' && p.stage !== 'Done');

  const highDepthProjects = projects.filter(p =>
    p.depthScore >= 8 &&
    (p.stage === 'Researching' || p.stage === 'Doing')
  );

  // Info Firewall stats
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const blockedCount = infoItems.filter(i => i.status === 'blocked').length;
  const tier1Today = infoItems.filter(i => i.tier === 1 && i.date === today).length;
  const tier3Week = infoItems.filter(i => i.tier === 3 && i.date >= sevenDaysAgo).length;
  const tier1Over = tier1Today > 5;
  const tier3High = tier3Week > 10;
  const firewallCanIngest = blockedCount === 0;

  // Strategy layer stats
  const pendingSignals = strategySignals.filter(s => s.decision === 'pending').length;
  const monitoringSignals = strategySignals.filter(s => s.decision === 'monitor').length;
  const activeHypotheses = strategyHypotheses.filter(h => h.status === 'active');
  const lowConfidenceCount = activeHypotheses.filter(h => h.confidence < 50).length;
  const lastReview = strategyReviews[0];
  const daysSinceReview = lastReview
    ? Math.floor((Date.now() - new Date(lastReview.date).getTime()) / 86400000)
    : null;
  const reviewOverdue = daysSinceReview !== null && daysSinceReview > 7;

  // Today's Principle — deterministic per-day pick from Permanent reflections
  const principleCandidates = reflections.filter(r => r.weight === 'Permanent' || (r.principle && r.principle.trim()));
  let todaysPrinciple: typeof reflections[number] | undefined;
  if (principleCandidates.length > 0) {
    const seed = Number(today.replace(/-/g, ''));
    todaysPrinciple = principleCandidates[seed % principleCandidates.length];
  }

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

      {/* Info Firewall Alert */}
      {!firewallCanIngest && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="text-orange-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-orange-800">Firewall: {blockedCount} blocked input{blockedCount === 1 ? '' : 's'}</h4>
            <p className="text-sm text-orange-600 mt-1">No output bound. Process or discard before ingesting more — the rule is "no output → no input".</p>
          </div>
        </div>
      )}

      {/* Strategy Review Alert */}
      {reviewOverdue && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
          <Compass className="text-indigo-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-indigo-900">Strategy review overdue ({daysSinceReview}d since last)</h4>
            <p className="text-sm text-indigo-700 mt-1">Weekly tactical review keeps drift in check without inviting daily re-optimization.</p>
          </div>
        </div>
      )}

      {/* Weekly Control Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm text-white">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-zinc-400" size={20} />
          <h3 className="font-semibold text-white">Weekly Control Panel</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">This Week Focus</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-xs w-16">Track 1</span>
                <input
                  type="text"
                  value={weeklyPlan.focus1}
                  onChange={e => updateWeeklyPlan({ ...weeklyPlan, focus1: e.target.value })}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:ring-1 focus:ring-zinc-500 outline-none"
                  placeholder="Main Focus 1..."
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-xs w-16">Track 2</span>
                <input
                  type="text"
                  value={weeklyPlan.focus2}
                  onChange={e => updateWeeklyPlan({ ...weeklyPlan, focus2: e.target.value })}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:ring-1 focus:ring-zinc-500 outline-none"
                  placeholder="Main Focus 2..."
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Deep Sessions Planned</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-xs w-8 capitalize">{day}</span>
                  <input
                    type="text"
                    value={weeklyPlan[day as keyof typeof weeklyPlan]}
                    onChange={e => updateWeeklyPlan({ ...weeklyPlan, [day]: e.target.value })}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 focus:ring-1 focus:ring-zinc-500 outline-none"
                    placeholder="Planned session..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Principle */}
      {todaysPrinciple && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="text-emerald-600 mt-0.5 shrink-0" size={18} />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-1 flex items-center gap-1">
                <Star size={10} /> Today's Principle
              </div>
              <p className="text-base text-emerald-900 font-medium italic leading-snug">
                "{todaysPrinciple.principle || todaysPrinciple.insight}"
              </p>
              <div className="text-xs text-emerald-700/70 mt-2">
                {todaysPrinciple.category} · {todaysPrinciple.date}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Firewall → Strategy → Pipeline flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Info Firewall Status Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-zinc-900">Information Firewall</h3>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${firewallCanIngest ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
            {firewallCanIngest ? 'OPEN' : 'GATED'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Tier 1 Today</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${tier1Over ? 'text-red-600' : 'text-zinc-900'}`}>{tier1Today}</span>
              <span className="text-sm text-zinc-400">/ 5</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Blocked</div>
            <div className="mt-1">
              <span className={`text-2xl font-bold ${blockedCount > 0 ? 'text-orange-600' : 'text-zinc-900'}`}>{blockedCount}</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Tier 3 / 7d</div>
            <div className="mt-1">
              <span className={`text-2xl font-bold ${tier3High ? 'text-zinc-500' : 'text-zinc-900'}`}>{tier3Week}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 text-xs text-zinc-500 flex items-center gap-2">
          <ArrowRight size={12} />
          <span>
            {frameworks.length} compression framework{frameworks.length === 1 ? '' : 's'} active · {infoItems.length} signal{infoItems.length === 1 ? '' : 's'} total
          </span>
        </div>
      </div>

      {/* Strategy Layer Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-zinc-900">Strategy Layer</h3>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            pendingSignals === 0 && !reviewOverdue
              ? 'bg-emerald-100 text-emerald-700'
              : reviewOverdue
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-amber-100 text-amber-700'
          }`}>
            {reviewOverdue ? 'REVIEW DUE' : pendingSignals > 0 ? 'PENDING' : 'CALIBRATED'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Pending</div>
            <div className="mt-1">
              <span className={`text-2xl font-bold ${pendingSignals > 5 ? 'text-orange-600' : 'text-zinc-900'}`}>{pendingSignals}</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Monitoring</div>
            <div className="mt-1">
              <span className="text-2xl font-bold text-zinc-900">{monitoringSignals}</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500">Low confidence</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${lowConfidenceCount > 0 ? 'text-red-600' : 'text-zinc-900'}`}>{lowConfidenceCount}</span>
              <span className="text-sm text-zinc-400">/ {activeHypotheses.length}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-100 text-xs text-zinc-500 flex items-center gap-2">
          <Activity size={12} />
          <span>
            {daysSinceReview === null
              ? 'No review yet'
              : daysSinceReview === 0
                ? 'Reviewed today'
                : `Last review ${daysSinceReview}d ago`}
            {' · '}
            70 / 20 / 10 budget
          </span>
        </div>
      </div>

      </div>

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
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.energyRequired === 'High' ? 'bg-red-100 text-red-700' :
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
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-zinc-400" size={20} />
            <h3 className="font-semibold text-zinc-900">High-Depth Focus</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Depth Score ≥ 8 • Researching/Doing</p>
          <div className="space-y-3">
            {highDepthProjects.length === 0 ? (
              <p className="text-sm text-zinc-500">No high-depth projects active.</p>
            ) : (
              highDepthProjects.map(project => (
                <div key={project.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-zinc-900">{project.title}</span>
                    <span className="text-xs font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                      Depth: {project.depthScore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>Stage: <span className="text-zinc-700 font-medium">{project.stage}</span></span>
                    {project.focusTime && (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        {project.focusTime}
                      </span>
                    )}
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
