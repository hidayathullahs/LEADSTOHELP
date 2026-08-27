import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileCheck,
  MessageSquareDiff,
  CheckSquare,
  Radar,
  Activity,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Control Tower', icon: LayoutDashboard, badge: null },
  { id: 'inventory', label: 'Inventory Intelligence', icon: Package, badge: null },
  { id: 'procurement', label: 'Procurement Simulator', icon: ShoppingCart, badge: null },
  { id: 'suppliers', label: 'Supplier Network', icon: Users, badge: null },
  { id: 'invoices', label: 'Invoice Auditor (Vision)', icon: FileCheck, badge: 'AI' },
  { id: 'negotiations', label: 'Vendor Negotiations', icon: MessageSquareDiff, badge: null },
  { id: 'approvals', label: 'Approval Center', icon: CheckSquare, badgeKey: 'pendingApprovals' },
  { id: 'risk-radar', label: 'Supply Risk Radar', icon: Radar, badgeKey: 'riskScore' },
  { id: 'agent-inspector', label: 'AI Activity & Inspector', icon: Activity, badge: 'Live' },
  { id: 'analytics', label: 'Impact & Analytics', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Store Settings', icon: Settings, badge: null },
];

export default function Sidebar({ activeTab, setActiveTab, metrics }) {
  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white">LEADSTOHELP</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Operations Control Tower</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Dynamic badge computation
            let badgeDisplay = item.badge;
            if (item.badgeKey === 'pendingApprovals' && metrics?.pending_approvals_count > 0) {
              badgeDisplay = metrics.pending_approvals_count;
            } else if (item.badgeKey === 'riskScore' && metrics?.risk_radar?.overall_score) {
              badgeDisplay = `${Math.round(metrics.risk_radar.overall_score)}`;
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {badgeDisplay && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeKey === 'pendingApprovals'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : item.badgeKey === 'riskScore'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {badgeDisplay}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Store Status */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900/40 m-3 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bengaluru Hub</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-slate-400 truncate">Deccan Roast Café #01</p>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">INR (₹) • Asia/Kolkata</p>
      </div>
    </aside>
  );
}
