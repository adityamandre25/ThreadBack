import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  GitBranch, 
  Sparkles, 
  Quote, 
  X, 
  Layers, 
  CornerDownLeft, 
  Bot 
} from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

export const ChatGPTBottomBar: React.FC = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { 
    nodes, 
    selectedNodeId, 
    contextSnippet, 
    setContextSnippet, 
    createBranchNode, 
    selectNode,
    toggleChatDrawer 
  } = useCanvasStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const isGenerating = nodes.some((n) => n.status === 'loading');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const query = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Spawn branch node and trigger animated streaming
    await createBranchNode(query, selectedNode.id, contextSnippet || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl select-none pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-300/80 rounded-3xl shadow-2xl p-3 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
        {/* Top Context Indicators (ChatGPT style chips) */}
        <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-slate-400 font-medium text-[11px] shrink-0">Branching from:</span>
            <button
              onClick={() => selectNode(selectedNode.id)}
              className="px-2.5 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 font-semibold text-[11px] truncate max-w-[240px] flex items-center gap-1 transition-colors"
              title={selectedNode.query}
            >
              <GitBranch className="w-3 h-3 rotate-90 shrink-0" />
              <span className="truncate">{selectedNode.query}</span>
            </button>
          </div>

          {/* Quoted Snippet Chip */}
          {contextSnippet && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[11px] shrink-0 animate-in fade-in">
              <Quote className="w-3 h-3 text-violet-500 shrink-0" />
              <span className="truncate max-w-[140px] italic">"{contextSnippet}"</span>
              <button
                onClick={() => setContextSnippet(null)}
                className="hover:text-violet-900 ml-1 p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Thread Guard</span>
          </div>
        </div>

        {/* ChatGPT Style Textarea & Send Control */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputResize}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedNode.id === 'root'
                ? 'Ask an inquiry or branch off (creates a new isolated SideQuest)...'
                : `Ask a follow-up on "${selectedNode.query.slice(0, 30)}..."`
            }
            className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-800 placeholder:text-slate-400 px-2 py-1 resize-none max-h-28 leading-relaxed font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white transition-all shrink-0 cursor-pointer ${
              input.trim() && !isGenerating
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 scale-100 hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
            }`}
            title="Send query and spawn new branch node"
          >
            {isGenerating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
