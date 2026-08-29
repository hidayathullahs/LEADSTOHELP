import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileCheck,
  CheckSquare,
  Radar,
  Activity,
  BarChart3,
  Settings,
  Sparkles,
  Radio,
  Sliders,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  TrendingDown,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Layers
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const STORE_HUBS = [
  { id: 'BLR-01', name: 'Deccan Roast Specialty Hub', code: '#BLR-01', city: 'Bangalore Indiranagar', skus: 65, status: 'Synced', isPrimary: true },
  { id: 'BLR-04', name: 'Whitefield Roastery Hub', code: '#BLR-04', city: 'Bangalore Whitefield', skus: 42, status: 'Synced', isPrimary: false },
  { id: 'BLR-02', name: 'Koramangala Express', code: '#BLR-02', city: 'Bangalore Koramangala', skus: 38, status: 'Synced', isPrimary: false }
];

export const NAV_GROUPS = [
  {
    title: 'Monitor',
    items: [
      { id: 'overview', label: 'Control Tower', icon: LayoutDashboard, badge: null, desc: 'Real-time multi-agent command' },
      { id: 'daily-ops', label: 'Daily Operations', icon: CalendarCheck2, badge: null, desc: 'Daily replenishment checklists' },
      { id: 'inventory', label: 'Inventory Risk', icon: Package, badge: '65 SKUs', desc: 'Depletion run-rates & buffers' },
    ]
  },
  {
    title: 'Decide',
    items: [
      { id: 'procurement', label: 'Procurement Decisions', icon: ShoppingCart, badge: '6 Scenarios', desc: 'What-If multi-sourcing twin' },
      { id: 'suppliers', label: 'Supplier Network', icon: Users, badge: '10 Partners', desc: 'SLA scorecards & reliability' },
    ]
  },
  {
    title: 'Verify',
    items: [
      { id: 'invoices', label: 'Invoice Vision Audit', icon: FileCheck, badge: 'OCR 3-Way', desc: 'Challan vs PO reconciliation' },
      { id: 'approvals', label: 'Approval Queue', icon: CheckSquare, badgeKey: 'pendingApprovals', desc: 'Human-governed PO sign-offs' },
    ]
  },
  {
    title: 'Understand',
    items: [
      { id: 'risk-radar', label: 'Supply Risk Radar', icon: Radar, badgeKey: 'riskScore', desc: 'Geopolitical & weather signals' },
      { id: 'agent-inspector', label: 'AI Pipeline Activity', icon: Activity, badge: 'Live Trace', desc: 'Multi-agent reasoning DAG' },
      { id: 'analytics', label: 'Impact & Analytics', icon: BarChart3, badge: '₹8.6k ROI', desc: 'Cost savings & stockout metric' },
    ]
  },
  {
    title: 'Configure',
    items: [
      { id: 'settings', label: 'Store Settings', icon: Settings, badge: null, desc: 'Safety buffers & API keys' },
    ]
  }
];

