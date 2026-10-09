import React, { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  FolderGit2, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Mission, QueryBranch } from '../types';

interface SidebarProps {
  missions: Mission[];
  activeMission: Mission | null;
  branches: QueryBranch[];
  onSelectMission: (missionId: string) => void;
  onNewMission: () => void;
  onSelectBranch: (branchId: string) => void;
  activeBranchId: string | null;
  onOpenRecovery: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onDeleteMission?: (missionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  missions,
  activeMission,
  branches,
  onSelectMission,
  onNewMission,
  onSelectBranch,
  activeBranchId,
  onOpenRecovery,
  isCollapsed,
  setIsCollapsed,
  onDeleteMission,
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'saved'>('missions');

  const currentBranches = branches.filter((b) => b.missionId === activeMission?.id);
  const allLearningNotes = currentBranches.flatMap((b) => 
    b.learningNotes.map((note) => ({ note, branchTitle: b.title, branchId: b.id }))
  );

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 select-none z-20 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Top Header / Collapse Toggle */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Missions Hub
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Action: New Mission */}
      <div className="p-3">
        <button
          onClick={onNewMission}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Create New Mission"
        >
          <Plus className="w-4 h-4 text-indigo-400 shrink-0" />
          {!isCollapsed && <span>New Mission</span>}
        </button>
      </div>

      {/* Current Active Mission Card */}
      {!isCollapsed && activeMission && (
        <div className="px-3 pb-2">
          <div className="p-3 rounded-xl bg-gradient-to-b from-indigo-50/60 to-slate-50 border border-indigo-100/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100/60 px-2 py-0.5 rounded-full">
                Active Mission
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentBranches.length} {currentBranches.length === 1 ? 'branch' : 'branches'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
              {activeMission.title}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
              {activeMission.objective}
            </p>

            <button
              onClick={onOpenRecovery}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-[11px] font-semibold transition-all shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Context Recovery</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs: Recent Missions vs Saved Learning Notes */}
      {!isCollapsed && (
        <div className="px-3 pt-1 pb-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex-1 py-1 rounded-md text-center transition-all ${
                activeTab === 'missions'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Missions ({missions.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-1 rounded-md text-center transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'hover:text-slate-900'
              }`}
            >
              SideQuests ({allLearningNotes.length})
            </button>
          </div>
        </div>
      )}

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {activeTab === 'missions' ? (
          <>
            {missions.map((mission) => {
              const isCurrent = mission.id === activeMission?.id;
              const bCount = branches.filter((b) => b.missionId === mission.id).length;

              return (
                <div
                  key={mission.id}
                  onClick={() => onSelectMission(mission.id)}
                  className={`group relative flex items-center gap-2.5 p-2 rounded-xl text-left cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/80 text-indigo-950 font-medium border border-indigo-200/80 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                  title={mission.title}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold truncate block">
                          {mission.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{bCount} {bCount === 1 ? 'branch' : 'branches'}</span>
                        <span>•</span>
                        <span>{mission.completedSteps.length} done</span>
                      </div>
                    </div>
                  )}

                  {!isCollapsed && missions.length > 1 && onDeleteMission && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMission(mission.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                      title="Delete mission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          /* Saved Learning Notes / SideQuests */
          <>
            {!isCollapsed && allLearningNotes.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-xs">
                No learning notes saved yet. Star answers in the branch chat to preserve insights!
              </div>
            )}
            {allLearningNotes.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectBranch(item.branchId)}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-all group ${
                  activeBranchId === item.branchId
                    ? 'bg-violet-50/70 border-violet-200 text-violet-950'
                    : 'bg-white border-slate-200/60 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-semibold mb-1">
                  <Bookmark className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="truncate">{item.branchTitle}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {item.note}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 text-center">
        {!isCollapsed ? (
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Local State Persistent
            </span>
            <span className="text-[10px] font-mono text-slate-400">v1.0</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" title="Local persistent active"></div>
        )}
      </div>
    </aside>
  );
};
