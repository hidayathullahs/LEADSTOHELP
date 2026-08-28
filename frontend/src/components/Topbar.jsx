import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Layers,
  Store,
  ChevronDown,
  Lock,
  Play,
  Activity,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';

export default function Topbar({
  onOpenAskAI,
  onRefreshData,
  isRefreshing,
  onOpenCommandPalette,
  onStartDemoTour,
  activeTab,
  onNavigateTo,
  user,
  onSignOut
}) {
  const [systemStatus, setSystemStatus] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);
  const statusRef = useRef(null);

  const fetchSystemStatus = async () => {
    try {
      const data = await api.getSystemStatus();
      setSystemStatus(data);
    } catch (err) {
      console.warn('Could not fetch system telemetry:', err);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetDemo = async () => {
    setResettingDemo(true);
    try {
      await api.resetDemo();
      if (onRefreshData) onRefreshData();
      fetchSystemStatus();
    } catch (err) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setResettingDemo(false);
    }
  };

  const isGeminiLive = systemStatus?.gemini?.live_available;
  const isFirestoreLive = systemStatus?.firestore?.live_available;

  return (
    <header className="h-14 bg-surface-0 border-b border-white/[0.06] px-4 flex items-center justify-between gap-3 select-none z-30">
      {/* Left: Store Selector & Perspective Pills */}
      <div className="flex items-center gap-2.5">
        {/* Store Location Breadcrumb */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-1 border border-white/[0.06] text-xs">
          <Store className="w-3.5 h-3.5 text-brand-accent shrink-0" />
          <span className="font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
            Deccan Roast Hub
          </span>
          <span className="text-[10px] font-mono text-slate-500 hidden md:inline">#BLR-01</span>
        </div>

        {/* Track / Perspective Switcher (Track 2 & Track 3 Quick Jump) */}
        <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-lg bg-surface-1 border border-white/[0.04] text-xs">
          <button
            onClick={() => onNavigateTo('overview')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-surface-2 text-white font-semibold shadow-sm border border-white/[0.06]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Track 2: Strategic Decisions"
          >
            <span>Control Tower</span>
          </button>

          <button
            onClick={() => onNavigateTo('daily-ops')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'daily-ops'
                ? 'bg-surface-2 text-brand-accent font-semibold shadow-sm border border-white/[0.06]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Track 3: Daily Operations & Productivity"
          >
            <Activity className="w-3 h-3 text-brand-accent" />
            <span>Daily Operations</span>
          </button>
        </div>
      </div>

      {/* Center: Universal Command Search Bar (⌘K) */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-surface-1 hover:bg-surface-2 border border-white/[0.08] hover:border-brand-accent/40 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-accent transition-colors" />
            <span className="truncate">Search SKUs, suppliers, POs, or ask AI...</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 bg-surface-2 px-1.5 py-0.5 rounded border border-white/[0.06] group-hover:border-white/[0.12]">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right: 3-Min Demo Guide, System Status, Notifications, Copilot Launcher, User Menu */}
      <div className="flex items-center gap-2">
        {/* 3-Minute Guided Demo Launcher */}
        <button
          onClick={onStartDemoTour}
          className="px-2.5 py-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 text-slate-300 hover:text-white border border-white/[0.06] text-xs font-semibold flex items-center gap-1.5 transition-all"
          title="Launch 3-Minute Interactive Tour"
        >
          <Play className="w-3 h-3 text-brand-accent fill-brand-accent" />
          <span className="hidden sm:inline">3-Min Tour</span>
        </button>

        {/* Unified System Health Status Popover */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-white/[0.06] text-xs text-slate-300 transition-all font-medium"
          >
            <span className={`w-2 h-2 rounded-full ${
              isGeminiLive && isFirestoreLive ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-emerald-400'
            }`} />
            <span className="hidden sm:inline">System Health</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface-2 text-slate-300 border border-white/[0.06]">
              {isGeminiLive && isFirestoreLive ? 'LIVE' : 'DEMO'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* System Health Dropdown Menu */}
          {statusMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-1 border border-white/[0.1] rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="font-bold text-white">System Runtime Telemetry</span>
                <span className="badge-teal text-[10px] font-mono">
                  {systemStatus?.environment?.toUpperCase() || 'DEVELOPMENT'}
                </span>
              </div>

              {/* Telemetry Items */}
              <div className="space-y-2">
                {/* Gemini Engine */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="text-slate-300">Gemini Intelligence</span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isGeminiLive
                      ? 'badge-emerald'
                      : 'badge-amber'
                  }`}>
                    {isGeminiLive ? 'LIVE CLOUD' : 'OFFLINE DEMO'}
                  </span>
                </div>

                {/* Firestore Database */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="text-slate-300">Ledger Database</span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isFirestoreLive
                      ? 'badge-emerald'
                      : 'badge-amber'
                  }`}>
                    {isFirestoreLive ? 'CLOUD FIRESTORE' : 'LOCAL JSON'}
                  </span>
                </div>

                {/* RBAC Governance Security */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">Governance Security</span>
                  </div>
                  <span className="badge-emerald text-[10px] font-mono font-bold">
                    STRICT RBAC
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 leading-tight">
                Deterministic mathematical engines guarantee zero hallucinated financial commitments.
              </div>
            </div>
          )}
        </div>

        {/* Demo State Reset Button */}
        <button
          onClick={handleResetDemo}
          disabled={resettingDemo}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-2 transition-all"
          title="Reset Arabica Crisis Demo State"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resettingDemo ? 'animate-spin text-brand-accent' : ''}`} />
        </button>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown onNavigateTo={onNavigateTo} />

        {/* Copilot Launcher Button (Track 1) */}
        <button
          onClick={onOpenAskAI}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          title="Launch Contextual Operations Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
          <span className="font-bold">Copilot</span>
          <span className="font-mono text-[10px] bg-black/15 px-1 py-0.2 rounded hidden sm:inline">
            ⌘J
          </span>
        </button>

        {/* User Account & Store Profile Menu */}
        <UserMenu
          user={user}
          onSignOut={onSignOut}
          onNavigateTo={onNavigateTo}
        />
      </div>
    </header>
  );
}
