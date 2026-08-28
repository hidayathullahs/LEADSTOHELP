import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  Cpu,
  RotateCcw,
  Database,
  ShieldCheck,
  ChevronDown,
  Activity,
  CheckCircle2,
  Command,
  HelpCircle,
  Building2,
  Store
} from 'lucide-react';
import { api } from '../services/api';

export default function Topbar({ onOpenAskAI, onRefreshData, isRefreshing }) {
  const [systemStatus, setSystemStatus] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const status = await api.getSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.warn('System status probe:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [isRefreshing]);

  // Handle outside click for system status popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isGeminiLive = systemStatus?.gemini?.live_available;
  const isFirestoreCloud = systemStatus?.firestore?.is_cloud;
  const isAuthStrict = systemStatus?.authentication?.enforced;

  return (
    <header className="h-14 bg-surface-0/90 backdrop-blur-xl border-b border-white/[0.06] px-5 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Left: Store Selector & Command Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Store Hub Breadcrumb Badge */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-1 border border-white/[0.06] text-xs">
          <Store className="w-3.5 h-3.5 text-brand-accent" />
          <span className="font-semibold text-slate-200">Deccan Roast Hub</span>
          <span className="text-[10px] text-slate-500 font-mono">#BLR-01</span>
        </div>

        {/* Global Command Bar / Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKUs, suppliers, POs, or ask AI (Press ⌘K)..."
            onClick={onOpenAskAI}
            readOnly
            className="w-full bg-surface-1 hover:bg-surface-2 border border-white/[0.06] hover:border-white/[0.12] text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-8 pr-12 py-1.5 focus:outline-none focus:border-brand-accent/50 cursor-pointer transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-3 border border-white/[0.08] text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls & Health Status */}
      <div className="flex items-center gap-3">
        {/* Unified System Health Status Popover */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-white/[0.06] hover:border-white/[0.12] text-xs transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium hidden sm:inline">System Health</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-3 text-slate-300 border border-white/[0.06]">
              {isGeminiLive ? 'LIVE' : 'DEMO'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Health Dropdown Panel */}
          {statusMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-2 border border-white/[0.1] rounded-xl shadow-2xl p-3.5 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-accent" />
                  Telemetry Subsystems
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Nominal
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Gemini Model */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-slate-200 font-medium block leading-tight">Gemini 2.5 Flash</span>
                      <span className="text-[10px] text-slate-500 font-mono">Reasoning & Multimodal</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isGeminiLive
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {isGeminiLive ? 'LIVE CLOUD' : 'OFFLINE DEMO'}
                  </span>
                </div>

                {/* Firestore Persistence */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-slate-200 font-medium block leading-tight">Persistence Layer</span>
                      <span className="text-[10px] text-slate-500 font-mono">Dual-Mode Ledger</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isFirestoreCloud
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
                  }`}>
                    {isFirestoreCloud ? 'CLOUD FIRESTORE' : 'LOCAL JSON'}
                  </span>
                </div>

                {/* Auth Mode */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-slate-200 font-medium block leading-tight">Access Control</span>
                      <span className="text-[10px] text-slate-500 font-mono">RBAC Governance</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isAuthStrict
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {isAuthStrict ? 'STRICT RBAC' : 'DEV MODE'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Scenario */}
        <button
          onClick={async () => {
            if (window.confirm("Reset demo scenario to clean deterministic state for Arabica Crisis walkthrough?")) {
              try {
                await api.resetDemo();
                onRefreshData();
                fetchStatus();
                alert("Demo scenario reset to initial clean state.");
              } catch (err) {
                console.error("Demo reset error:", err);
              }
            }
          }}
          title="Reset store data to clean deterministic state"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-1 hover:bg-surface-2 text-slate-300 hover:text-white border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3 h-3 text-brand-accent" />
          <span>Reset Demo</span>
        </button>

        {/* Refresh Telemetry */}
        <button
          onClick={() => {
            onRefreshData();
            fetchStatus();
          }}
          title="Refresh store telemetry"
          className="p-1.5 text-slate-400 hover:text-white bg-surface-1 hover:bg-surface-2 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-accent' : ''}`} />
        </button>

        {/* Global Copilot Launcher (⌘J) */}
        <button
          onClick={onOpenAskAI}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-bold text-xs shadow-glow-teal transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span>Copilot</span>
          <kbd className="hidden md:inline-block text-[9px] font-mono px-1 py-0.2 rounded bg-black/20 text-black border border-black/20 font-bold">
            ⌘J
          </kbd>
        </button>

        {/* Manager User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-900 to-indigo-900 border border-white/[0.15] flex items-center justify-center text-brand-accent font-bold text-xs">
            AR
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Arjun Rao</p>
            <p className="text-[10px] text-slate-400">Lead Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
