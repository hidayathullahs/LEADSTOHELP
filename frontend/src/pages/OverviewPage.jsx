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
  Sliders
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
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
        <p className="text-sm">Loading Supply Chain Control Tower...</p>
      </div>
    );
  }

  const { metrics, risk_radar, critical_stockout_items, recent_timeline, pending_approvals } = overviewData;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Closed-Loop Value Proposition */}
      <div className="glass-card p-5 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Autonomous Control Tower
            </span>
            <span className="text-xs text-slate-400">Deccan Roast Specialty Coffee & Bakery</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            From supply-chain signals to verified business action.
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Continuous closed-loop operational intelligence: Stockout Run-rate Detection → Multi-Supplier Scenario Simulation → Vendor Target Negotiation → Human Approval Governance → Fulfillment Verification.
          </p>
        </div>

        <button
          onClick={onOpenAskAI}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Investigation</span>
        </button>
      </div>

      {/* 6 High-Density KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Risk Radar Score */}
        <div 
          onClick={() => onNavigateTo('risk-radar')}
          className="glass-card p-4 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Supply Risk Index</span>
            <Radar className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">
              {Math.round(risk_radar?.overall_score || 0)}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>{risk_radar?.critical_risks_count || 0} Critical Dimensions</span>
          </div>
        </div>

        {/* Metric 2: Stockout Health */}
        <div 
          onClick={() => onNavigateTo('inventory')}
          className="glass-card p-4 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Stockout Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-300">
              {metrics?.critical_stockout_count || 0}
            </span>
            <span className="text-xs text-slate-400">/ {metrics?.total_skus || 65} SKUs</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            COFFEE-001 at 2.8 days
          </p>
        </div>

        {/* Metric 3: Pending Human Approvals */}
        <div 
          onClick={() => onNavigateTo('approvals')}
          className="glass-card p-4 hover:border-cyan-500/40 transition-all cursor-pointer group bg-cyan-950/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-cyan-300">Pending Approvals</span>
            <Clock className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-cyan-300">
              {metrics?.pending_approvals_count || 0}
            </span>
            <span className="text-xs text-slate-400">Awaiting Sign-off</span>
          </div>
          <p className="mt-2 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
            <span>Human-in-the-Loop</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 4: Potential Negotiated Savings */}
        <div 
          onClick={() => onNavigateTo('negotiations')}
          className="glass-card p-4 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Simulated Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-400">
              ₹{(metrics?.total_potential_savings_inr || 0).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400/90 font-medium">
            Via Split & Tiered Strategy
          </p>
        </div>

        {/* Metric 5: Invoice Discrepancy Audits */}
        <div 
          onClick={() => onNavigateTo('invoices')}
          className="glass-card p-4 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Invoice Audits</span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-rose-400">
              {metrics?.unresolved_invoice_discrepancies || 0}
            </span>
            <span className="text-xs text-slate-400">Flags Found</span>
          </div>
          <p className="mt-2 text-[11px] text-rose-400/90 font-medium">
            1 Shortage (Kaveri Dairy)
          </p>
        </div>

        {/* Metric 6: Supplier Reliability */}
        <div 
          onClick={() => onNavigateTo('suppliers')}
          className="glass-card p-4 hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold">Supplier Reliability</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">
              {metrics?.average_supplier_reliability || 88.5}%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            10 Active Suppliers Vetted
          </p>
        </div>
      </div>

      {/* Main Grid: Risk Radar Breakdown (Left) + Operations Activity Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Risk Radar & Imminent Stockouts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Critical Stockout Action Banner */}
          {critical_stockout_items && critical_stockout_items.length > 0 && (
            <div className="glass-card p-5 border-rose-500/30 bg-rose-950/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <h3 className="text-xs font-bold uppercase text-rose-400 tracking-wider">
                    Immediate Stockout Threat Detected
                  </h3>
                </div>
                <span className="badge-rose">
                  {critical_stockout_items.length} SKU Affected
                </span>
              </div>

              <div className="space-y-3">
                {critical_stockout_items.map((item) => (
                  <div
                    key={item.sku}
                    className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{item.sku}</span>
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>Stock: <strong className="text-white">{item.current_stock} {item.unit}</strong></span>
                        <span>•</span>
                        <span>Run-Rate: <strong className="text-white">{item.daily_usage_avg} {item.unit}/day</strong></span>
                        <span>•</span>
                        <span className="text-rose-400 font-bold">Depletion: ~{item.days_of_supply} days</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => handleOpenEvidence(item.sku, `Evidence Trace: ${item.name} (${item.sku})`)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700"
                        title="View Grounded Evidence"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Evidence</span>
                      </button>
                      <button
                        onClick={() => handleOpenWhatIf(item.sku)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 text-xs font-semibold flex items-center gap-1 transition-all border border-indigo-700/50"
                        title="Simulate What-If Scenarios"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>What-If</span>
                      </button>
                      <button
                        onClick={() => onNavigateTo('procurement')}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-cyan"
                      >
                        <span>Simulate Split Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Action Impact Card Preview */}
              <div className="mt-4 pt-3 border-t border-rose-500/20">
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

          {/* 7-Factor Risk Radar Breakdown */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radar className="w-4 h-4 text-cyan-400" />
                  Supply Risk Radar Breakdown
                </h2>
                <p className="text-xs text-slate-400">7-Factor explainable operational risk engine</p>
              </div>
              <button
                onClick={() => onNavigateTo('risk-radar')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Deep-Dive Radar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {risk_radar?.dimensions?.map((dim) => (
                <div key={dim.dimension_name} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{dim.dimension_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">{dim.score.toFixed(0)}/100</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dim.score >= 50
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : dim.score >= 25
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {dim.level}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        dim.score >= 50 ? 'bg-rose-500' : dim.score >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Operations Timeline & Pending Sign-offs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pending Approvals Widget */}
          <div className="glass-card p-5 border-amber-500/20 bg-amber-950/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Human Approval Queue
              </h2>
              <span className="badge-amber">{pending_approvals?.length || 0} Pending</span>
            </div>

            {pending_approvals && pending_approvals.length > 0 ? (
              <div className="space-y-3">
                {pending_approvals.map((appr) => (
                  <div
                    key={appr.approval_id}
                    className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400">{appr.approval_id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {appr.type}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{appr.title}</h4>
                    <p className="text-[11px] text-slate-400">{appr.why_recommended}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px]">Cost: </span>
                        <strong className="text-white font-mono">₹{appr.cost_inr.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickApprove(appr.approval_id, 'APPROVED')}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onNavigateTo('approvals')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-all"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400/60 mb-1" />
                <span>All actions approved. Zero pending governance barriers.</span>
              </div>
            )}
          </div>

          {/* Realtime AI Activity Timeline */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Operations Timeline
                </h2>
                <p className="text-xs text-slate-400">Traceable multi-agent execution events</p>
              </div>
              <button
                onClick={() => onNavigateTo('agent-inspector')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Inspect Telemetry <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative pl-4 space-y-4 border-l border-slate-800">
              {recent_timeline?.map((evt) => (
                <div key={evt.event_id} className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0B0F19] ${
                      evt.badge_type === 'rose'
                        ? 'bg-rose-500'
                        : evt.badge_type === 'amber'
                        ? 'bg-amber-500'
                        : evt.badge_type === 'emerald'
                        ? 'bg-emerald-500'
                        : 'bg-cyan-500'
                    }`}
                  ></span>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-0.5">
                    <span>{evt.timestamp_display}</span>
                    <span className="uppercase font-bold text-cyan-400">{evt.stage}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200">{evt.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{evt.description}</p>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D121F] border border-indigo-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Supply Chain Digital Twin Simulator
              </h2>
              <button
                onClick={() => setWhatIfModalOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all"
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

