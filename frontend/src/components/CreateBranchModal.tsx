import React, { useState, useEffect } from 'react';
import { X, GitBranch, HelpCircle, ArrowRight } from 'lucide-react';
import { Mission, QueryBranch } from '../types';
import { useToast } from './Toast';

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  branches: QueryBranch[];
  initialParentId: string | null;
  onCreateBranch: (title: string, question: string, parentBranchId: string | null) => void;
}

export const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  isOpen,
  onClose,
  mission,
  branches,
  initialParentId,
  onCreateBranch,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [parentId, setParentId] = useState<string | null>(initialParentId);
  const [error, setError] = useState('');

  useEffect(() => {
    setParentId(initialParentId);
    setTitle('');
    setQuestion('');
    setError('');
  }, [initialParentId, isOpen]);

  if (!isOpen) return null;

  const missionBranches = branches.filter((b) => b.missionId === mission.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) {
      setError('Both title and initial question are required');
      return;
    }

    onCreateBranch(title.trim(), question.trim(), parentId);
    showToast('New SideQuest branch opened!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <GitBranch className="w-4 h-4 rotate-90" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Spawn SideQuest Branch
              </h3>
              <p className="text-[11px] text-slate-500">
                Explore a concept in isolation without derailing {mission.title}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">{error}</div>}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Branch Parent Anchor
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Main Mission Root: {mission.title}</option>
              {missionBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  ↳ Branch: {b.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              SideQuest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What is database connection pooling?"
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Inquiry / Starting Question *
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How does pooling improve latency and manage PostgreSQL socket connections in Go?"
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md cursor-pointer"
            >
              Create Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
