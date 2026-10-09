import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, ShieldCheck, Target, Sparkles, FolderGit2 } from 'lucide-react';
import { Mission } from '../types';
import { useToast } from './Toast';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMission: (mission: Mission) => void;
  missionToEdit?: Mission | null;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  onSaveMission,
  missionToEdit,
}) => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [constraints, setConstraints] = useState<string[]>([]);
  const [newConstraint, setNewConstraint] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');
  const [currentBlocker, setCurrentBlocker] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [errors, setErrors] = useState<{ title?: string; objective?: string; nextAction?: string }>({});

  useEffect(() => {
    if (missionToEdit) {
      setTitle(missionToEdit.title);
      setObjective(missionToEdit.objective);
      setConstraints(missionToEdit.constraints || []);
      setCompletedSteps(missionToEdit.completedSteps || []);
      setCurrentBlocker(missionToEdit.currentBlocker || '');
      setNextAction(missionToEdit.nextAction || '');
    } else {
      // Defaults
      setTitle('');
      setObjective('');
      setConstraints(['Use Go', 'Use PostgreSQL', 'Keep architecture simple']);
      setCompletedSteps(['Created project structure', 'Initialized server']);
      setCurrentBlocker('');
      setNextAction('Implement database access');
    }
    setErrors({});
  }, [missionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      setCompletedSteps([...completedSteps, newStep.trim()]);
      setNewStep('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setCompletedSteps(completedSteps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Mission title is required';
    if (!objective.trim()) newErrors.objective = 'Main objective is required';
    if (!nextAction.trim()) newErrors.nextAction = 'Next step is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const mission: Mission = {
      id: missionToEdit ? missionToEdit.id : `mission-${Date.now()}`,
      title: title.trim(),
      objective: objective.trim(),
      constraints,
      completedSteps,
      decisions: missionToEdit ? missionToEdit.decisions : ['Standard REST API architectural pattern'],
      currentBlocker: currentBlocker.trim(),
      nextAction: nextAction.trim(),
      createdAt: missionToEdit ? missionToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    onSaveMission(mission);
    showToast(missionToEdit ? 'Mission updated successfully!' : 'New mission created!', 'success');
    onClose();
  };

  const loadExample = () => {
    setTitle('Build a CRUD API');
    setObjective('Build a CRUD API using Go and PostgreSQL.');
    setConstraints(['Use Go', 'Use PostgreSQL', 'Keep the architecture simple']);
    setCompletedSteps(['Created the project structure', 'Initialized the server']);
    setCurrentBlocker('Clarifying connection pooling parameter tradeoffs before writing migrations.');
    setNextAction('Implement database access');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {missionToEdit ? 'Edit Mission Specification' : 'Create New Mission'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Define the anchor context for your task and branches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!missionToEdit && (
              <button
                type="button"
                onClick={loadExample}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              >
                Load Example CRUD
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Mission Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mission Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build a CRUD API"
              className={`w-full p-2.5 border rounded-xl outline-none transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Main Objective */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Main Objective *
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Build a CRUD API using Go and PostgreSQL."
              className={`w-full p-2.5 border rounded-xl outline-none resize-none transition-all ${
                errors.objective
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
              }`}
            />
            {errors.objective && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.objective}</p>
            )}
          </div>

          {/* Constraints */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Preserved Constraints
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddConstraint();
                  }
                }}
                placeholder="e.g. Use Go, Use PostgreSQL, Keep architecture simple"
                className="flex-1 p-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {constraints.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-lg text-[11px] font-medium"
                >
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConstraint(i)}
                    className="hover:text-rose-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Completed Steps */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Completed Steps
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                placeholder="e.g. Created project structure, Initialized server"
                className="flex-1 p-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {completedSteps.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(i)}
                    className="hover:text-rose-600 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Current Blocker & Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Current Blocker (Optional)
              </label>
              <input
                type="text"
                value={currentBlocker}
                onChange={(e) => setCurrentBlocker(e.target.value)}
                placeholder="e.g. Need to clarify connection pooling parameters"
                className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Next Immediate Step *
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Implement database access"
                className={`w-full p-2.5 border rounded-xl outline-none ${
                  errors.nextAction ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {errors.nextAction && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.nextAction}</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 mt-4 -mx-6 -mb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              {missionToEdit ? 'Save Changes' : 'Create Mission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
