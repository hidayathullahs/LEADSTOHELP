import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Radar,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  RefreshCw,
  Sliders,
  Store,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Lock,
  Radio
} from 'lucide-react';
import ImpactCard from '../components/ImpactCard';
import EvidenceDrawer from '../components/EvidenceDrawer';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { api } from '../services/api';

export default function OverviewPage({
  overviewData,
  onNavigateTo,
  onOpenAskAI,
  onQuickApprove
}) {
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState([]);
  const [evidenceTitle, setEvidenceTitle] = useState('SKU Evidence & Grounding Trace');
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [activeWhatIfSku, setActiveWhatIfSku] = useState('COFFEE-001');

  const handleOpenEvidence = async (sku = 'COFFEE-001', title = 'SKU Evidence & Decision Trace') => {
    setEvidenceTitle(title);
    setEvidenceLoading(true);
    setEvidenceDrawerOpen(true);
    try {
      const data = await api.getSkuEvidence(sku);
      setEvidenceItems(data?.evidence || []);
    } catch (err) {
      console.error('Failed to load SKU evidence:', err);
      // Fallback evidence items if offline
      setEvidenceItems([
        { label: 'Current Stock', value: '36.0 kg', data_source: 'inventory_db', evidence_type: 'INVENTORY' },
        { label: 'Daily Run-Rate', value: '13.0 kg/day', data_source: 'sales_history', evidence_type: 'INVENTORY' },
        { label: 'Depletion Forecast', value: '2.8 days', data_source: 'forecast_engine', evidence_type: 'FORECAST' },
        { label: 'Stockout Risk Level', value: 'HIGH', data_source: 'risk_engine', evidence_type: 'RISK' }
      ]);
    } finally {
      setEvidenceLoading(false);
    }
  };

  const handleOpenWhatIf = (sku = 'COFFEE-001') => {
    setActiveWhatIfSku(sku);
    setWhatIfModalOpen(true);
  };

  if (!overviewData) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-accent" />
        <p className="text-sm font-medium">Synchronizing Supply Chain Control Tower...</p>
      </div>
    );
  }

  const { metrics, risk_radar, critical_stockout_items, recent_timeline, pending_approvals } = overviewData;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operations Feed
            </span>
            <span className="text-xs text-slate-400">Deccan Roast Specialty Hub • Bangalore</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Supply Chain Control Tower
          </h1>
        </div>

        {/* Executive Action Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenWhatIf('COFFEE-001')}
            className="btn-secondary text-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-accent" />
            <span>Digital Twin (What-If)</span>
          </button>

          <button
            onClick={() => onOpenAskAI("Run the Arabica Crisis demo")}
            className="btn-primary text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
            <span>Triage Arabica Risk (⌘J)</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Risk Radar Index */}
        <div 
          onClick={() => onNavigateTo('risk-radar')}
          className="glass-card-interactive p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Supply Risk Score</span>
            <div className="p-1.5 rounded-lg bg-surface-2 border border-white/[0.06] group-hover:border-rose-500/30 transition-colors">
              <Radar className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
              {Math.round(risk_radar?.overall_score || 37)}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
            <span className="text-rose-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              {risk_radar?.critical_risks_count || 1} Critical Alert
            </span>
            <span className="text-slate-500 text-[11px] font-mono group-hover:text-slate-300 flex items-center">
              Radar <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 2: Stockout Depletion Warnings */}
        <div 
          onClick={() => onNavigateTo('inventory')}
          className="glass-card-interactive p-4 cursor-pointer group border-amber-500/20 bg-gradient-to-b from-surface-1 to-amber-950/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Imminent Stockouts</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tabular-nums tracking-tight">
              {metrics?.critical_stockout_count || 1}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {metrics?.total_skus || 65} Monitored</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
            <span className="text-amber-300 font-medium truncate">
              COFFEE-001 (2.8d left)
            </span>
            <span className="text-slate-500 text-[11px] font-mono group-hover:text-slate-300 flex items-center">
              Stock <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 3: Pending Approvals */}
        <div 
          onClick={() => onNavigateTo('approvals')}
          className="glass-card-interactive p-4 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Pending Approvals</span>
            <div className="p-1.5 rounded-lg bg-surface-2 border border-white/[0.06] group-hover:border-brand-accent/30 transition-colors">
              <Clock className="w-4 h-4 text-brand-accent" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
              {metrics?.pending_approvals_count || 0}
            </span>
            <span className="text-xs text-slate-500 font-mono">Sign-off required</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
            <span className="text-brand-accent font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" /> Human-in-the-Loop
            </span>
            <span className="text-slate-500 text-[11px] font-mono group-hover:text-slate-300 flex items-center">
              Queue <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 4: Simulated Procurement Savings */}
        <div 
          onClick={() => onNavigateTo('analytics')}
          className="glass-card-interactive p-4 cursor-pointer group border-emerald-500/20 bg-gradient-to-b from-surface-1 to-emerald-950/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-300">Captured Savings</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tabular-nums tracking-tight">
              ₹{(metrics?.total_potential_savings_inr || 266512).toLocaleString()}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +₹8,672 on Arabica
            </span>
            <span className="text-slate-500 text-[11px] font-mono group-hover:text-slate-300 flex items-center">
              ROI <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Work Surface: Priority Threat Matrix (Left 7 Cols) + Governance & Live Stream (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Immediate Risk Resolution & AI Strategy (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Critical Stockout Resolution Card */}
          {critical_stockout_items && critical_stockout_items.length > 0 && (
            <div className="glass-card p-5 border-rose-500/30 bg-surface-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-amber-500 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Immediate Stockout Alert
                  </h2>
                </div>
                <span className="badge-rose">
                  {critical_stockout_items.length} Critical SKU
                </span>
              </div>

              {/* Item Burn-down Visualizer */}
              <div className="space-y-4">
                {critical_stockout_items.map((item) => (
                  <div
                    key={item.sku}
                    className="p-4 bg-surface-2/80 rounded-xl border border-white/[0.06] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                            {item.sku}
                          </span>
                          <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Depletes before weekend rush • Critical raw ingredient for 48% of store beverages
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEvidence(item.sku, `Grounded Evidence: ${item.name}`)}
                          className="btn-secondary text-xs px-2.5 py-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                          <span>Evidence</span>
                        </button>
                        <button
                          onClick={() => handleOpenWhatIf(item.sku)}
                          className="btn-secondary text-xs px-2.5 py-1 text-accent-violet hover:border-accent-violet/30"
                        >
                          <Sliders className="w-3.5 h-3.5 text-accent-violet" />
                          <span>What-If</span>
                        </button>
                        <button
                          onClick={() => onNavigateTo('procurement')}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          <span>Simulate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Burn-Down Bar */}
                    <div className="p-3 bg-surface-1 rounded-lg border border-white/[0.04] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400">Current Stock: <strong className="text-white font-mono">{item.current_stock} {item.unit}</strong></span>
                          <span className="text-slate-400">Run-Rate: <strong className="text-white font-mono">{item.daily_usage_avg} {item.unit}/day</strong></span>
                        </div>
                        <span className="text-rose-400 font-bold font-mono">
                          ~{item.days_of_supply} Days Remaining
                        </span>
                      </div>

                      {/* Progress visual bar */}
                      <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden flex">
                        <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Split-Order Action Card */}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <ImpactCard
                  impact={{
                    action_title: 'AI Recommended Strategy: Split-Order Replenishment',
                    cost_inr: 86328,
                    estimated_savings_inr: 8672,
                    stockout_risk_before: 88,
                    stockout_risk_after: 8,
                    supplier_concentration_before: 100,
                    supplier_concentration_after: 50,
                    service_continuity_improvement_pct: 42,
                    risk_level: 'LOW',
                    evidence_count: 8,
                  }}
                  onViewEvidence={() => handleOpenEvidence('COFFEE-001', 'Evidence Trace: Arabica Coffee Beans (COFFEE-001)')}
                  onSimulate={() => handleOpenWhatIf('COFFEE-001')}
                  onApprove={() => onNavigateTo('approvals')}
                />
              </div>
            </div>
          )}

          {/* 7-Factor Supply Risk Radar Breakdown */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radar className="w-4 h-4 text-brand-accent" />
                  Supply Risk Radar Breakdown
                </h2>
                <p className="text-xs text-slate-400">Continuous 7-dimension operational risk assessment</p>
              </div>
              <button
                onClick={() => onNavigateTo('risk-radar')}
                className="text-xs text-brand-accent hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                Full Radar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {risk_radar?.dimensions?.map((dim) => (
                <div key={dim.dimension_name} className="p-3 bg-surface-2/60 rounded-lg border border-white/[0.04] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dim.dimension_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{dim.score.toFixed(0)}/100</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          dim.score >= 50
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : dim.score >= 25
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {dim.level}
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress bar */}
                  <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        dim.score >= 50 ? 'bg-rose-500' : dim.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(6, dim.score))}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Governance Queue & Realtime Timeline (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Human Approval Queue */}
          <div className="glass-card p-5 border-amber-500/20 bg-surface-1">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">Human Approval Queue</h2>
                  <span className="text-[10px] text-slate-400 font-medium">Cryptographic Governance Barrier</span>
                </div>
              </div>
              <span className="badge-amber">{pending_approvals?.length || 0} Pending</span>
            </div>

            {pending_approvals && pending_approvals.length > 0 ? (
              <div className="space-y-3">
                {pending_approvals.map((appr) => (
                  <div
                    key={appr.approval_id}
                    className="p-3.5 bg-surface-2 rounded-xl border border-white/[0.06] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-accent font-bold">{appr.approval_id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {appr.type}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">{appr.title}</h4>
                    <p className="text-[11px] text-slate-400">{appr.why_recommended}</p>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px]">Net Commitment: </span>
                        <strong className="text-white font-mono font-bold">₹{appr.cost_inr.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickApprove(appr.approval_id, 'APPROVED')}
                          className="btn-success text-xs px-3 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onNavigateTo('approvals')}
                          className="btn-secondary text-xs px-2.5 py-1"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs space-y-1">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-400/80 mb-1" />
                <span className="font-semibold text-slate-300 block">All Actions Approved</span>
                <span className="text-[11px] text-slate-400">Zero pending governance barriers in queue.</span>
              </div>
            )}
          </div>

          {/* Realtime Operations Timeline */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-accent" />
                  Operations Activity Feed
                </h2>
                <p className="text-xs text-slate-400">Multi-agent execution & telemetry trace</p>
              </div>
              <button
                onClick={() => onNavigateTo('agent-inspector')}
                className="text-xs text-brand-accent hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                Inspect Telemetry <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative pl-4 space-y-4 border-l border-white/[0.08]">
              {recent_timeline?.slice(0, 5).map((evt) => (
                <div key={evt.event_id} className="relative group">
                  <span
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-surface-0 ${
                      evt.badge_type === 'rose'
                        ? 'bg-rose-500'
                        : evt.badge_type === 'amber'
                        ? 'bg-amber-500'
                        : evt.badge_type === 'emerald'
                        ? 'bg-emerald-500'
                        : 'bg-brand-accent'
                    }`}
                  ></span>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-0.5">
                    <span>{evt.timestamp_display}</span>
                    <span className="uppercase font-bold text-brand-accent">{evt.stage}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{evt.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Evidence & Grounding Trace Drawer */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={evidenceItems}
        title={evidenceTitle}
      />

      {/* What-If Digital Twin Modal */}
      {whatIfModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-1 border border-accent-violet/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent-violet" />
                Supply Chain Digital Twin Simulator ({activeWhatIfSku})
              </h2>
              <button
                onClick={() => setWhatIfModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Close Simulator
              </button>
            </div>
            <WhatIfSimulator sku={activeWhatIfSku} onClose={() => setWhatIfModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