const WATCHLIST_SKUS = [
  { sku: 'COFFEE-001', name: 'Arabica AAA Grade', days: '2.8d', status: 'critical', badge: 'Stockout Risk' },
  { sku: 'MILK-002', name: 'Whole Dairy 3.5%', days: '4.1d', status: 'moderate', badge: 'Buffer Low' },
  { sku: 'SYRUP-004', name: 'Madagascar Vanilla', days: '1.5d', status: 'critical', badge: 'Urgent PO' }
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  metrics,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onOpenAskAI,
  onOpenProcurement
}) {
  const [selectedHub, setSelectedHub] = useState(STORE_HUBS[0]);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'watchlist' | 'quick-tools'

  // Filtered navigation based on in-sidebar search
  const filteredNavGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      !searchQuery || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-[#080B11] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none transition-all duration-300 z-40 ${
          isCollapsed ? 'w-16' : 'w-72'
        } ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl z-50 animate-in slide-in-from-left duration-200'
            : 'hidden lg:flex'
        }`}
      >
        {/* ========================================================= */}
        {/* TOP BRAND & STORE HUB SELECTOR HEADER                    */}
        {/* ========================================================= */}
        <div className="shrink-0">
          {/* Brand Row */}
          <div className="h-16 px-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0A0E18]/60">
            <button
              onClick={() => {
                setActiveTab('overview');
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center gap-3 text-left group overflow-hidden"
              title="Go to Control Tower Overview"
            >
              <img
                src={logoImg}
                alt="LEADSTOHELP AI Logo"
                className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.7)] group-hover:scale-105 transition-transform shrink-0"
              />
              {!isCollapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-extrabold text-sm tracking-wider text-white">LEADSTOHELP</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Autonomous Control Tower</p>
                </div>
              )}
            </button>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Desktop Collapse Toggle */}
            {!isMobileOpen && onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-white/[0.08]"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Store Hub Switcher Dropdown (When not collapsed) */}
          {!isCollapsed && (
            <div className="p-2.5 border-b border-white/[0.06] bg-[#07090E]/80 relative">
              <button
                type="button"
                onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
                className="w-full p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{selectedHub.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{selectedHub.code} • {selectedHub.skus} SKUs Synced</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-transform ${hubDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Hub Dropdown Menu */}
              {hubDropdownOpen && (
                <div className="absolute left-2.5 right-2.5 top-full mt-1 bg-slate-950 border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in space-y-1">
                  <div className="px-2 py-1 text-[10px] uppercase font-mono font-bold text-slate-400">
                    Switch Store Hub / Node
                  </div>
                  {STORE_HUBS.map(hub => (
                    <button
                      key={hub.id}
                      onClick={() => {
                        setSelectedHub(hub);
                        setHubDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                        selectedHub.id === hub.id
                          ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold truncate">{hub.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{hub.city} ({hub.code})</div>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {hub.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick In-Sidebar Search / Filter Bar */}
              <div className="mt-2 relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter workspace & data..."
                  className="w-full bg-slate-950/80 border border-white/[0.08] text-[11px] text-white placeholder-slate-500 rounded-lg pl-8 pr-6 py-1.5 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MAIN SCROLLABLE SECTION: NAVIGATION, DATASETS & TOOLS    */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 space-y-4">
          {/* 1. Grouped Core Navigation */}
          <nav className="space-y-4">
            {filteredNavGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="flex items-center justify-between px-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                    <span>{group.title}</span>
                    <span className="text-[9px] text-slate-400">{group.items.length}</span>
                  </div>
                )}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    // Dynamic badge computation
                    let badgeDisplay = item.badge;
                    let isAlertBadge = false;
                    if (item.badgeKey === 'pendingApprovals' && metrics?.pending_approvals_count > 0) {
                      badgeDisplay = `${metrics.pending_approvals_count} Action`;
                      isAlertBadge = true;
                    } else if (item.badgeKey === 'riskScore' && metrics?.risk_radar?.overall_score) {
                      badgeDisplay = `${Math.round(metrics.risk_radar.overall_score)} Risk`;
                      isAlertBadge = true;
                    }

                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className={`w-full flex items-center ${
                            isCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-2'
                          } rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 text-white font-bold border border-cyan-500/40 shadow-glow-teal'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className={`w-4 h-4 transition-colors shrink-0 ${
                              isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                            }`} />
                            {!isCollapsed && (
                              <div className="truncate text-left">
                                <div className={`truncate ${isActive ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                                  {item.label}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isCollapsed && badgeDisplay && (
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md shrink-0 ${
                                isAlertBadge
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                  : isActive
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-white/[0.06]'
                              }`}
                            >
                              {badgeDisplay}
                            </span>
                          )}
                        </button>

                        {/* Collapsed Tooltip */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-white/[0.15] rounded-xl shadow-2xl text-xs whitespace-nowrap z-50 animate-in fade-in">
                            <span className="font-bold text-white">{item.label}</span>
                            {badgeDisplay && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                                {badgeDisplay}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* 2. Critical Inventory Watchlist (Scrollable Left Section feature) */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Critical Watchlist</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500">Live POS</span>
              </div>

              <div className="space-y-1.5">
                {WATCHLIST_SKUS.map((item) => (
                  <button
                    key={item.sku}
                    onClick={() => {
                      if (onOpenProcurement) onOpenProcurement(item.sku);
                      else setActiveTab('procurement');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="w-full p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.06] hover:border-rose-500/40 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-white font-mono group-hover:text-cyan-300">{item.sku}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{item.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-rose-400 font-mono">{item.days}</div>
                      <div className="text-[9px] text-rose-400/80 uppercase font-mono">{item.badge}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Pending Action / Governance Shortcut */}
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-slate-900 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 uppercase font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Pending Governance</span>
                </span>
                <span className="badge-amber text-[9px] font-mono">1 QUEUED</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                PO-2026-0889 (₹86,328) staged for Arabica Split-Order replenishment.
              </p>
              <button
                onClick={() => {
                  setActiveTab('approvals');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <span>Review & Approve PO</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* 4. Quick Action Launchers */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono px-2 block">
                Quick Tool Launchers
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab('procurement');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.06] text-left transition-all hover:border-cyan-500/30 group"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-[10px] font-bold text-slate-200 group-hover:text-cyan-300">What-If Sim</div>
                  <div className="text-[9px] text-slate-400">6 Scenarios</div>
                </button>

                <button
                  onClick={() => {
                    if (onOpenAskAI) onOpenAskAI();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.06] text-left transition-all hover:border-purple-500/30 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-[10px] font-bold text-slate-200 group-hover:text-purple-300">AI Copilot</div>
                  <div className="text-[9px] text-slate-400">Press ⌘J</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM TELEMETRY FOOTER & SYSTEM STATUS                  */}
        {/* ========================================================= */}
        <div className={`p-3 border-t border-white/[0.08] bg-[#07090E]/90 shrink-0 ${
          isCollapsed ? 'flex justify-center p-2' : ''
        }`}>
          {isCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/[0.08] flex items-center justify-center" title="System Operational • 18ms">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>AI Telemetry Engine</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  18ms Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400">
                <div>Model: <span className="text-slate-200">Deterministic</span></div>
                <div>Ledger: <span className="text-slate-200">Cryptographic</span></div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
