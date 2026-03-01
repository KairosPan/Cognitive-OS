import React from 'react';
import { LayoutDashboard, Battery, KanbanSquare, CheckSquare } from 'lucide-react';
import { Page } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'energy', label: 'Energy Log', icon: Battery },
    { id: 'pipeline', label: 'Pipeline Board', icon: KanbanSquare },
    { id: 'tasks', label: 'Task Engine', icon: CheckSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 flex text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <span className="bg-zinc-900 text-white p-1.5 rounded-md">
              <LayoutDashboard size={18} />
            </span>
            Cognitive OS
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-zinc-900' : 'text-zinc-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200">
          <div className="text-xs text-zinc-500 font-mono">System Status: Active</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
