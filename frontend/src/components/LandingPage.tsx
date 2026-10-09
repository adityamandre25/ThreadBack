import React, { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Brain, 
  Terminal, 
  Compass, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Check, 
  FileCode2, 
  Zap, 
  RefreshCw 
} from 'lucide-react';

interface LandingPageProps {
  onEnterWorkspace: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace }) => {
  const [activePreviewNode, setActivePreviewNode] = useState<'root' | 'b1' | 'b2'>('b1');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const previewPrompts = {
    root: 'Continue building the Go CRUD API using PostgreSQL. Current next step is database access.',
    b1: 'Continue building the Go CRUD API using PostgreSQL. The project structure and server are already initialized. The next step is database access. Consider adding middleware for request validation. Do not assume database integration is complete.',
    b2: 'Continue building the Go CRUD API using PostgreSQL. We verified that connection pooling (pgxpool) bounds active connections to protect database RAM while eliminating TCP handshake latency. The next step is database access.',
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewPrompts[activePreviewNode]);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 select-none">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        {/* Ambient subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-400/10 via-violet-400/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Context-Preservation Workspace for Developers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Explore every thought.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent block sm:inline">
              Never lose your thread.
            </span>
          </h1>

          {/* Subtitle / Context-loss explanation */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            When coding with AI, diving into unfamiliar concepts derails your main mission.
            ThreadBack creates isolated SideQuest branches, preserves your original task state, and generates one-click continuation prompts to seamlessly resume.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterWorkspace}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200/80 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Interactive Preview</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE PRODUCT PREVIEW CANVAS                           */}
        {/* ============================================================ */}
        <div id="preview" className="max-w-5xl mx-auto mt-16 px-2">
          <div className="rounded-3xl border border-slate-300/80 bg-white shadow-2xl overflow-hidden">
            {/* Window Top bar */}
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-mono font-medium text-slate-500">
                  threadback-workspace // interactive-preview
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold">
                Click nodes below to test Return to Mission
              </span>
            </div>

            {/* Canvas Area */}
            <div className="p-6 md:p-8 canvas-grid-dots relative overflow-x-auto min-h-[360px] flex flex-col justify-between">
              {/* Interactive Node Flow */}
              <div className="flex items-center gap-8 md:gap-12 min-w-max pb-6">
                {/* Mission Root Card */}
                <div 
                  onClick={() => setActivePreviewNode('root')}
                  className={`w-72 p-4 rounded-2xl bg-white border-2 cursor-pointer transition-all shadow-md ${
                    activePreviewNode === 'root'
                      ? 'border-indigo-600 ring-4 ring-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Original Mission
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Build a CRUD API
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Go + PostgreSQL. Keep architecture simple.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Project structure initialized
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-400 flex items-center">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Branch 1 Card */}
                <div 
                  onClick={() => setActivePreviewNode('b1')}
                  className={`w-64 p-4 rounded-2xl bg-white border-2 cursor-pointer transition-all shadow-md ${
                    activePreviewNode === 'b1'
                      ? 'border-indigo-600 ring-4 ring-indigo-50 scale-105'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      SideQuest #1
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold">Active</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    What is middleware?
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Investigating request validation wrappers in Go HTTP.
                  </p>
                  <div className="text-[10px] text-indigo-600 font-medium">
                    ★ Note: Early exit validation protects DB
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-400 flex items-center">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Branch 2 Card */}
                <div 
                  onClick={() => setActivePreviewNode('b2')}
                  className={`w-64 p-4 rounded-2xl bg-white border-2 cursor-pointer transition-all shadow-md ${
                    activePreviewNode === 'b2'
                      ? 'border-indigo-600 ring-4 ring-indigo-50 scale-105'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      SideQuest #2
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Connection Pooling
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2">
                    How pgxpool prevents PostgreSQL socket exhaustion.
                  </p>
                  <div className="text-[10px] text-violet-600 font-medium">
                    ★ Note: SetMaxOpenConns(25) bounds RAM
                  </div>
                </div>
              </div>

              {/* Recovery Preview Box */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      Reconstructed Continuation Prompt (From Node: {activePreviewNode.toUpperCase()})
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    "{previewPrompts[activePreviewNode]}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyPreview}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={onEnterWorkspace}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Launch Full App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section: "The Context Loss Trap" */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2 block">
            The Fundamental Dilemma
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Side questions kill mission momentum.
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            In standard AI chats, investigating an unfamiliar concept pollutes your context window. By the time you understand middleware or pooling, the LLM has forgotten your original project structure, constraints, and next step.
          </p>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Without ThreadBack */}
          <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200/80">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Without ThreadBack (Linear Drift)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>You ask 4 side questions about PostgreSQL socket pooling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>The AI forgets earlier architectural decisions and Go constraints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>You waste 15 minutes restating your original goal and re-pasting boilerplate.</span>
              </li>
            </ul>
          </div>

          {/* With ThreadBack */}
          <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-200/80 shadow-md">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>With ThreadBack (Isolated Branches)</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Side questions spin up isolated branch nodes that never corrupt the root task.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Key learnings are bookmarked as concise domain takeaways.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>1-Click <strong>Return to Mission</strong> generates a ready-to-run continuation prompt.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2 block">
              Core Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Designed for developer deep work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Mission Memory
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Define objectives, non-negotiable tech constraints, completed milestones, and immediate next steps. Your mission anchor stays immutable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5 rotate-90" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                SideQuest Branching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Branch off freely into sub-questions and concepts. Each branch maintains independent chat history and dedicated learning notes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Context Recovery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Return instantly with a synthesized prompt that merges your root mission with the newly discovered branch takeaways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Concise Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2 block">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How ThreadBack works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-4">
              1
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Anchor Your Mission
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input your main objective, framework constraints, and next step. ThreadBack locks it as your context anchor.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center mb-4">
              2
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Branch into SideQuests
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When an unfamiliar API or architecture question arises, spawn an isolated branch to explore without losing focus.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-4">
              3
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              One-Click Recovery
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hit "Return to Mission" from any node. Copy the synthesized prompt and jump straight back into coding.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={onEnterWorkspace}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch ThreadBack Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <GitBranch className="w-3 h-3 rotate-90" />
            </div>
            <span>ThreadBack</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Explore every thought. Never lose your thread. Built for developer productivity.
          </p>

          <span className="text-[11px] text-slate-400 font-mono">
            Frontend Workspace v1.0
          </span>
        </div>
      </footer>
    </div>
  );
};
