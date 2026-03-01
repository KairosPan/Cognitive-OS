import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus } from 'lucide-react';
import { EnergyLog } from '../types';

export default function EnergyLogPage() {
  const { energyLogs, addEnergyLog } = useStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Partial<EnergyLog>>({
    date: new Date().toISOString().split('T')[0],
    sleepHours: 7,
    physicalState: 'Normal',
    mentalClarity: 7,
    stressLevel: 5,
    deepWorkDone: false,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEnergyLog({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as EnergyLog);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Energy Log</h2>
          <p className="text-zinc-500 mt-1">Track cognitive fatigue and mental clarity.</p>
        </header>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> Log Energy
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Sleep Hours</label>
                <input type="number" step="0.5" required value={formData.sleepHours} onChange={e => setFormData({...formData, sleepHours: parseFloat(e.target.value)})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Physical State</label>
                <select value={formData.physicalState} onChange={e => setFormData({...formData, physicalState: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Good">Good</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Mental Clarity (1-10)</label>
                <input type="number" min="1" max="10" required value={formData.mentalClarity} onChange={e => setFormData({...formData, mentalClarity: parseInt(e.target.value)})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Stress Level (1-10)</label>
                <input type="number" min="1" max="10" required value={formData.stressLevel} onChange={e => setFormData({...formData, stressLevel: parseInt(e.target.value)})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" />
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer">
                  <input type="checkbox" checked={formData.deepWorkDone} onChange={e => setFormData({...formData, deepWorkDone: e.target.checked})} className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4" />
                  Deep Work Done?
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" rows={2}></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">Save Log</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Sleep</th>
              <th className="px-6 py-3">Physical</th>
              <th className="px-6 py-3">Clarity</th>
              <th className="px-6 py-3">Stress</th>
              <th className="px-6 py-3">Deep Work</th>
              <th className="px-6 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {energyLogs.map(log => (
              <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900">{log.date}</td>
                <td className="px-6 py-4 text-zinc-600">{log.sleepHours}h</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.physicalState === 'Good' ? 'bg-emerald-100 text-emerald-700' :
                    log.physicalState === 'Normal' ? 'bg-zinc-100 text-zinc-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {log.physicalState}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full ${log.mentalClarity > 7 ? 'bg-emerald-500' : log.mentalClarity > 4 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${(log.mentalClarity / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-zinc-600 text-xs">{log.mentalClarity}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full ${log.stressLevel < 4 ? 'bg-emerald-500' : log.stressLevel < 7 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${(log.stressLevel / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-zinc-600 text-xs">{log.stressLevel}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {log.deepWorkDone ? (
                    <span className="text-emerald-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-zinc-400">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-zinc-500 max-w-xs truncate" title={log.notes}>{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
