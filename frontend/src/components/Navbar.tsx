import React from 'react';
import { GitBranch, Compass, Sparkles, Plus, RotateCcw, ArrowRight } from 'lucide-react';
import { Mission, ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeMission: Mission | null;
  onNewMission: () => void;
  onOpenRecovery: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeMission,
  onNewMission,
  onOpenRecovery,
  onResetDemo,
}) => {
  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between gap-4 select-none">
      {/* Left: Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveTab('workspace')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GitBranch className="w-5 h-5 rotate-90" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
                ThreadBack
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Workspace
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-normal">
              Explore every thought. Never lose your thread.
            </p>
          </div>
        </div>

        {/* View switcher tabs */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 ml-4">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'workspace'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Workspace
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'landing'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Overview
          </button>
        </div>
      </div>

      {/* Middle: Active Mission Pill */}
      {activeMission && activeTab === 'workspace' && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs shadow-2xs max-w-md truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-slate-400 font-medium shrink-0">Mission:</span>
          <span className="font-semibold text-slate-800 truncate">{activeMission.title}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 truncate text-[11px]">Next: {activeMission.nextAction}</span>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {activeTab === 'workspace' ? (
          <>
            {/* Signature "Return to Mission" Button */}
            <button
              onClick={onOpenRecovery}
              className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              title="Signature feature: Synthesize branch findings and recover main mission context prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Return to Mission</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold">
                Recovery
              </span>
            </button>

            {/* New Mission Button */}
            <button
              onClick={onNewMission}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Mission</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              title="Reset state to initial sample CRUD API data"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('workspace')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
