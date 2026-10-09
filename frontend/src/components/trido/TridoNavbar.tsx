import React from 'react';
import { 
  Menu, 
  GitBranch, 
  Sparkles, 
  Share2, 
  Save, 
  HelpCircle, 
  Bot, 
  ChevronDown 
} from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useToast } from '../Toast';

interface TridoNavbarProps {
  onOpenRecovery: () => void;
}

export const TridoNavbar: React.FC<TridoNavbarProps> = ({ onOpenRecovery }) => {
  const { showToast } = useToast();
  const { toggleSidebar, toggleChatDrawer, mission } = useCanvasStore();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Workspace URL copied to clipboard!', 'info');
  };

  const handleSave = () => {
    showToast('Thread and branches saved to local storage.', 'success');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between select-none shrink-0 z-30">
      {/* Left: Hamburger & Brand Pill */}
      <div className="flex items-center gap-3">
        {/* Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Pill (Trido style) */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="w-6 h-6 rounded-lg bg-[#1859c9] text-white flex items-center justify-center font-bold shadow-xs">
            <GitBranch className="w-3.5 h-3.5 rotate-90" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-[#0f172a]">
            ThreadBack
          </span>
          <span className="text-[11px] text-slate-400 font-medium pl-1 border-l border-slate-200 hidden sm:inline">
            Context Workspace
          </span>
        </div>
      </div>

      {/* Center: Mode Cloud Pill (Trido violet accent chip) */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f3ff] border border-[#ddd6fe] text-xs font-semibold text-[#6d28d9]">
        <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
        <span>Mode: Context Guard (Active)</span>
      </div>

      {/* Right Action Pills */}
      <div className="flex items-center gap-2">
        {/* Assistant Button */}
        <button
          onClick={() => toggleChatDrawer()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-600" />
          <span>Assistant</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share</span>
        </button>

        {/* Signature Return to Mission Button */}
        <button
          onClick={onOpenRecovery}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
          title="Synthesize sidequest findings and recover continuation prompt"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Return to Mission</span>
        </button>

        {/* Save / Simpan Pill */}
        <button
          onClick={handleSave}
          className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>Save</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Help Circle */}
        <button 
          onClick={() => showToast('ThreadBack AI: Explore every thought without losing context.', 'info')}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Avatar Circle */}
        <div className="w-7 h-7 rounded-full bg-[#1859c9] text-white flex items-center justify-center font-bold text-xs shrink-0">
          G
        </div>
      </div>
    </header>
  );
};
