import React, { useEffect } from 'react';
import { X, Command, Sparkles, Search, Layers, Play, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const SHORTCUT_GROUPS = [
    {
      title: 'Global Navigation & AI',
      shortcuts: [
        { key: '⌘K / Ctrl+K', description: 'Open Universal Command Palette', icon: Search },
        { key: '⌘J / Ctrl+J', description: 'Toggle Contextual AI Copilot Drawer', icon: Sparkles },
        { key: '?', description: 'View Keyboard Shortcuts Reference', icon: Command },
        { key: 'Esc', description: 'Close active slide-out drawer or modal', icon: X }
      ]
    },
    {
      title: 'Decisions & Operations',
      shortcuts: [
        { key: 'Alt+1', description: 'Navigate to Control Tower (Track 2)', icon: Layers },
        { key: 'Alt+2', description: 'Navigate to Daily Operations (Track 3)', icon: CheckCircle2 },
        { key: 'Alt+P', description: 'Jump to Procurement Decisions', icon: Play },
        { key: 'Alt+A', description: 'Jump to Human Approval Queue', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-surface-1 border border-white/[0.1] rounded-2xl shadow-2xl p-6 relative space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center text-brand-accent">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-sm font-bold text-white">
                Keyboard Shortcuts Reference
              </h2>
              <p className="text-[11px] text-slate-400">
                Speed up daily operations and high-impact actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcut Groups */}
        <div className="space-y-4">
          {SHORTCUT_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
                {group.title}
              </span>
              <div className="space-y-1.5">
                {group.shortcuts.map((item, sIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-2 rounded-xl bg-surface-2/60 border border-white/[0.04] text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-200 font-medium">{item.description}</span>
                      </div>
                      <kbd className="px-2 py-0.5 rounded-md bg-surface-0 border border-white/[0.1] font-mono text-[11px] font-bold text-brand-accent shadow-sm">
                        {item.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-white/[0.08] font-mono text-[10px] text-slate-300">Esc</kbd> anytime to exit</span>
          <button
            onClick={onClose}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
