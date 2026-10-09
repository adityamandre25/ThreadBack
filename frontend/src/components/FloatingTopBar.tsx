import React from 'react';
import { 
  GitBranch, 
  Sparkles, 
  Menu, 
  MessageSquare, 
  RotateCcw, 
  Layers, 
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { ActiveTab } from '../types';

interface FloatingTopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRecovery: () => void;
  onResetDemo: () => void;
}

export const FloatingTopBar: React.FC<FloatingTopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRecovery,
  onResetDemo,
}) => {
  const { mission, isChatDrawerOpen, toggleChatDrawer, nodes, selectedNodeId } = useCanvasStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-6xl select-none pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full shadow-lg shadow-slate-900/5 px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand & Mode pill */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('workspace')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GitBranch className="w-4 h-4 rotate-90" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 hidden sm:inline">
              ThreadBack
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

          {/* Active Mission Pill (Trido style) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-medium text-[11px]">Mission:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
              {mission.title}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
              {mission.nextAction}
            </span>
          </div>
        </div>

        {/* Center: Workspace vs Overview tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/60 text-xs">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Signature Return to Mission Button */}
          <button
            onClick={onOpenRecovery}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Return to Mission Context Recovery"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Return to Mission</span>
            <span className="text-[10px] bg-white/20 px-1.5 rounded-full font-bold">
              Recovery
            </span>
          </button>

          {/* Toggle Chat Drawer */}
          <button
            onClick={() => toggleChatDrawer()}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isChatDrawerOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Toggle Side Chat Panel"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Reset Demo button */}
          <button
            onClick={onResetDemo}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset Demo State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
