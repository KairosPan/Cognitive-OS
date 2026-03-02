import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { ParkingLotItem } from '../types';

export default function ParkingLot() {
  const { parkingLotItems, addParkingLotItem, updateParkingLotItem, deleteParkingLotItem } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ParkingLotItem>>({
    idea: '',
    category: 'Startup',
    urgency: 'Medium',
    linkedTrack: '',
    reviewWeek: 'Week 1',
  });

  const handleEdit = (item: ParkingLotItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateParkingLotItem({ ...formData, id: editingId } as ParkingLotItem);
    } else {
      addParkingLotItem({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as ParkingLotItem);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ idea: '', category: 'Startup', urgency: 'Medium', linkedTrack: '', reviewWeek: 'Week 1' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <header>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Parking Lot</h2>
          <p className="text-zinc-500 mt-1 flex items-center gap-2">
            Capture all fleeting thoughts. <span className="text-red-500 flex items-center gap-1 text-xs font-semibold bg-red-50 px-2 py-0.5 rounded"><AlertCircle size={12}/> No direct execution allowed.</span>
          </p>
        </header>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ idea: '', category: 'Startup', urgency: 'Medium', linkedTrack: '', reviewWeek: 'Week 1' });
            setShowForm(!showForm);
          }}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> New Idea
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Idea</label>
                <input type="text" required value={formData.idea} onChange={e => setFormData({...formData, idea: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none" placeholder="e.g. Build a new reasoning model for agents..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Startup">Startup</option>
                  <option value="Research">Research</option>
                  <option value="Trading">Trading</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Urgency</label>
                <select value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Linked Track (Optional)</label>
                <select value={formData.linkedTrack} onChange={e => setFormData({...formData, linkedTrack: e.target.value as any})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="">-- None --</option>
                  <option value="Master Course Study">Master Course Study</option>
                  <option value="AI Agent Engineering">AI Agent Engineering</option>
                  <option value="Quant / BTC">Quant / BTC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Review Week</label>
                <select value={formData.reviewWeek} onChange={e => setFormData({...formData, reviewWeek: e.target.value})} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none">
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                  <option value="Future">Future</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                {editingId ? 'Save Changes' : 'Park Idea'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkingLotItems.map(item => (
          <div key={item.id} className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => handleEdit(item)} className="p-1.5 text-zinc-400 hover:text-zinc-900 bg-white rounded-md shadow-sm border border-zinc-200"><Edit2 size={14} /></button>
              <button onClick={() => deleteParkingLotItem(item.id)} className="p-1.5 text-zinc-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-zinc-200"><Trash2 size={14} /></button>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800">
                {item.category}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                item.urgency === 'High' ? 'bg-red-50 border-red-200 text-red-700' :
                item.urgency === 'Medium' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                'bg-zinc-50 border-zinc-200 text-zinc-600'
              }`}>
                {item.urgency}
              </span>
            </div>
            <h3 className="font-medium text-zinc-900 mb-4 pr-12">{item.idea}</h3>
            <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-amber-200/50 pt-3">
              <span>{item.linkedTrack || 'No Track'}</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-100">{item.reviewWeek}</span>
            </div>
          </div>
        ))}
        {parkingLotItems.length === 0 && (
          <div className="col-span-full p-8 text-center text-zinc-500 border-2 border-dashed border-zinc-200 rounded-xl">
            Parking lot is empty. No fleeting thoughts yet.
          </div>
        )}
      </div>
    </div>
  );
}
