import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bookmark, 
  ThumbsUp, 
  GitBranch, 
  ChevronRight, 
  X, 
  HelpCircle,
  CheckCircle2,
  Maximize2,
  Copy,
  Plus,
  BookOpen,
  CornerDownRight
} from 'lucide-react';
import { QueryBranch, ChatMessage, Mission } from '../types';
import { simulateAssistantReply } from '../utils/aiSimulator';
import { useToast } from './Toast';

interface BranchChatProps {
  branch: QueryBranch;
  mission: Mission;
  allBranches: QueryBranch[];
  onUpdateBranch: (updated: QueryBranch) => void;
  onOpenRecovery: (branchId: string) => void;
  onClose: () => void;
  onSpawnChildBranch: (parentBranchId: string) => void;
}

export const BranchChat: React.FC<BranchChatProps> = ({
  branch,
  mission,
  allBranches,
  onUpdateBranch,
  onOpenRecovery,
  onClose,
  onSpawnChildBranch,
}) => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'How does this impact runtime performance?',
    'What is the recommended best practice in Go?',
    'Can this be simplified for our CRUD endpoints?',
  ]);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [branch.messages, isTyping]);

  // Find parent branch title if applicable
  const parentBranch = allBranches.find((b) => b.id === branch.parentBranchId);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...branch.messages, userMsg];
    const updatedBranch = {
      ...branch,
      messages: updatedMessages,
    };
    onUpdateBranch(updatedBranch);
    setInputText('');
    setIsTyping(true);

    try {
      // Frontend-only simulation delay
      const sim = await simulateAssistantReply(text, branch.title);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-asst`,
        role: 'assistant',
        content: sim.reply,
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      onUpdateBranch({
        ...branch,
        messages: finalMessages,
      });

      if (sim.suggestedFollowUps && sim.suggestedFollowUps.length > 0) {
        setSuggestedQuestions(sim.suggestedFollowUps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleUseful = (msgId: string) => {
    const updated = branch.messages.map((m) =>
      m.id === msgId ? { ...m, useful: !m.useful } : m
    );
    onUpdateBranch({ ...branch, messages: updated });
    showToast('Feedback noted', 'info');
  };

  const handleSaveAsLearningNote = (content: string) => {
    // Extract first 140 chars as a summary
    const clean = content.split('\n')[0].replace(/[#*`]/g, '').trim();
    const note = clean.length > 150 ? clean.slice(0, 147) + '...' : clean;

    if (branch.learningNotes.includes(note)) {
      showToast('Note already preserved in branch memory', 'info');
      return;
    }

    const updatedNotes = [...branch.learningNotes, note];
    onUpdateBranch({ ...branch, learningNotes: updatedNotes });
    showToast('Saved to Branch Learning Notes & Context Recovery', 'success');
  };

  const handleRemoveLearningNote = (idx: number) => {
    const updatedNotes = branch.learningNotes.filter((_, i) => i !== idx);
    onUpdateBranch({ ...branch, learningNotes: updatedNotes });
    showToast('Note removed', 'info');
  };

  return (
    <aside className="w-80 md:w-96 lg:w-[440px] h-[calc(100vh-4rem)] bg-white border-l border-slate-200/90 shadow-xl flex flex-col z-30 shrink-0 select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex-1 min-w-0 pr-2">
          {/* Breadcrumb hierarchy */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mb-1 truncate">
            <span className="truncate">{mission.title}</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            {parentBranch && (
              <>
                <span className="text-slate-600 truncate">{parentBranch.title}</span>
                <ChevronRight className="w-3 h-3 shrink-0" />
              </>
            )}
            <span className="text-indigo-600 font-semibold truncate">SideQuest</span>
          </div>

          <h3 className="text-xs font-bold text-slate-900 truncate" title={branch.title}>
            {branch.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Return to Mission Signature CTA */}
          <button
            onClick={() => onOpenRecovery(branch.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Synthesize and Return to Mission"
          >
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <span className="hidden sm:inline">Return</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            title="Collapse drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs: Conversation vs Learning Notes */}
      <div className="px-3.5 pt-2 pb-1 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-1.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Discussion ({branch.messages.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-1.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Learnings ({branch.learningNotes.length})</span>
          </button>
        </div>

        <button
          onClick={() => onSpawnChildBranch(branch.id)}
          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Follow-up Branch
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chat' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {/* Branch initial question banner */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Investigating Inquiry
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {branch.question}
            </p>
          </div>

          {/* Messages */}
          {branch.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                  <span>{isUser ? 'You' : 'ThreadBack AI (Simulated)'}</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[92%] text-xs leading-relaxed transition-all ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* Actions for Assistant replies */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleSaveAsLearningNote(msg.content)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium py-0.5 px-1.5 rounded hover:bg-indigo-50 transition-colors"
                        title="Preserve key takeaway for Context Recovery"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save as Learning</span>
                      </button>

                      <button
                        onClick={() => handleToggleUseful(msg.id)}
                        className={`p-1 rounded transition-colors ${
                          msg.useful
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Mark as useful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs max-w-[140px] shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium">Synthesizing</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      ) : (
        /* Preserved Learning Notes Tab */
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          <div className="text-xs text-slate-500 leading-relaxed mb-2">
            Key takeaways saved from this branch will automatically feed into the{' '}
            <strong className="text-slate-700">Return to Mission</strong> prompt reconstruction.
          </div>

          {branch.learningNotes.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-200">
              <Bookmark className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              No learning notes saved yet. Click "Save as Learning" on any assistant response!
            </div>
          ) : (
            branch.learningNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-indigo-100 rounded-xl shadow-2xs relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {note}
                  </p>
                  <button
                    onClick={() => handleRemoveLearningNote(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                    title="Remove note"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Preserved for Prompt Recovery</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Suggested Questions Pills */}
      {activeTab === 'chat' && suggestedQuestions.length > 0 && (
        <div className="px-3.5 py-2 border-t border-slate-100 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Suggested Follow-ups
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="text-[11px] text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 px-2.5 py-1 rounded-lg text-left transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Dock */}
      {activeTab === 'chat' && (
        <div className="p-3 border-t border-slate-200/80 bg-white">
          <div className="relative">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question... (Enter to send, Shift+Enter for newline)"
              className="w-full text-xs p-2.5 pr-10 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors cursor-pointer"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
            <span>Simulated responses for demo</span>
            <span>Local persistence enabled</span>
          </div>
        </div>
      )}
    </aside>
  );
};
