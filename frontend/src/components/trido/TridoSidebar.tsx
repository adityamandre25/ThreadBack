import React from 'react';
import { 
  Square, 
  Clock, 
  DownloadCloud, 
  Settings, 
  HelpCircle, 
  Plus, 
  GitBranch, 
  FolderGit2,
  Check
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';

export const TridoSidebar: React.FC = () => {
  const { 
    activeSidebarItem, 
    setActiveSidebarItem, 
    isSidebarOpen, 
    openMissionModal,
    historyMissions, 
    mission,
    loadMission
  } = useCanvasStore();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 h-full bg-[#f8f9fc] border-r border-slate-200/90 flex flex-col justify-between p-4 select-none shrink-0 transition-all">
      {/* Top Section */}
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        {/* "+ New Mission" Button */}
        <button
          onClick={openMissionModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Mission Thread</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1.5 shrink-0">
          {/* Canvas Board */}
          <button
            onClick={() => setActiveSidebarItem('canvas')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeSidebarItem === 'canvas'
                ? 'bg-[#1859c9] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <div className={`p-1 rounded-md border-2 ${
              activeSidebarItem === 'canvas' ? 'border-[#facc15] text-[#facc15]' : 'border-slate-400 text-slate-500'
            }`}>
              <Square className="w-3.5 h-3.5" />
            </div>
            <span>Canvas Board</span>
          </button>

          {/* Riwayat / History */}
          <button
            onClick={() => setActiveSidebarItem('history')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeSidebarItem === 'history'
                ? 'bg-[#1859c9] text-white'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="flex-1 text-left">Thread History</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
              {historyMissions.length}
            </span>
          </button>

          {/* User Guide */}
          <button
            onClick={() => setActiveSidebarItem('guide')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
              activeSidebarItem === 'guide'
                ? 'bg-[#1859c9] text-white'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>User Guide</span>
          </button>
        </nav>

        {/* History Missions List Panel */}
        {activeSidebarItem === 'history' ? (
          <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Persisted Missions
            </span>
            {historyMissions.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-4 text-center">No missions found</p>
            ) : (
              historyMissions.map((h) => {
                const isActive = h.id === mission?.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => loadMission(h.id)}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs transition-all border ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200/70 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="truncate">{h.title}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400">{h.createdAt}</span>
                  </div>
                );
              })
            )}
          </div>
        ) : activeSidebarItem === 'guide' ? (
          <div className="flex-1 overflow-y-auto p-2 text-xs text-slate-600 space-y-2 border-t border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Workflow Guide
            </span>
            <p>1. <strong>Main AI Anchor:</strong> Root node holds your primary task and constraints.</p>
            <p>2. <strong>SideQuests:</strong> Spawn branches to ask technical questions in isolation.</p>
            <p>3. <strong>Return to Mission:</strong> Synthesizes learnings and injects them back into Main AI.</p>
          </div>
        ) : null}
      </div>

      {/* Bottom Profile Pill */}
      <div className="pt-3 border-t border-slate-200/70 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#1859c9] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
          TB
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-slate-900 truncate">ThreadBack</h4>
          <p className="text-[10px] text-slate-500 truncate">SQLite + Gemma AI</p>
        </div>
      </div>
    </aside>
  );
};
