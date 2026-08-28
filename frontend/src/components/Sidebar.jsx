import React from 'react';
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
  Bot
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Monitor',
    items: [
      { id: 'overview', label: 'Control Tower', icon: LayoutDashboard, badge: null },
      { id: 'daily-ops', label: 'Daily Operations', icon: CalendarCheck2, badge: null },
      { id: 'inventory', label: 'Inventory Risk', icon: Package, badge: null },
    ]
  },
  {
    title: 'Decide',
    items: [
      { id: 'procurement', label: 'Procurement Decisions', icon: ShoppingCart, badge: '6 Scenarios' },
      { id: 'suppliers', label: 'Supplier Network', icon: Users, badge: null },
    ]
  },
  {
    title: 'Verify',
    items: [
      { id: 'invoices', label: 'Invoice Vision Audit', icon: FileCheck, badge: 'OCR' },
      { id: 'approvals', label: 'Approval Queue', icon: CheckSquare, badgeKey: 'pendingApprovals' },
    ]
  },
  {
    title: 'Understand',
    items: [
      { id: 'risk-radar', label: 'Supply Risk Radar', icon: Radar, badgeKey: 'riskScore' },
      { id: 'agent-inspector', label: 'AI Activity', icon: Activity, badge: 'Live' },
      { id: 'analytics', label: 'Impact & Analytics', icon: BarChart3, badge: null },
    ]
  },
  {
    title: 'Configure',
    items: [
      { id: 'settings', label: 'Store Settings', icon: Settings, badge: null },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, metrics, onOpenAskAI }) {
  return (
    <aside className="w-60 bg-surface-0 border-r border-white/[0.06] flex flex-col justify-between shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="h-14 px-4 border-b border-white/[0.06] flex items-center justify-between">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-glow-teal group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xs tracking-wider text-white">LEADSTOHELP</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Control Tower</p>
            </div>
          </button>
        </div>

        {/* Grouped Navigation Sections */}
        <nav className="p-3 space-y-3.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2.5 block mb-1">
                {group.title}
              </span>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                // Dynamic badge computation
                let badgeDisplay = item.badge;
                let isAlertBadge = false;
                if (item.badgeKey === 'pendingApprovals' && metrics?.pending_approvals_count > 0) {
                  badgeDisplay = metrics.pending_approvals_count;
                  isAlertBadge = true;
                } else if (item.badgeKey === 'riskScore' && metrics?.risk_radar?.overall_score) {
                  badgeDisplay = `${Math.round(metrics.risk_radar.overall_score)}`;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-surface-2 text-white font-semibold border border-white/[0.08] shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-1 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-brand-accent' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {badgeDisplay && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full ${
                          isAlertBadge
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : item.badgeKey === 'riskScore'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isActive
                            ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30'
                            : 'bg-surface-3 text-slate-400 border border-white/[0.06]'
                        }`}
                      >
                        {badgeDisplay}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Store Hub Status */}
      <div className="p-3 border-t border-white/[0.06] bg-surface-1/60 m-2.5 rounded-xl border border-white/[0.04]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Store Hub Active</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">BLR-01</span>
        </div>
        <p className="text-[11px] text-slate-400 truncate">Deccan Roast Café • Hub #1</p>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-white/[0.04]">
          <span>65 Monitored SKUs</span>
          <span className="text-emerald-400 font-semibold">100% Synced</span>
        </div>
      </div>
    </aside>
  );
}
