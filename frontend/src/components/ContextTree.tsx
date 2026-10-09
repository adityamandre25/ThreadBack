import React, { useRef, useState, useEffect } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  MessageSquare, 
  Bookmark, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Target
} from 'lucide-react';
import { Mission, QueryBranch } from '../types';

interface ContextTreeProps {
  mission: Mission;
  branches: QueryBranch[];
  activeBranchId: string | null;
  onSelectBranch: (branchId: string) => void;
  onOpenRecovery: (branchId?: string) => void;
  onAddChildBranch: (parentBranchId: string | null) => void;
  onDeleteBranch: (branchId: string) => void;
  onRenameBranch: (branchId: string, newTitle: string) => void;
  onEditMission: () => void;
}

export const ContextTree: React.FC<ContextTreeProps> = ({
  mission,
  branches,
  activeBranchId,
  onSelectBranch,
  onOpenRecovery,
  onAddChildBranch,
  onDeleteBranch,
  onRenameBranch,
  onEditMission,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Filter branches for this mission
  const missionBranches = branches.filter((b) => b.missionId === mission.id);

  // Group branches into hierarchical tiers:
  // Root level branches (parentBranchId === null)
  const rootBranches = missionBranches.filter((b) => !b.parentBranchId);

  // Helper to find child branches of a given branch
  const getChildren = (parentId: string) => {
    return missionBranches.filter((b) => b.parentBranchId === parentId);
  };

  const handleStartRename = (branch: QueryBranch, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBranchId(branch.id);
    setEditingTitle(branch.title);
  };

  const handleSaveRename = (branchId: string) => {
    if (editingTitle.trim()) {
      onRenameBranch(branchId, editingTitle.trim());
    }
    setEditingBranchId(null);
  };

  const handleKeyDownRename = (e: React.KeyboardEvent, branchId: string) => {
    if (e.key === 'Enter') {
      handleSaveRename(branchId);
    } else if (e.key === 'Escape') {
      setEditingBranchId(null);
    }
  };

  return (
    <div className="relative w-full h-full overflow-auto canvas-grid-dots p-6 md:p-10 select-none flex flex-col justify-between">
      {/* Canvas Top Bar HUD */}
      <div className="flex items-center justify-between gap-4 mb-6 z-10">
        <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-700">Context Flow Map</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500">
            {missionBranches.length} Active SideQuests
          </span>
        </div>

        {/* Zoom & Canvas controls */}
        <div className="flex items-center gap-1 bg-white/95 p-1 rounded-2xl border border-slate-200/80 shadow-xs backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold px-2 text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Flow Canvas Tree */}
      <div 
        className="flex-1 transition-transform duration-200 origin-top-left flex items-start gap-12 lg:gap-16 min-w-max pb-24"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* ============================================================ */}
        {/* TIER 1: ORIGINAL MISSION CONTEXT NODE                        */}
        {/* ============================================================ */}
        <div className="flex flex-col items-start shrink-0 relative group">
          <div className="w-80 md:w-96 rounded-2xl bg-white border-2 border-indigo-500/80 shadow-xl shadow-indigo-500/10 p-5 transition-all hover:shadow-2xl hover:border-indigo-600">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                  Original Context Root
                </span>
              </div>
              <button
                onClick={onEditMission}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            {/* Mission Title */}
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1.5">
              {mission.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {mission.objective}
            </p>

            {/* Preserved Constraints */}
            <div className="mb-3.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                Preserved Constraints
              </span>
              <div className="flex flex-wrap gap-1.5">
                {mission.constraints.map((c, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Completed Steps & Next Action */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 font-semibold">Done:</strong>{' '}
                  {mission.completedSteps.join(', ')}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                <Target className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Next Step:</strong> {mission.nextAction}
                </span>
              </div>
            </div>

            {/* Branch Out Button directly from Mission */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onAddChildBranch(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start SideQuest</span>
              </button>

              <button
                onClick={() => onOpenRecovery()}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Context Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TIER 2 & 3: BRANCHES & SUB-QUERIES (AS DRAWN IN SKETCH)     */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-10">
          {rootBranches.length === 0 ? (
            <div className="w-80 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center bg-white/50">
              <GitBranch className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-600 mb-1">
                No SideQuests spawned yet
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                Branch off when you need to research unfamiliar concepts without losing context.
              </p>
              <button
                onClick={() => onAddChildBranch(null)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Start First Branch
              </button>
            </div>
          ) : (
            rootBranches.map((rootBranch) => {
              const children = getChildren(rootBranch.id);
              const isActive = activeBranchId === rootBranch.id;

              return (
                <div key={rootBranch.id} className="flex items-start gap-8 lg:gap-12 relative">
                  {/* SVG Connector curve from left to rootBranch */}
                  <div className="absolute -left-12 lg:-left-16 top-16 w-12 lg:w-16 h-1 pointer-events-none">
                    <svg className="w-full h-12 -top-6 absolute overflow-visible">
                      <path
                        d="M 0 24 C 24 24, 24 24, 48 24"
                        fill="none"
                        stroke={isActive ? '#6366f1' : '#cbd5e1'}
                        strokeWidth="2.5"
                        strokeDasharray={isActive ? '4 4' : 'none'}
                        className={isActive ? 'animate-flow-line' : ''}
                      />
                    </svg>
                  </div>

                  {/* BRANCH 1 CARD: "The 1st query details related to it" */}
                  <div className="flex flex-col items-center">
                    <div
                      onClick={() => onSelectBranch(rootBranch.id)}
                      className={`w-72 md:w-80 rounded-2xl bg-white border-2 p-4 cursor-pointer transition-all duration-200 relative group shadow-sm hover:shadow-lg ${
                        isActive
                          ? 'border-indigo-600 shadow-indigo-500/15 ring-4 ring-indigo-50/80 scale-[1.02]'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            SideQuest Branch
                          </span>
                        </div>

                        {/* Inline Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleStartRename(rootBranch, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Rename branch"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBranch(rootBranch.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete branch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Branch Title (editable or static) */}
                      {editingBranchId === rootBranch.id ? (
                        <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleSaveRename(rootBranch.id)}
                            onKeyDown={(e) => handleKeyDownRename(e, rootBranch.id)}
                            autoFocus
                            className="w-full px-2 py-1 text-xs font-bold border border-indigo-400 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </div>
                      ) : (
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                          {rootBranch.title}
                        </h4>
                      )}

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {rootBranch.question}
                      </p>

                      {/* Metadata badges */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Messages count">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                            {rootBranch.messages.length}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-600 font-medium" title="Learning notes saved">
                            <Bookmark className="w-3.5 h-3.5" />
                            {rootBranch.learningNotes.length} notes
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddChildBranch(rootBranch.id);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Spawn follow-up branch"
                        >
                          <Plus className="w-3.5 h-3.5" /> Follow-up
                        </button>
                      </div>
                    </div>

                    {/* ============================================================ */}
                    {/* SIGNATURE FEATURE: RETURN TO MISSION BUTTON AFTER NODE       */}
                    {/* (Highlighted in the user's sketch as diamond / button)      */}
                    {/* ============================================================ */}
                    <div className="mt-3 flex items-center justify-center">
                      <button
                        onClick={() => onOpenRecovery(rootBranch.id)}
                        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white text-[11px] font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Return to Mission: Synthesize learnings and recover continuation prompt"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-200 group-hover:rotate-12 transition-transform" />
                        <span>Return to Mission</span>
                        <ChevronRight className="w-3 h-3 opacity-75 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* ============================================================ */}
                  {/* TIER 3: CHILD FOLLOW-UP QUERIES ("the 2nd query" in sketch) */}
                  {/* ============================================================ */}
                  {children.length > 0 && (
                    <div className="flex flex-col gap-6 pl-4 relative">
                      {children.map((child) => {
                        const isChildActive = activeBranchId === child.id;

                        return (
                          <div key={child.id} className="flex flex-col items-center relative">
                            {/* SVG curve from parent to child */}
                            <div className="absolute -left-8 top-12 w-8 h-1 pointer-events-none">
                              <svg className="w-full h-12 -top-6 absolute overflow-visible">
                                <path
                                  d="M 0 24 C 16 24, 16 24, 32 24"
                                  fill="none"
                                  stroke={isChildActive ? '#6366f1' : '#cbd5e1'}
                                  strokeWidth="2"
                                  strokeDasharray={isChildActive ? '4 4' : 'none'}
                                  className={isChildActive ? 'animate-flow-line' : ''}
                                />
                              </svg>
                            </div>

                            <div
                              onClick={() => onSelectBranch(child.id)}
                              className={`w-64 md:w-72 rounded-2xl bg-white border p-3.5 cursor-pointer transition-all duration-200 relative group shadow-2xs hover:shadow-md ${
                                isChildActive
                                  ? 'border-violet-600 shadow-violet-500/15 ring-3 ring-violet-50/80 scale-[1.02]'
                                  : 'border-slate-200/90 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                                  Follow-up Query
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => handleStartRename(child, e)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                                    title="Rename"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteBranch(child.id);
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {editingBranchId === child.id ? (
                                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onBlur={() => handleSaveRename(child.id)}
                                    onKeyDown={(e) => handleKeyDownRename(e, child.id)}
                                    autoFocus
                                    className="w-full px-2 py-1 text-xs font-bold border border-violet-400 rounded-lg outline-none"
                                  />
                                </div>
                              ) : (
                                <h5 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                                  {child.title}
                                </h5>
                              )}

                              <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                                {child.question}
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                                <span>{child.messages.length} msgs</span>
                                <span className="text-violet-600 font-semibold">
                                  {child.learningNotes.length} notes
                                </span>
                              </div>
                            </div>

                            {/* Return Button for Child Node */}
                            <div className="mt-2.5">
                              <button
                                onClick={() => onOpenRecovery(child.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs"
                                title="Return to Mission from this follow-up"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-300" />
                                <span>Return to Mission</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
