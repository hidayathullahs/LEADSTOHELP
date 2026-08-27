import React from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Cpu,
  UserCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function Topbar({ onOpenAskAI, onRefreshData, isRefreshing }) {
  return (
    <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
      {/* Search & Quick Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKUs, suppliers, purchase orders, or ask AI..."
            onClick={onOpenAskAI}
            readOnly
            className="w-full bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-800/60"
          />
        </div>
      </div>

      {/* Action Badges & Profile */}
      <div className="flex items-center gap-3">
        {/* Closed-Loop AI Engine Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>Closed-Loop Engine: <strong className="text-white">Active</strong></span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          title="Refresh store telemetry"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg border border-slate-800 transition-all"
        >
          <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Global Ask AI Copilot Button */}
        <button
          onClick={onOpenAskAI}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-black font-bold text-xs shadow-glow-cyan transition-all transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Ask AI Ops</span>
        </button>

        {/* Manager User Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
            AR
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Arjun Rao</p>
            <p className="text-[10px] text-slate-400">Operations Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
