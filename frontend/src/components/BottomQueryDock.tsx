import React, { useState } from 'react';
import { GitBranch, Send, Sparkles, Mic, Layers, HelpCircle, CornerDownLeft } from 'lucide-react';
import { Mission, QueryBranch } from '../types';

interface BottomQueryDockProps {
  mission: Mission;
  branches: QueryBranch[];
  activeBranch: QueryBranch | null;
  onCreateBranch: (title: string, question: string, parentBranchId: string | null) => void;
}

export const BottomQueryDock: React.FC<BottomQueryDockProps> = ({
  mission,
  branches,
  activeBranch,
  onCreateBranch,
}) => {
  const [queryText, setQueryText] = useState('');
  const [branchTarget, setBranchTarget] = useState<'root' | 'active'>('root');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) return;

    const trimmed = queryText.trim();
    // Derive a clean title from query
    let title = trimmed;
    if (title.length > 36) {
      title = title.slice(0, 34) + '...';
    }

    const parentId = branchTarget === 'active' && activeBranch ? activeBranch.id : null;
    onCreateBranch(title, trimmed, parentId);
    setQueryText('');
  };

  const missionBranches = branches.filter((b) => b.missionId === mission.id);

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-300/80 rounded-2xl shadow-2xl p-2 md:p-2.5 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
        {/* Top Control Bar: Attachment selector */}
        <div className="flex items-center justify-between px-2 pb-1.5 mb-1 text-[11px] border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="font-semibold text-slate-700">Attach sidequest to:</span>
            <button
              type="button"
              onClick={() => setBranchTarget('root')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                branchTarget === 'root'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Main Mission Root
            </button>
            {activeBranch && (
              <button
                type="button"
                onClick={() => setBranchTarget('active')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all max-w-[150px] truncate ${
                  branchTarget === 'active'
                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={activeBranch.title}
              >
                ↳ {activeBranch.title}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Context Guard Active
            </span>
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <GitBranch className="w-4 h-4 rotate-90" />
          </div>

          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={
              branchTarget === 'active' && activeBranch
                ? `Ask follow-up on "${activeBranch.title}" without derailing mission...`
                : "Ask an unfamiliar question (spawns an isolated learning branch)..."
            }
            className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-900 placeholder:text-slate-400 px-1 py-1"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="submit"
              disabled={!queryText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Branch Out</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
